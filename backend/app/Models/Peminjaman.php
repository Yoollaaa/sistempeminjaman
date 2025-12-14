<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Peminjaman extends Model
{
    use HasFactory;

    protected $table = 'peminjaman'; 

    protected $fillable = [
        'mahasiswa_id', 
        'ruangan_id', 
        'tanggal_pinjam', 
        'jam_mulai', 
        'jam_selesai', 
        'keperluan', 
        'status', 
        'catatan_admin', 
        'catatan_kajur',
        'file_surat', 
    ];

    public function mahasiswa()
    {
        return $this->belongsTo(User::class, 'mahasiswa_id', 'user_id');
    }

    public function ruangan()
    {
        return $this->belongsTo(Ruangan::class, 'ruangan_id', 'ruangan_id');
    }
}