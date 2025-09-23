<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TipeKarpet>
 */
class TipeKarpetFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama' => fake()->randomElement(['Karpet Masjid', 'Karpet Sajadah', 'Karpet Turki', 'Karpet Iran']),
            'deskripsi' => fake()->sentence(),
            'is_active' => true,
        ];
    }
}
