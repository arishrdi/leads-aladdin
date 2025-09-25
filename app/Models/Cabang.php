<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cabang extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_cabang',
        'lokasi',
        'alamat',
        'no_telp',
        'pic',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_cabangs')
            ->withPivot('is_active')
            ->withTimestamps();
    }

    public function leads(): HasMany
    {
        return $this->hasMany(Leads::class);
    }
    public function kunjungan(): HasMany
    {
        return $this->hasMany(Kunjungan::class);
    }
}
