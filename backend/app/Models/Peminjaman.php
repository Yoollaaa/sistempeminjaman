<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Peminjaman extends Model
{
    protected $table = 'peminjaman';
    protected $primaryKey = 'id';
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
    ];

    protected $casts = [
        'tanggal_pinjam' => 'date',
        'jam_mulai' => 'datetime:H:i',
        'jam_selesai' => 'datetime:H:i',
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
