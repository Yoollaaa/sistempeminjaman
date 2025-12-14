<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factory<\App\Models\Ruangan>
 */
class RuanganFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama_ruangan' => $this->faker->words(2, true),
            'kapasitas' => $this->faker->numberBetween(20, 100),
            'lokasi' => $this->faker->streetAddress(),
            'keterangan' => $this->faker->sentences(2, true),
        ];
    }
}
