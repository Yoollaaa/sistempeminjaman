<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // KONFIGURASI PENTING UNTUK DB TEMAN ANDA
    protected $table = 'users';
    protected $primaryKey = 'user_id'; // Kunci utama bukan 'id'
    
    public $timestamps = false; // Matikan total timestamp agar tidak cari 'updated_at'

    // Daftar kolom yang boleh diisi
    protected $fillable = [
        'nama',    // PENTING: Pakai 'nama', bukan 'name'
        'email',
        'password',
        'role',
        'nim',
    ];

    protected $hidden = [
        'password',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }
}