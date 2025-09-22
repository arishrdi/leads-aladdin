<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Dokumen extends Model
{
    use HasFactory;

    protected $fillable = [
        'leads_id',
        'judul',
        'deskripsi',
        'kategori',
        'file_path',
        'file_name',
        'file_type',
        'file_size',
        'user_id',
    ];

    public function leads(): BelongsTo
    {
        return $this->belongsTo(Leads::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isPenawaran(): bool
    {
        return $this->kategori === 'penawaran';
    }

    public function isSketsaSurvey(): bool
    {
        return $this->kategori === 'sketsa_survey';
    }

    public function getFileSizeFormatted(): string
    {
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $bytes >= 1024 && $i < 3; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }
}
