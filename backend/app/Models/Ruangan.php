<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Ruangan extends Model
{
    use HasFactory;
    protected $table = 'ruangan';
    protected $primaryKey = 'ruangan_id';
    public $timestamps = false; // Tanpa created_at/updated_at
    protected $fillable = ['nama_ruangan', 'kapasitas', 'lokasi', 'keterangan'];

    public function peminjaman()
    {
        return $this->hasMany(Peminjaman::class, 'ruangan_id', 'ruangan_id');
    }
}