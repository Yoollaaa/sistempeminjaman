<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JadwalKuliah extends Model
{
    protected $table = 'jadwal_kuliah';
    // Pastikan nama kolom sesuai migrasi
    protected $fillable = ['ruangan_id', 'hari', 'jam_mulai', 'jam_selesai', 'mata_kuliah', 'nama_dosen'];

    public function ruangan()
    {
        return $this->belongsTo(Ruangan::class, 'ruangan_id', 'ruangan_id');
    }
}