<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Leads extends Model
{
    use HasFactory;

    protected $fillable = [
        'tanggal_leads',
        'sapaan',
        'nama_pelanggan',
        'no_whatsapp',
        'nama_masjid_instansi',
        'alamat',
        'sumber_leads_id',
        'catatan',
        'alasan_closing',
        'alasan_tidak_closing',
        'prioritas',
        'kebutuhan_karpet',
        'potensi_nilai',
        'budget_min',
        'budget_max',
        'tanggal_closing',
        'nominal_deal',
        'user_id',
        'tipe_karpet_id',
        'cabang_id',
        'status',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_leads' => 'date',
            'tanggal_closing' => 'date',
            'potensi_nilai' => 'decimal:2',
            'budget_min' => 'decimal:2',
            'budget_max' => 'decimal:2',
            'nominal_deal' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function cabang(): BelongsTo
    {
        return $this->belongsTo(Cabang::class);
    }

    public function sumberLeads(): BelongsTo
    {
        return $this->belongsTo(SumberLeads::class);
    }

    public function tipeKarpet(): BelongsTo
    {
        return $this->belongsTo(TipeKarpet::class);
    }

    public function followUps(): HasMany
    {
        return $this->hasMany(FollowUp::class);
    }

    public function dokumens(): HasMany
    {
        return $this->hasMany(Dokumen::class);
    }

    public function isWarm(): bool
    {
        return $this->status === 'WARM';
    }

    public function isHot(): bool
    {
        return $this->status === 'HOT';
    }

    public function isCustomer(): bool
    {
        return $this->status === 'CUSTOMER';
    }

    public function isCold(): bool
    {
        return $this->status === 'COLD';
    }

    public function isExit(): bool
    {
        return $this->status === 'EXIT';
    }

    public function isCrossSelling(): bool
    {
        return $this->status === 'CROSS_SELLING';
    }
}
