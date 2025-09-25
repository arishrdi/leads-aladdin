<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Kunjungan extends Model
{
    protected $fillable = [
        'cabang_id',
        'user_id',
        'waktu_canvasing',
        'bertemu_dengan',
        'nomor_aktif_takmir',
        'nama_masjid',
        'alamat_masjid',
        'foto_masjid',
        'nama_pengurus',
        'jumlah_shof',
        'kondisi_karpet',
        'status',
        'kebutuhan',
        'catatan',
        'is_active',
    ];

    protected $casts = [
        'waktu_canvasing' => 'date',
        'is_active' => 'boolean',
    ];

    public function cabang(): BelongsTo
    {
        return $this->belongsTo(Cabang::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function kunjunganItems(): BelongsToMany
    {
        return $this->belongsToMany(KunjunganItem::class, 'kunjungan_item_responses')
                    ->withPivot('status')
                    ->withTimestamps();
    }
}
