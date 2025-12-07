<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\JadwalKuliah;

class JadwalController extends Controller
{
    public function index()
    {
        // Load data jadwal + data ruangan
        $jadwal = JadwalKuliah::with('ruangan')->orderBy('hari')->orderBy('jam_mulai')->get();
        return response()->json(['data' => $jadwal], 200);
    }

    public function store(Request $request)
    {
        // Validasi input
        $request->validate([
            'ruangan_id' => 'required|exists:ruangan,ruangan_id',
            'hari' => 'required',
            'jam_mulai' => 'required',
            'jam_selesai' => 'required',
            'mata_kuliah' => 'required',
            'nama_dosen' => 'required',
        ]);

        // Simpan
        $jadwal = JadwalKuliah::create($request->all());
        return response()->json(['message' => 'Jadwal berhasil disimpan', 'data' => $jadwal], 201);
    }

    public function destroy($id)
    {
        $jadwal = JadwalKuliah::find($id);
        if($jadwal) $jadwal->delete();
        return response()->json(['message' => 'Jadwal dihapus'], 200);
    }
}