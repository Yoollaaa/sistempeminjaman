<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ruangan; // WAJIB: Import Model Ruangan

class RuanganController extends Controller
{
    /**
     * Mengambil daftar semua ruangan.
     * Endpoint ini diproteksi, hanya bisa diakses setelah user login.
     */
    public function index(Request $request)
    {
        // Ambil semua data ruangan (menggunakan Model Ruangan yang sudah dikonfigurasi)
        $ruangan = Ruangan::all();

        // Mengirimkan data dalam format JSON ke React
        return response()->json([
            'message' => 'Daftar ruangan berhasil dimuat.',
            'data' => $ruangan
        ], 200);
    }
}