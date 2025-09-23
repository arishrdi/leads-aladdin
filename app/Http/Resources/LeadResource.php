<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LeadResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'tanggal_leads' => $this->tanggal_leads?->format('Y-m-d'),
            'sapaan' => $this->sapaan,
            'nama_pelanggan' => $this->nama_pelanggan,
            'no_whatsapp' => $this->no_whatsapp,
            'nama_masjid_instansi' => $this->nama_masjid_instansi,
            'alamat' => $this->alamat,
            'catatan' => $this->catatan,
            'status' => $this->status,
            'prioritas' => $this->prioritas,
            'kebutuhan_karpet' => $this->kebutuhan_karpet,
            'potensi_nilai' => $this->potensi_nilai ? (float) $this->potensi_nilai : null,
            'budget_min' => $this->budget_min ? (float) $this->budget_min : null,
            'budget_max' => $this->budget_max ? (float) $this->budget_max : null,
            'tanggal_closing' => $this->tanggal_closing?->format('Y-m-d'),
            'nominal_deal' => $this->nominal_deal ? (float) $this->nominal_deal : null,
            'alasan_closing' => $this->alasan_closing,
            'alasan_tidak_closing' => $this->alasan_tidak_closing,
            
            // Relationships
            'user' => [
                'id' => $this->user?->id,
                'name' => $this->user?->name,
                'email' => $this->user?->email,
                'role' => $this->user?->role,
            ],
            'cabang' => [
                'id' => $this->cabang?->id,
                'nama' => $this->cabang?->nama,
                'lokasi' => $this->cabang?->lokasi,
                'alamat' => $this->cabang?->alamat,
            ],
            'sumber_leads' => [
                'id' => $this->sumberLeads?->id,
                'nama' => $this->sumberLeads?->nama,
                'deskripsi' => $this->sumberLeads?->deskripsi,
            ],
            'tipe_karpet' => [
                'id' => $this->tipeKarpet?->id,
                'nama' => $this->tipeKarpet?->nama,
                'deskripsi' => $this->tipeKarpet?->deskripsi,
            ],
            
            // Additional data when available
            'follow_ups_count' => $this->when(
                $this->relationLoaded('followUps'),
                fn() => $this->followUps->count()
            ),
            'latest_follow_up' => $this->when(
                $this->relationLoaded('followUps') && $this->followUps->isNotEmpty(),
                fn() => [
                    'stage' => $this->followUps->last()?->stage,
                    'scheduled_at' => $this->followUps->last()?->scheduled_at?->toISOString(),
                    'completed_at' => $this->followUps->last()?->completed_at?->toISOString(),
                ]
            ),
            'dokumens_count' => $this->when(
                $this->relationLoaded('dokumens'),
                fn() => $this->dokumens->count()
            ),
            
            // Status helpers
            'status_label' => $this->getStatusLabel(),
            'is_active' => (bool) $this->is_active,
            
            // Timestamps
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }

    /**
     * Get human-readable status label
     */
    private function getStatusLabel(): string
    {
        return match($this->status) {
            'WARM' => 'Calon customer yang menghubungi untuk pertama kali',
            'HOT' => 'Sudah minta desain / survey lokasi',
            'CUSTOMER' => 'Memutuskan untuk membeli',
            'COLD' => 'Tidak ada kejelasan setelah follow up',
            'EXIT' => 'Memutuskan untuk tidak membeli',
            'CROSS_SELLING' => 'Testimoni dan penawaran produk lain',
            default => $this->status ?? 'Unknown',
        };
    }
}