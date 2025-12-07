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
                'id' => 1,
                'nama_ruangan' => 'H5',
                'kapasitas' => 150,
                'lokasi' => 'Gedung H Lantai 3',
                'keterangan' => 'Lab Sistem Kendali',
            ],
            [
                'id' => 2,
                'nama_ruangan' => 'H20',
                'kapasitas' => 40,
                'lokasi' => 'Gedung H Lantai 1',
                'keterangan' => 'Ruang Kuliah Teori',
            ],
            [
                'id' => 3,
                'nama_ruangan' => 'H19',
                'kapasitas' => 40,
                'lokasi' => 'Gedung H Lantai 1',
                'keterangan' => 'Lab Jaringan Komputer',
            ],
            [
                'id' => 4,
                'nama_ruangan' => 'H17',
                'kapasitas' => 40,
                'lokasi' => 'Gedung H Lantai 1',
                'keterangan' => null,
            ],
            [
                'id' => 5,
                'nama_ruangan' => 'H18',
                'kapasitas' => 40,
                'lokasi' => 'Gedung H Lantai 1',
                'keterangan' => null,
            ],
            [
                'id' => 6,
                'nama_ruangan' => 'Laboratorium Teknik Komputer',
                'kapasitas' => 30,
                'lokasi' => 'Laboratorium Teknik Elektro',
                'keterangan' => null,
            ],
            [
                'id' => 7,
                'nama_ruangan' => 'Laboratorium Teknik Digital',
                'kapasitas' => 30,
                'lokasi' => 'Laboratorium Teknik Elektro',
                'keterangan' => null,
            ],
            [
                'id' => 8,
                'nama_ruangan' => 'Laboratorium Elektronika Kendali',
                'kapasitas' => 40,
                'lokasi' => 'Laboratorium Teknik Elektro',
                'keterangan' => null,
            ],
            [
                'id' => 9,
                'nama_ruangan' => 'Laboratorium Kendali',
                'kapasitas' => 40,
                'lokasi' => 'Laboratorium Teknik Elektro',
                'keterangan' => null,
            ],
            [
                'id' => 10,
                'nama_ruangan' => 'Laboratorium TTT',
                'kapasitas' => 40,
                'lokasi' => 'Laboratorium Teknik Elektro',
                'keterangan' => null,
            ],
            [
                'id' => 11,
                'nama_ruangan' => 'Laboratorium Konversi',
                'kapasitas' => 40,
                'lokasi' => 'Laboratorium Teknik Elektro',
                'keterangan' => null,
            ]
        ]);

        DB::table('jadwal')->insert([
            [
                'ruangan_id' => 5, // Mengacu ke H18
                'hari' => 'Senin',
                'jam_mulai' => '07:30:00',
                'jam_selesai' => '09:10:00',
                'mata_kuliah' => 'Kalkulus',
                'nama_dosen' => 'Dr. Eng. Diah Permata, S.T., M.T.',
            ],
            [
                'ruangan_id' => 1, // Mengacu ke H5
                'hari' => 'Selasa',
                'jam_mulai' => '07:30:00',
                'jam_selesai' => '09:10:00',
                'mata_kuliah' => 'Kapita Selekta',
                'nama_dosen' => 'Dr. Eng., Helmy Fitriawan, S.T., M.T.',
            ],
            [
                'ruangan_id' => 1,
                'hari' => 'Rabu',
                'jam_mulai' => '13:00:00',
                'jam_selesai' => '14:40:00',
                'mata_kuliah' => 'Etika Profesi',
                'nama_dosen' => 'M. Komarudin, M.T',
            ],
            [
                'ruangan_id' => 1,
                'hari' => 'Kamis',
                'jam_mulai' => '09:10:00',
                'jam_selesai' => '10:50:00',
                'mata_kuliah' => 'Logika',
                'nama_dosen' => 'Mardiana, Dr.Eng.',
            ],
            [
                'ruangan_id' => 2, // Mengacu ke H20
                'hari' => 'Jumat',
                'jam_mulai' => '10:00:00',
                'jam_selesai' => '11:40:00',
                'mata_kuliah' => 'Pengolahan Citra',
                'nama_dosen' => 'Yessi Mulyani, M.T.',
            ],
            [
                'ruangan_id' => 3, // Mengacu ke H19
                'hari' => 'Senin',
                'jam_mulai' => '07:30:00',
                'jam_selesai' => '09:10:00',
                'mata_kuliah' => 'Pengolahan Citra B',
                'nama_dosen' => 'Yessi Mulyani, M.T.',
            ],
            [
                'ruangan_id' => 7, // Mengacu ke Lab Teknik Digital
                'hari' => 'Senin',
                'jam_mulai' => '07:30:00',
                'jam_selesai' => '09:10:00',
                'mata_kuliah' => 'Sistem Pakar',
                'nama_dosen' => 'M. Komarudin, M.T',
            ],
            [
                'ruangan_id' => 1,
                'hari' => 'Senin',
                'jam_mulai' => '10:50:00',
                'jam_selesai' => '12:30:00',
                'mata_kuliah' => 'Proyek Teknologi Informasi',
                'nama_dosen' => 'Titin Yulianti, M.Eng',
            ],
            [
                'ruangan_id' => 6, // Mengacu ke Lab Teknik Komputer
                'hari' => 'Selasa',
                'jam_mulai' => '07:30:00',
                'jam_selesai' => '09:10:00',
                'mata_kuliah' => 'Penginderaan Jauh',
                'nama_dosen' => 'Trisya Septiana, S.T., M.T',
            ],
            [
                'ruangan_id' => 1,
                'hari' => 'Selasa',
                'jam_mulai' => '09:10:00',
                'jam_selesai' => '10:50:00',
                'mata_kuliah' => 'Analisa dan Perancangan Perangkat Lunak',
                'nama_dosen' => 'Rio Ariesta Pradipta, S.Kom., M.T.I',
            ],
            [
                'ruangan_id' => 1,
                'hari' => 'Selasa',
                'jam_mulai' => '10:50:00',
                'jam_selesai' => '12:30:00',
                'mata_kuliah' => 'Pengenalan Pemrograman',
                'nama_dosen' => 'Yessi Mulyani, M.T',
            ],
            [
                'ruangan_id' => 1,
                'hari' => 'Rabu',
                'jam_mulai' => '07:30:00',
                'jam_selesai' => '10:00:00',
                'mata_kuliah' => 'Manajemen Proyek Teknologi Informasi',
                'nama_dosen' => 'M. Komarudin, M.T',
            ],
            [
                'ruangan_id' => 4, // Mengacu ke H17
                'hari' => 'Rabu',
                'jam_mulai' => '15:30:00',
                'jam_selesai' => '17:10:00',
                'mata_kuliah' => 'Machine Learning',
                'nama_dosen' => 'Titin Yulianti, M.Eng',
            ],
            [
                'ruangan_id' => 1,
                'hari' => 'Kamis',
                'jam_mulai' => '10:50:00',
                'jam_selesai' => '12:30:00',
                'mata_kuliah' => 'Bahasa Indonesia',
                'nama_dosen' => 'Eka Sofia Agustin',
            ],
            [
                'ruangan_id' => 7,
                'hari' => 'Kamis',
                'jam_mulai' => '15:30:00',
                'jam_selesai' => '17:10:00',
                'mata_kuliah' => 'Sistem Pertanian Berkelanjutan',
                'nama_dosen' => 'Mona A.M Batubara, M.T',
            ],
            [
                'ruangan_id' => 1,
                'hari' => 'Jumat',
                'jam_mulai' => '13:00:00',
                'jam_selesai' => '15:30:00',
                'mata_kuliah' => 'Probabilitas dan Statistika',
                'nama_dosen' => 'Trisya Septiana, S.T.,M.T',
            ],
            [
                'ruangan_id' => 4,
                'hari' => 'Jumat',
                'jam_mulai' => '13:00:00',
                'jam_selesai' => '15:30:00',
                'mata_kuliah' => 'Sistem Basis Data C',
                'nama_dosen' => 'Puput Budi Wintoro, S. Kom, M.T.I',
            ],
        ]);
        // 4. ISI DATA PEMINJAMAN (sample)
        $this->call(PeminjamanSeeder::class);
    }
}