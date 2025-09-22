<?php

namespace Database\Seeders;

use App\Models\Dokumen;
use App\Models\Leads;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class DokumenSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        
        // Get leads that should have documents (QUALIFIED, WARM, HOT, CONVERTED)
        $leadsWithDocs = Leads::whereIn('status', ['QUALIFIED', 'WARM', 'HOT', 'CONVERTED'])->get();
        
        $dokumenTemplates = [
            // Penawaran documents
            [
                'kategori' => 'penawaran',
                'judul' => 'Penawaran Harga Karpet Masjid',
                'deskripsi' => 'Penawaran lengkap dengan spesifikasi dan harga karpet masjid',
                'file_name' => 'penawaran_karpet_masjid.pdf',
                'file_type' => 'application/pdf',
                'file_size' => 1248576, // ~1.2MB
            ],
            [
                'kategori' => 'penawaran',
                'judul' => 'Katalog Produk Karpet Premium',
                'deskripsi' => 'Katalog lengkap dengan berbagai pilihan motif dan kualitas',
                'file_name' => 'katalog_karpet_premium.pdf',
                'file_type' => 'application/pdf',
                'file_size' => 3145728, // 3MB
            ],
            [
                'kategori' => 'penawaran',
                'judul' => 'Brosur Karpet Masjid 2024',
                'deskripsi' => 'Brosur promosi dengan penawaran terbaru tahun 2024',
                'file_name' => 'brosur_karpet_2024.jpg',
                'file_type' => 'image/jpeg',
                'file_size' => 2097152, // 2MB
            ],
            
            // Sketsa Survey documents
            [
                'kategori' => 'sketsa_survey',
                'judul' => 'Hasil Survey Lokasi Masjid',
                'deskripsi' => 'Dokumentasi hasil survey dan pengukuran area masjid',
                'file_name' => 'survey_lokasi_masjid.pdf',
                'file_type' => 'application/pdf',
                'file_size' => 1572864, // ~1.5MB
            ],
            [
                'kategori' => 'sketsa_survey',
                'judul' => 'Sketsa Desain Layout Karpet',
                'deskripsi' => 'Sketsa tata letak karpet sesuai dengan arsitektur masjid',
                'file_name' => 'sketsa_layout_karpet.jpg',
                'file_type' => 'image/jpeg',
                'file_size' => 1048576, // 1MB
            ],
            [
                'kategori' => 'sketsa_survey',
                'judul' => 'Perhitungan Kebutuhan Material',
                'deskripsi' => 'File Excel dengan detail perhitungan kebutuhan karpet',
                'file_name' => 'perhitungan_material.xlsx',
                'file_type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'file_size' => 524288, // 512KB
            ],
            
            // Lainnya documents
            [
                'kategori' => 'lainnya',
                'judul' => 'Sertifikat Halal Produk',
                'deskripsi' => 'Sertifikat halal untuk material karpet yang digunakan',
                'file_name' => 'sertifikat_halal.pdf',
                'file_type' => 'application/pdf',
                'file_size' => 786432, // 768KB
            ],
            [
                'kategori' => 'lainnya',
                'judul' => 'Panduan Perawatan Karpet',
                'deskripsi' => 'Panduan lengkap cara merawat dan membersihkan karpet',
                'file_name' => 'panduan_perawatan.pdf',
                'file_type' => 'application/pdf',
                'file_size' => 1310720, // ~1.25MB
            ],
            [
                'kategori' => 'lainnya',
                'judul' => 'Kontrak Kerja Pemasangan',
                'deskripsi' => 'Draft kontrak kerja untuk pemasangan karpet masjid',
                'file_name' => 'kontrak_pemasangan.docx',
                'file_type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'file_size' => 655360, // 640KB
            ],
        ];
        
        foreach ($leadsWithDocs as $lead) {
            // Each lead gets 1-4 documents
            $docCount = match($lead->status) {
                'QUALIFIED' => rand(1, 2),
                'WARM' => rand(2, 3),
                'HOT' => rand(3, 4),
                'CONVERTED' => rand(3, 5),
                default => 1,
            };
            
            $usedTemplates = [];
            
            for ($i = 0; $i < $docCount; $i++) {
                // Pick a random template that hasn't been used for this lead
                do {
                    $template = $faker->randomElement($dokumenTemplates);
                } while (in_array($template['judul'], $usedTemplates) && count($usedTemplates) < count($dokumenTemplates));
                
                $usedTemplates[] = $template['judul'];
                
                Dokumen::create([
                    'leads_id' => $lead->id,
                    'user_id' => $lead->user_id,
                    'judul' => $template['judul'],
                    'deskripsi' => $template['deskripsi'],
                    'kategori' => $template['kategori'],
                    'file_path' => 'dokumens/' . time() . '_' . $template['file_name'],
                    'file_name' => $template['file_name'],
                    'file_type' => $template['file_type'],
                    'file_size' => $template['file_size'],
                    'created_at' => $faker->dateTimeBetween($lead->created_at, 'now'),
                ]);
            }
        }
        
        // Create some additional documents for converted leads
        $convertedLeads = Leads::where('status', 'CONVERTED')->get();
        
        foreach ($convertedLeads as $lead) {
            // Add completion documents
            $completionDocs = [
                [
                    'kategori' => 'lainnya',
                    'judul' => 'Berita Acara Serah Terima',
                    'deskripsi' => 'Dokumen serah terima project karpet masjid',
                    'file_name' => 'berita_acara_serah_terima.pdf',
                    'file_type' => 'application/pdf',
                    'file_size' => 892928, // ~872KB
                ],
                [
                    'kategori' => 'lainnya',
                    'judul' => 'Foto Hasil Pemasangan',
                    'deskripsi' => 'Dokumentasi foto hasil pemasangan karpet',
                    'file_name' => 'foto_hasil_pemasangan.jpg',
                    'file_type' => 'image/jpeg',
                    'file_size' => 2621440, // ~2.5MB
                ],
            ];
            
            foreach ($completionDocs as $doc) {
                Dokumen::create([
                    'leads_id' => $lead->id,
                    'user_id' => $lead->user_id,
                    'judul' => $doc['judul'],
                    'deskripsi' => $doc['deskripsi'],
                    'kategori' => $doc['kategori'],
                    'file_path' => 'dokumens/' . time() . '_' . $doc['file_name'],
                    'file_name' => $doc['file_name'],
                    'file_type' => $doc['file_type'],
                    'file_size' => $doc['file_size'],
                    'created_at' => $lead->tanggal_closing ?? now(),
                ]);
            }
        }
    }
}