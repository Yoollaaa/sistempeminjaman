<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB; // Kita pakai DB Facade biar aman
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. BERSIHKAN DATA LAMA (Opsional, biar tidak duplikat)
        // DB::table('users')->truncate(); 
        // DB::table('ruangan')->truncate();

        // 2. ISI DATA USER (Manual via Query Builder)
        DB::table('users')->insert([
            [
                'nama' => 'Budi Mahasiswa',
                'email' => 'mahasiswa@test.com',
                'password' => Hash::make('123456'),
                'role' => 'mahasiswa',
                'nim' => '2315061003',
                'created_at' => now(),
            ],
            [
                'nama' => 'Admin Jurusan',
                'email' => 'admin@test.com',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'nim' => '1001',
                'created_at' => now(),
            ],
            [
                'nama' => 'Ketua Jurusan',
                'email' => 'kajur@test.com',
                'password' => Hash::make('kajur123'),
                'role' => 'ketua_jurusan', // Pastikan sesuai enum database
                'nim' => '2001',
                'created_at' => now(),
            ]
        ]);

        // 3. ISI DATA RUANGAN
        DB::table('ruangan')->insert([
            [
                'nama_ruangan' => 'H5',
                'keterangan' => 'Lab Sistem Kendali',
                'kapasitas' => 40,
                'lokasi' => 'Gedung H Lantai 1',
            ],
            [
                'nama_ruangan' => 'H20',
                'keterangan' => 'Ruang Kuliah Teori',
                'kapasitas' => 60,
                'lokasi' => 'Gedung H Lantai 2',
            ],
            [
                'nama_ruangan' => 'H19',
                'keterangan' => 'Lab Jaringan Komputer',
                'kapasitas' => 30,
                'lokasi' => 'Gedung H Lantai 2',
            ]
        ]);
    }
}