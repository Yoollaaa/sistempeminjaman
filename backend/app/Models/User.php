<?php

namespace App\Models;

// WAJIB: Import HasApiTokens untuk fitur Sanctum (Token Akses)
use Laravel\Sanctum\HasApiTokens; 
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    // WAJIB: Gunakan trait HasApiTokens untuk sistem API
    use HasApiTokens, HasFactory, Notifiable;

    // KOREKSI 1: Menyesuaikan Primary Key dari 'id' menjadi 'user_id'
    protected $primaryKey = 'user_id';
    
    // KOREKSI 2: Menonaktifkan 'updated_at' (sesuai skema teman Anda)
    const UPDATED_AT = null;
    const CREATED_AT = 'created_at'; 

    /**
     * The attributes that are mass assignable.
     * Disesuaikan dengan kolom yang ada di tabel users (skema teman)
     */
    protected $fillable = [
        'nama',      // Ditambahkan
        'email',
        'password',
        'nim',       // Ditambahkan
        'role',      // Ditambahkan
    ];

    /**
     * The attributes that should be hidden for serialization.
     * Kolom yang tidak akan dikirim ke React
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     * Mengatur casting (misalnya password harus di-hash)
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed', // Wajib: agar password dienkripsi saat dibuat
        ];
    }
}