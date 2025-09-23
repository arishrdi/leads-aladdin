<?php

namespace Database\Factories;

use App\Models\Cabang;
use App\Models\SumberLeads;
use App\Models\TipeKarpet;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Leads>
 */
class LeadsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'tanggal_leads' => fake()->date(),
            'sapaan' => fake()->randomElement(['Bapak', 'Ibu']),
            'nama_pelanggan' => fake()->name(),
            'no_whatsapp' => '62' . fake()->numerify('8##########'),
            'nama_masjid_instansi' => fake()->company(),
            'alamat' => fake()->address(),
            'sumber_leads_id' => SumberLeads::factory(),
            'catatan' => fake()->sentence(),
            'prioritas' => fake()->randomElement(['fastrek', 'normal', 'rendah']),
            'kebutuhan_karpet' => fake()->randomElement(['10x10 meter', '20x15 meter', '5x8 meter']),
            'potensi_nilai' => fake()->numberBetween(5000000, 50000000),
            'budget_min' => fake()->numberBetween(2000000, 10000000),
            'budget_max' => fake()->numberBetween(10000000, 100000000),
            'user_id' => User::factory(),
            'tipe_karpet_id' => TipeKarpet::factory(),
            'cabang_id' => Cabang::factory(),
            'status' => fake()->randomElement(['WARM', 'HOT', 'CUSTOMER', 'COLD', 'EXIT', 'CROSS_SELLING']),
            'is_active' => true,
        ];
    }
}
