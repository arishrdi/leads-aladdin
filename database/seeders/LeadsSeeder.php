<?php

namespace Database\Seeders;

use App\Models\Leads;
use App\Models\User;
use App\Models\Cabang;
use App\Models\SumberLeads;
use App\Models\TipeKarpet;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class LeadsSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        
        // Get existing data
        $marketingUsers = User::where('role', 'marketing')->get();
        $cabangs = Cabang::all();
        $sumberLeads = SumberLeads::all();
        $tipeKarpets = TipeKarpet::all();
        
        $leadData = [
            // Active leads with various stages
            [
                'sapaan' => 'Bapak',
                'nama_pelanggan' => 'Ustadz Ahmad Hidayat',
                'no_whatsapp' => '628123456789',
                'nama_masjid_instansi' => 'Masjid Al-Ikhlas',
                'alamat' => 'Jl. Masjid Raya No. 15, Jakarta Selatan',
                'status' => 'WARM',
                'budget_min' => 50000000,
                'budget_max' => 75000000,
                'catatan' => 'Renovasi masjid, butuh karpet premium untuk area utama',
            ],
            [
                'sapaan' => 'Ibu',
                'nama_pelanggan' => 'Hajjah Fatimah',
                'no_whatsapp' => '628234567890',
                'nama_masjid_instansi' => 'Musholla Al-Barokah',
                'alamat' => 'Komplek Perumahan Griya Indah, Bogor',
                'status' => 'HOT',
                'budget_min' => 15000000,
                'budget_max' => 25000000,
                'catatan' => 'Musholla baru, perlu karpet sajadah dan area utama',
            ],
            [
                'sapaan' => 'Bapak',
                'nama_pelanggan' => 'H. Muhammad Yusuf',
                'no_whatsapp' => '628345678901',
                'nama_masjid_instansi' => 'Masjid Nurul Huda',
                'alamat' => 'Jl. Raya Bekasi No. 88, Bekasi',
                'status' => 'HOT',
                'budget_min' => 100000000,
                'budget_max' => 150000000,
                'catatan' => 'Proyek besar, masjid 2 lantai dengan kapasitas 1000 jamaah',
            ],
            [
                'sapaan' => 'Ustadz',
                'nama_pelanggan' => 'Abdul Rahman',
                'no_whatsapp' => '628456789012',
                'nama_masjid_instansi' => 'Masjid At-Taqwa',
                'alamat' => 'Jl. Pesantren No. 45, Tangerang',
                'status' => 'CUSTOMER',
                'budget_min' => 30000000,
                'budget_max' => 40000000,
                'tanggal_closing' => now()->subDays(5),
                'nominal_deal' => 35000000,
                'catatan' => 'Deal closed, karpet premium untuk masjid pesantren',
            ],
            [
                'sapaan' => 'Bapak',
                'nama_pelanggan' => 'Ir. Bambang Sutrisno',
                'no_whatsapp' => '628567890123',
                'nama_masjid_instansi' => 'Masjid Perusahaan PT. Maju Jaya',
                'alamat' => 'Kawasan Industri MM2100, Bekasi',
                'status' => 'WARM',
                'budget_min' => 20000000,
                'budget_max' => 35000000,
                'catatan' => 'Masjid perusahaan, butuh karpet tahan lama',
            ],
            [
                'sapaan' => 'Ibu',
                'nama_pelanggan' => 'Dr. Siti Khadijah',
                'no_whatsapp' => '628678901234',
                'nama_masjid_instansi' => 'Musholla RS. Sehat Sejahtera',
                'alamat' => 'Jl. Kesehatan No. 12, Jakarta Timur',
                'status' => 'COLD',
                'budget_min' => 10000000,
                'budget_max' => 18000000,
                'catatan' => 'Musholla rumah sakit, butuh karpet mudah dibersihkan',
            ],
            [
                'sapaan' => 'Bapak',
                'nama_pelanggan' => 'KH. Abdullah Mustofa',
                'no_whatsapp' => '628789012345',
                'nama_masjid_instansi' => 'Pondok Pesantren Al-Hikmah',
                'alamat' => 'Jl. Pondok Pesantren No. 99, Bogor',
                'status' => 'HOT',
                'budget_min' => 80000000,
                'budget_max' => 120000000,
                'catatan' => 'Renovasi total masjid pesantren dengan 3 lantai',
            ],
            [
                'sapaan' => 'Ustadz',
                'nama_pelanggan' => 'Hafidz Quraisy',
                'no_whatsapp' => '628890123456',
                'nama_masjid_instansi' => 'Masjid Al-Qur\'an',
                'alamat' => 'Komplek Islamic Center, Jakarta Pusat',
                'status' => 'HOT',
                'budget_min' => 60000000,
                'budget_max' => 90000000,
                'catatan' => 'Masjid tahfidz, perlu karpet berkualitas tinggi',
            ],
        ];

        foreach ($leadData as $index => $lead) {
            Leads::create([
                'tanggal_leads' => now()->subDays(rand(1, 30)),
                'user_id' => $marketingUsers->random()->id,
                'cabang_id' => $cabangs->random()->id,
                'sumber_leads_id' => $sumberLeads->random()->id,
                'tipe_karpet_id' => $tipeKarpets->random()->id,
                'sapaan' => $lead['sapaan'],
                'nama_pelanggan' => $lead['nama_pelanggan'],
                'no_whatsapp' => $lead['no_whatsapp'],
                'nama_masjid_instansi' => $lead['nama_masjid_instansi'],
                'alamat' => $lead['alamat'],
                'status' => $lead['status'],
                'budget_min' => $lead['budget_min'],
                'budget_max' => $lead['budget_max'],
                'tanggal_closing' => $lead['tanggal_closing'] ?? null,
                'nominal_deal' => $lead['nominal_deal'] ?? null,
                'catatan' => $lead['catatan'],
                'created_at' => now()->subDays(rand(1, 30)),
            ]);
        }

        // Add some more random leads
        for ($i = 0; $i < 20; $i++) {
            $status = $faker->randomElement(['WARM', 'HOT', 'CUSTOMER', 'EXIT', 'COLD', 'CROSS_SELLING']);
            $budgetMin = $faker->numberBetween(5, 50) * 1000000;
            $budgetMax = $budgetMin + $faker->numberBetween(10, 50) * 1000000;
            $createdAt = $faker->dateTimeBetween('-60 days', 'now');
            
            Leads::create([
                'tanggal_leads' => $createdAt,
                'user_id' => $marketingUsers->random()->id,
                'cabang_id' => $cabangs->random()->id,
                'sumber_leads_id' => $sumberLeads->random()->id,
                'tipe_karpet_id' => $tipeKarpets->random()->id,
                'sapaan' => $faker->randomElement(['Bapak', 'Ibu', 'Ustadz', 'Ustadzah']),
                'nama_pelanggan' => $faker->name,
                'no_whatsapp' => '628' . $faker->numerify('#########'),
                'nama_masjid_instansi' => $faker->randomElement([
                    'Masjid ' . $faker->randomElement(['Al-Ikhlas', 'An-Nur', 'At-Taqwa', 'Al-Hidayah', 'Ar-Rahman']),
                    'Musholla ' . $faker->randomElement(['Al-Barokah', 'Al-Falah', 'As-Salam', 'Al-Mukmin', 'At-Taubah']),
                    'Pondok Pesantren ' . $faker->randomElement(['Al-Hikmah', 'Darul Ulum', 'An-Nuriyah', 'Al-Munawwir']),
                ]),
                'alamat' => $faker->address,
                'status' => $status,
                'budget_min' => $budgetMin,
                'budget_max' => $budgetMax,
                'tanggal_closing' => $status === 'CUSTOMER' ? $faker->dateTimeBetween('-30 days', 'now') : null,
                'nominal_deal' => $status === 'CUSTOMER' ? $faker->numberBetween($budgetMin, $budgetMax) : null,
                'catatan' => $faker->sentence(10),
                'created_at' => $createdAt,
            ]);
        }
    }
}