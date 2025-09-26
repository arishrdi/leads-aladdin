<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            CabangSeeder::class,
            SumberLeadsSeeder::class,
            TipeKarpetSeeder::class,
            UserCabangSeeder::class,
            FollowUpStageSeeder::class,
            // LeadsSeeder::class,
            // FollowUpSeeder::class,
            // DokumenSeeder::class,
        ]);
    }
}
