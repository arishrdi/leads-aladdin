<?php

namespace Database\Seeders;

use App\Models\FollowUp;
use App\Models\Leads;
use App\Models\User;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class FollowUpSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        
        $leads = Leads::with('user')->get();
        $stages = ['1_kontak_awal', '2_presentasi', '3_survey', '4_penawaran', '5_negosiasi', '6_demo', '7_proposal', '8_kontrak', '9_pembayaran', '10_closing'];
        
        foreach ($leads as $lead) {
            // Create follow-ups based on lead status
            $followUpCount = match($lead->status) {
                'NEW' => rand(1, 2),
                'QUALIFIED' => rand(2, 4),
                'WARM' => rand(3, 6),
                'HOT' => rand(5, 8),
                'CONVERTED' => rand(7, 10),
                'COLD' => rand(1, 3),
                default => rand(1, 3),
            };
            
            for ($i = 0; $i < $followUpCount; $i++) {
                $stage = $stages[min($i, count($stages) - 1)];
                $scheduledAt = $faker->dateTimeBetween($lead->created_at, 'now');
                $completedAt = $i < $followUpCount - 1 ? $scheduledAt : null; // Last follow-up might not be completed
                
                // Some realistic follow-up scenarios
                $catatan = match($stage) {
                    '1_kontak_awal' => $faker->randomElement([
                        'Telepon pertama, pelanggan tertarik dengan produk karpet masjid',
                        'WhatsApp follow-up, meminta informasi lebih detail',
                        'Kontak awal via marketplace, pelanggan butuh survey lokasi',
                    ]),
                    '2_presentasi' => $faker->randomElement([
                        'Presentasi produk via video call, pelanggan antusias',
                        'Kirim katalog lengkap, pelanggan akan diskusi dengan pengurus',
                        'Meeting tatap muka, jelaskan berbagai pilihan karpet',
                    ]),
                    '3_survey' => $faker->randomElement([
                        'Survey lokasi terjadwal, ukur area masjid',
                        'Tim survey akan datang minggu depan',
                        'Survey selesai, luas area 200m2, butuh karpet premium',
                    ]),
                    '4_penawaran' => $faker->randomElement([
                        'Kirim penawaran harga sesuai hasil survey',
                        'Penawaran diterima, pelanggan minta waktu untuk diskusi',
                        'Revisi penawaran sesuai permintaan pelanggan',
                    ]),
                    '5_negosiasi' => $faker->randomElement([
                        'Negosiasi harga, pelanggan minta diskon 10%',
                        'Diskusi sistem pembayaran, pelanggan minta cicilan',
                        'Negosiasi spesifikasi, upgrade ke karpet premium',
                    ]),
                    '6_demo' => $faker->randomElement([
                        'Demo produk di showroom, pelanggan puas dengan kualitas',
                        'Bawa sample ke lokasi, pengurus masjid setuju',
                        'Demo virtual, kirim video pemasangan karpet',
                    ]),
                    '7_proposal' => $faker->randomElement([
                        'Kirim proposal lengkap dengan timeline pengerjaan',
                        'Proposal diterima, tunggu persetujuan final',
                        'Revisi proposal sesuai masukan dari pengurus',
                    ]),
                    '8_kontrak' => $faker->randomElement([
                        'Persiapan kontrak kerja dan surat pesanan',
                        'Review kontrak dengan legal, tunggu tanda tangan',
                        'Kontrak ditandatangani, mulai proses produksi',
                    ]),
                    '9_pembayaran' => $faker->randomElement([
                        'DP 50% diterima, mulai produksi karpet',
                        'Pembayaran tahap 2, siap untuk instalasi',
                        'Pelunasan selesai, project completed',
                    ]),
                    '10_closing' => $faker->randomElement([
                        'Project selesai, pelanggan puas dengan hasil',
                        'Instalasi selesai, training maintenance tim masjid',
                        'Closing berhasil, tambahkan ke database pelanggan',
                    ]),
                    default => $faker->sentence(8),
                };
                
                FollowUp::create([
                    'leads_id' => $lead->id,
                    'user_id' => $lead->user_id,
                    'stage' => $stage,
                    'scheduled_at' => $scheduledAt,
                    'completed_at' => $completedAt,
                    'catatan' => $catatan,
                    'hasil_followup' => $completedAt ? $faker->randomElement([
                        'Berhasil menghubungi, pelanggan tertarik',
                        'Pelanggan meminta waktu untuk konsultasi',
                        'Perlu follow-up lanjutan minggu depan',
                        'Sangat positif, lanjut ke tahap berikutnya',
                        'Ada keberatan harga, perlu negosiasi',
                        'Pelanggan sangat puas dengan penjelasan',
                    ]) : null,
                    'attempt_count' => $completedAt ? rand(1, 2) : 0,
                    'created_at' => $scheduledAt,
                    'updated_at' => $completedAt ?? $scheduledAt,
                ]);
            }
            
            // Add some future follow-ups for active leads
            if (in_array($lead->status, ['QUALIFIED', 'WARM', 'HOT'])) {
                $futureStage = $stages[min($followUpCount, count($stages) - 1)];
                $futureDate = $faker->dateTimeBetween('now', '+7 days');
                
                FollowUp::create([
                    'leads_id' => $lead->id,
                    'user_id' => $lead->user_id,
                    'stage' => $futureStage,
                    'scheduled_at' => $futureDate,
                    'completed_at' => null,
                    'catatan' => 'Follow-up terjadwal untuk melanjutkan proses',
                    'attempt_count' => 0,
                    'created_at' => now(),
                ]);
            }
        }
    }
}