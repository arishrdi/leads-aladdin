<?php

namespace Database\Seeders;

use App\Models\TipeKarpet;
use Illuminate\Database\Seeder;

class TipeKarpetSeeder extends Seeder
{
    public function run(): void
    {
        $tipeKarpets = [
            [
                'nama' => 'Karpet Masjid Premium',
                'deskripsi' => 'Karpet berkualitas tinggi untuk masjid dengan motif islami',
                'is_active' => true,
            ],
            [
                'nama' => 'Karpet Masjid Standard',
                'deskripsi' => 'Karpet masjid dengan kualitas standar namun terjangkau',
                'is_active' => true,
            ],
            [
                'nama' => 'Karpet Musholla',
                'deskripsi' => 'Karpet khusus untuk musholla dan ruang sholat kecil',
                'is_active' => true,
            ],
            [
                'nama' => 'Karpet Sajadah',
                'deskripsi' => 'Karpet sajadah individual dengan berbagai motif',
                'is_active' => true,
            ],
            [
                'nama' => 'Karpet Roll',
                'deskripsi' => 'Karpet dalam bentuk roll untuk area luas',
                'is_active' => true,
            ],
            [
                'nama' => 'Karpet Tile',
                'deskripsi' => 'Karpet berbentuk ubin yang mudah dipasang',
                'is_active' => true,
            ],
            [
                'nama' => 'Karpet Custom',
                'deskripsi' => 'Karpet dengan desain dan ukuran sesuai pesanan',
                'is_active' => true,
            ],
        ];

        foreach ($tipeKarpets as $tipe) {
            TipeKarpet::create($tipe);
        }
    }
}