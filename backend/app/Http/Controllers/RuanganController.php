<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ruangan; // Pastikan Model Ruangan diimport
use Illuminate\Support\Facades\Validator;

class RuanganController extends Controller
{
    /**
     * 1. GET: Mengambil semua data ruangan
     */
    public function index()
    {
        // Ambil semua data ruangan
        $ruangan = Ruangan::all();

        return response()->json([
            'message' => 'Daftar ruangan berhasil dimuat.',
            'data' => $ruangan
        ], 200);
    }

    /**
     * 2. POST: Menyimpan ruangan baru
     */
    public function store(Request $request)
    {
        // Validasi
        $validator = Validator::make($request->all(), [
            'nama_ruangan' => 'required|string|max:255',
            'kapasitas'    => 'required|integer',
            'lokasi'       => 'nullable|string', // Pastikan validasi 'lokasi'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validasi gagal', 'errors' => $validator->errors()], 422);
        }

        // Simpan ke database
        $ruangan = Ruangan::create([
            'nama_ruangan' => $request->nama_ruangan,
            'kapasitas'    => $request->kapasitas,
            'lokasi'       => $request->lokasi,      // <--- PENTING: Simpan Lokasi
            'keterangan'   => $request->keterangan,  // Opsional jika frontend kirim keterangan juga
        ]);

        return response()->json(['message' => 'Ruangan berhasil ditambahkan.', 'data' => $ruangan], 201);
    }

    /**
     * 3. PUT: Mengupdate data ruangan
     */
    public function update(Request $request, $id)
    {
        $ruangan = Ruangan::find($id);
        if (!$ruangan) return response()->json(['message' => 'Ruangan tidak ditemukan.'], 404);

        // Update (Gunakan 'lokasi')
        $ruangan->update([
            'nama_ruangan' => $request->nama_ruangan ?? $ruangan->nama_ruangan,
            'kapasitas'    => $request->kapasitas ?? $ruangan->kapasitas,
            'lokasi'       => $request->lokasi ?? $ruangan->lokasi, // <--- PENTING: Update Lokasi
            'keterangan'   => $request->keterangan ?? $ruangan->keterangan,
        ]);

        return response()->json(['message' => 'Data ruangan berhasil diperbarui.', 'data' => $ruangan], 200);
    }

    /**
     * 4. DELETE: Menghapus ruangan
     */
    public function destroy($id)
    {
        $ruangan = Ruangan::find($id);

        if (!$ruangan) {
            return response()->json(['message' => 'Ruangan tidak ditemukan.'], 404);
        }

        $ruangan->delete();

        return response()->json([
            'message' => 'Ruangan berhasil dihapus.'
        ], 200);
    }
}