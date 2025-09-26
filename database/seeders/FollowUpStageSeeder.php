<?php

namespace Database\Seeders;

use App\Models\FollowUpStage;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FollowUpStageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define default follow-up stages based on business requirements
        $stages = [
            'greeting' => [
                'name' => 'Greeting',
                'next_stage_key' => 'impresi',
            ],
            'impresi' => [
                'name' => 'Impresi',
                'next_stage_key' => 'small_talk',
            ],
            'small_talk' => [
                'name' => 'Small Talk',
                'next_stage_key' => 'rekomendasi',
            ],
            'rekomendasi' => [
                'name' => 'Rekomendasi',
                'next_stage_key' => 'pengajuan_survei',
            ],
            'pengajuan_survei' => [
                'name' => 'Pengajuan Survei',
                'next_stage_key' => 'presentasi',
            ],
            'presentasi' => [
                'name' => 'Presentasi',
                'next_stage_key' => 'form_pemesanan',
            ],
            'form_pemesanan' => [
                'name' => 'Form Pemesanan',
                'next_stage_key' => 'up_cross_selling',
            ],
            'up_cross_selling' => [
                'name' => 'Up / Cross Selling',
                'next_stage_key' => 'invoice',
            ],
            'invoice' => [
                'name' => 'Invoice (Pembayaran)',
                'next_stage_key' => 'konfirmasi_pemasangan',
            ],
            'konfirmasi_pemasangan' => [
                'name' => 'Konfirmasi Pemasangan',
                'next_stage_key' => null,
            ],
        ];
        
        $order = 1;
        foreach ($stages as $key => $stageData) {
            FollowUpStage::updateOrCreate(
                ['key' => $key],
                [
                    'name' => $stageData['name'],
                    'display_order' => $order,
                    'next_stage_key' => $stageData['next_stage_key'],
                    'is_active' => true,
                ]
            );
            $order++;
        }

        $this->command->info('Follow-up stages seeded successfully!');
    }
}
