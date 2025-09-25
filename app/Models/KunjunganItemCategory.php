<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KunjunganItemCategory extends Model
{
    protected $fillable = [
        'nama',
        'deskripsi',
        'input_type',
        'urutan',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function kunjunganItems(): HasMany
    {
        return $this->hasMany(KunjunganItem::class)->orderBy('urutan');
    }

    public function activeKunjunganItems(): HasMany
    {
        return $this->hasMany(KunjunganItem::class)->where('is_active', true)->orderBy('urutan');
    }
}
