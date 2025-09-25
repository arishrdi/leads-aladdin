<?php

namespace Database\Seeders;

use App\Models\KunjunganItemCategory;
use App\Models\KunjunganItem;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class KunjunganItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create categories
        $produkPendukung = KunjunganItemCategory::create([
            'nama' => 'Produk Pendukung',
            'deskripsi' => 'Produk pendukung yang tersedia di masjid',
            'input_type' => 'checkbox',
            'urutan' => 1,
            'is_active' => true,
        ]);

        $jamDigital = KunjunganItemCategory::create([
            'nama' => 'Jam Digital',
            'deskripsi' => 'Ukuran jam digital yang dibutuhkan',
            'input_type' => 'radio',
            'urutan' => 2,
            'is_active' => true,
        ]);

        $soundSystem = KunjunganItemCategory::create([
            'nama' => 'Sound System',
            'deskripsi' => 'Sistem audio yang tersedia',
            'input_type' => 'checkbox',
            'urutan' => 3,
            'is_active' => true,
        ]);

        // Create items for Produk Pendukung
        KunjunganItem::create([
            'kunjungan_item_category_id' => $produkPendukung->id,
            'nama' => 'Keset',
            'deskripsi' => 'Keset untuk pintu masuk masjid',
            'urutan' => 1,
            'is_active' => true,
        ]);

        KunjunganItem::create([
            'kunjungan_item_category_id' => $produkPendukung->id,
            'nama' => 'Parfum',
            'deskripsi' => 'Parfum ruangan untuk masjid',
            'urutan' => 2,
            'is_active' => true,
        ]);

        KunjunganItem::create([
            'kunjungan_item_category_id' => $produkPendukung->id,
            'nama' => 'Sajadah',
            'deskripsi' => 'Sajadah cadangan',
            'urutan' => 3,
            'is_active' => true,
        ]);

        // Create items for Jam Digital
        KunjunganItem::create([
            'kunjungan_item_category_id' => $jamDigital->id,
            'nama' => 'Kecil',
            'deskripsi' => 'Jam digital ukuran kecil (< 50cm)',
            'urutan' => 1,
            'is_active' => true,
        ]);

        KunjunganItem::create([
            'kunjungan_item_category_id' => $jamDigital->id,
            'nama' => 'Sedang',
            'deskripsi' => 'Jam digital ukuran sedang (50-100cm)',
            'urutan' => 2,
            'is_active' => true,
        ]);

        KunjunganItem::create([
            'kunjungan_item_category_id' => $jamDigital->id,
            'nama' => 'Besar',
            'deskripsi' => 'Jam digital ukuran besar (> 100cm)',
            'urutan' => 3,
            'is_active' => true,
        ]);

        // Create items for Sound System
        KunjunganItem::create([
            'kunjungan_item_category_id' => $soundSystem->id,
            'nama' => 'TOA',
            'deskripsi' => 'Sound system merek TOA',
            'urutan' => 1,
            'is_active' => true,
        ]);

        KunjunganItem::create([
            'kunjungan_item_category_id' => $soundSystem->id,
            'nama' => 'JBL',
            'deskripsi' => 'Sound system merek JBL',
            'urutan' => 2,
            'is_active' => true,
        ]);

        KunjunganItem::create([
            'kunjungan_item_category_id' => $soundSystem->id,
            'nama' => 'Wireless Mic',
            'deskripsi' => 'Microphone wireless',
            'urutan' => 3,
            'is_active' => true,
        ]);
    }
}
