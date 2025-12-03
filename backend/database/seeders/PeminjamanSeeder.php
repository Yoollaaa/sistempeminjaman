<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PeminjamanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('peminjaman')->insert([
            [
                'mahasiswa_id' => 1,
                'ruangan_id' => 1,
                'tanggal_pinjam' => Carbon::tomorrow(),
                'jam_mulai' => '08:00',
                'jam_selesai' => '10:00',
                'keperluan' => 'Praktik Sistem Kendali',
                'status' => 'diajukan',
                'catatan_admin' => null,
                'catatan_kajur' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'mahasiswa_id' => 1,
                'ruangan_id' => 2,
                'tanggal_pinjam' => Carbon::tomorrow()->addDay(),
                'jam_mulai' => '13:00',
                'jam_selesai' => '15:00',
                'keperluan' => 'Seminar Teknik Industri',
                'status' => 'disetujui_admin',
                'catatan_admin' => 'Disetujui, ruang tersedia',
                'catatan_kajur' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'mahasiswa_id' => 1,
                'ruangan_id' => 3,
                'tanggal_pinjam' => Carbon::yesterday(),
                'jam_mulai' => '10:00',
                'jam_selesai' => '12:00',
                'keperluan' => 'Lab Jaringan Komputer',
                'status' => 'ditolak_admin',
                'catatan_admin' => 'Ruang sudah dipesan',
                'catatan_kajur' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
