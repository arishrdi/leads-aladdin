<?php

namespace Database\Seeders;

use App\Models\Cabang;
use Illuminate\Database\Seeder;

class CabangSeeder extends Seeder
{
    public function run(): void
    {
        $cabangs = [
            [
                'nama_cabang' => 'Jakarta Pusat',
                'lokasi' => 'Jakarta',
                'alamat' => 'Jl. Sudirman No. 123, Jakarta Pusat',
                'no_telp' => '6221-555-0001',
                'pic' => 'Bapak Hasan',
                'is_active' => true,
            ],
            [
                'nama_cabang' => 'Jakarta Timur',
                'lokasi' => 'Jakarta',
                'alamat' => 'Jl. Pemuda No. 456, Jakarta Timur',
                'no_telp' => '6221-555-0002',
                'pic' => 'Ibu Sari',
                'is_active' => true,
            ],
            [
                'nama_cabang' => 'Bogor',
                'lokasi' => 'Bogor',
                'alamat' => 'Jl. Pajajaran No. 789, Bogor',
                'no_telp' => '62251-555-0003',
                'pic' => 'Bapak Dedi',
                'is_active' => true,
            ],
            [
                'nama_cabang' => 'Tangerang',
                'lokasi' => 'Tangerang',
                'alamat' => 'Jl. BSD Raya No. 321, Tangerang',
                'no_telp' => '6221-555-0004',
                'pic' => 'Ibu Rina',
                'is_active' => true,
            ],
            [
                'nama_cabang' => 'Bekasi',
                'lokasi' => 'Bekasi',
                'alamat' => 'Jl. Ahmad Yani No. 654, Bekasi',
                'no_telp' => '6221-555-0005',
                'pic' => 'Bapak Anto',
                'is_active' => true,
            ],
        ];

        foreach ($cabangs as $cabang) {
            Cabang::create($cabang);
        }
    }
}