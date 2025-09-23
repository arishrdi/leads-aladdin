<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Cabang>
 */
class CabangFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama_cabang' => fake()->company(),
            'lokasi' => fake()->city(),
            'alamat' => fake()->address(),
            'no_telp' => fake()->phoneNumber(),
            'pic' => fake()->name(),
            'is_active' => true,
        ];
    }
}
