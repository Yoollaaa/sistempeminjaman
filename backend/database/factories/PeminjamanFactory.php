<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factory<\App\Models\Peminjaman>
 */
class PeminjamanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'mahasiswa_id' => \App\Models\User::factory(),
            'ruangan_id' => \App\Models\Ruangan::factory(),
            'tanggal_pinjam' => $this->faker->dateTimeBetween('+1 day', '+30 days')->format('Y-m-d'),
            'jam_mulai' => $this->faker->time('H:i'),
            'jam_selesai' => $this->faker->time('H:i'),
            'keperluan' => $this->faker->sentences(2, true),
            'status' => $this->faker->randomElement(['diajukan', 'disetujui_admin', 'ditolak_admin', 'disetujui_kajur']),
            'catatan_admin' => null,
            'catatan_kajur' => null,
            'file_surat' => null,
        ];
    }
}
