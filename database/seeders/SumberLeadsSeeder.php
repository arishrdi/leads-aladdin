<?php

namespace Database\Seeders;

use App\Models\SumberLeads;
use Illuminate\Database\Seeder;

class SumberLeadsSeeder extends Seeder
{
    public function run(): void
    {
        $sumberLeads = [
            [
                'nama' => 'Google Ads',
                'deskripsi' => 'Iklan berbayar melalui Google AdWords',
                'is_active' => true,
            ],
            [
                'nama' => 'Facebook Ads',
                'deskripsi' => 'Iklan berbayar melalui Facebook dan Instagram',
                'is_active' => true,
            ],
            [
                'nama' => 'Referral',
                'deskripsi' => 'Rujukan dari pelanggan existing',
                'is_active' => true,
            ],
            [
                'nama' => 'Website',
                'deskripsi' => 'Organic traffic dari website perusahaan',
                'is_active' => true,
            ],
            [
                'nama' => 'WhatsApp Business',
                'deskripsi' => 'Kontak langsung melalui WhatsApp',
                'is_active' => true,
            ],
            [
                'nama' => 'Marketplace',
                'deskripsi' => 'Platform e-commerce seperti Tokopedia, Shopee',
                'is_active' => true,
            ],
            [
                'nama' => 'Pameran',
                'deskripsi' => 'Event dan pameran industri',
                'is_active' => true,
            ],
            [
                'nama' => 'Cold Call',
                'deskripsi' => 'Panggilan telepon prospektif',
                'is_active' => true,
            ],
        ];

        foreach ($sumberLeads as $sumber) {
            SumberLeads::create($sumber);
        }
    }
}