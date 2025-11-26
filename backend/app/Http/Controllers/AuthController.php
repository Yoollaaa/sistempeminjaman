<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * Menangani proses pendaftaran user baru (Mahasiswa).
     */
    public function register(Request $request)
    {
        // Validasi yang ketat (penting untuk API)
        $request->validate([
            'nama' => 'required|string|max:100',
            'nim' => 'required|string|unique:users,nim|max:20', 
            'email' => 'required|string|email|unique:users,email|max:100',
            'password' => 'required|string|min:6|confirmed', 
        ]);

        // Buat User Baru
        $user = User::create([
            'nama' => $request->nama,
            'nim' => $request->nim,
            'email' => $request->email,
            'password' => Hash::make($request->password), // Enkripsi Password
            'role' => 'mahasiswa', 
        ]);

        return response()->json([
            'message' => 'Pendaftaran berhasil. Silakan Login.',
            'user' => $user
        ], 201);
    }

    /**
     * Menangani proses login user dan mengeluarkan token akses.
     */
    public function login(Request $request)
    {
        // 1. Validasi Input
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 2. Cek Kredensial ke Database
        // Catatan: Karena kita menggunakan custom primary key (user_id), Auth::attempt tetap berfungsi
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Login gagal! Email atau password salah.'
            ], 401);
        }

        // 3. Ambil Data User dan Buat Token
        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken; // Token via Sanctum

        // 4. Kirim Respon JSON yang dicari React
        return response()->json([
            'message' => 'Login berhasil',
            'access_token' => $token,
            'user' => [ 
                'user_id' => $user->user_id,
                'nama' => $user->nama, // Menggunakan kolom 'nama'
                'email' => $user->email,
                'role' => $user->role,
            ]
        ], 200);
    }

    public function logout()
    {
        Auth::user()->tokens()->delete();
        return response()->json(['message' => 'Logout berhasil']);
    }
}