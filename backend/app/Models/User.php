<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Peminjaman; 

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'users';
    protected $primaryKey = 'user_id'; 
    
    protected $with = ['peminjaman']; 
    
    public $timestamps = false; 

    protected $fillable = [
        'nama', 
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
        public function peminjaman()
    {
        return $this->hasMany(\App\Models\Peminjaman::class, 'id_mahasiswa', 'user_id'); 
    }
}