<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\Peminjaman; // Import Model Peminjaman
use App\Models\Ruangan; // Import Model Ruangan (untuk cek keberadaan)
use Carbon\Carbon;

class PeminjamanController extends Controller
{
    /**
     * Menyimpan pengajuan peminjaman baru dari Frontend.
     */
    public function store(Request $request)
    {
        // 1. Validasi Input (KF 4: Keperluan, Waktu)
        $validator = Validator::make($request->all(), [
            'ruangan_id' => 'required|exists:ruangan,ruangan_id',
            'tanggal_pinjam' => 'required|date|after_or_equal:today',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
            'keperluan' => 'required|string|max:255',
            // 'file_surat' => 'nullable|file|mimes:pdf|max:2048', // Jika file sudah diimplementasi
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validasi gagal', 'errors' => $validator->errors()], 422);
        }

        // 2. LOGIKA CEK BENTROK (CRUCIAL!)
        // Formula Overlap: (StartA < EndB) AND (EndA > StartB)
        $isConflict = Peminjaman::where('ruangan_id', $request->ruangan_id)
            ->where('tanggal_pinjam', $request->tanggal_pinjam)
            ->whereNotIn('status', ['ditolak_admin', 'ditolak_kajur']) // Hanya cek dengan yang aktif/pending
            ->where(function ($query) use ($request) {
                $query->where('jam_mulai', '<', $request->jam_selesai)
                      ->where('jam_selesai', '>', $request->jam_mulai);
            })
            ->exists();

        if ($isConflict) {
            return response()->json([
                'message' => 'Gagal mengajukan. Ruangan sudah terisi atau bentrok pada jam tersebut.'
            ], 409); // 409 Conflict
        }
        
        // 3. Simpan Data Peminjaman
        // Ambil user ID yang sedang login
        $mahasiswaId = Auth::user()->user_id; 

        $peminjaman = Peminjaman::create([
            'mahasiswa_id' => $mahasiswaId,
            'ruangan_id' => $request->ruangan_id,
            'tanggal_pinjam' => $request->tanggal_pinjam,
            'jam_mulai' => $request->jam_mulai,
            'jam_selesai' => $request->jam_selesai,
            'keperluan' => $request->keperluan,
            'status' => 'diajukan', // Status awal: diajukan
            // 'file_surat' => $filePath, // Jika upload file sukses
        ]);

        // 4. Respon Sukses
        return response()->json([
            'message' => 'Pengajuan peminjaman berhasil dikirim! Menunggu verifikasi Admin.',
            'data' => $peminjaman
        ], 201);
    }
}