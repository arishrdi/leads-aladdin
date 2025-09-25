<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class KunjunganItem extends Model
{
    protected $fillable = [
        'kunjungan_item_category_id',
        'nama',
        'deskripsi',
        'urutan',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function kunjunganItemCategory(): BelongsTo
    {
        return $this->belongsTo(KunjunganItemCategory::class);
    }

    public function kunjungans(): BelongsToMany
    {
        return $this->belongsToMany(Kunjungan::class, 'kunjungan_item_responses')
                    ->withPivot('status')
                    ->withTimestamps();
    }
}
