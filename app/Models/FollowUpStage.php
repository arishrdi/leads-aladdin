<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Cache;

class FollowUpStage extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'key',
        'name',
        'display_order',
        'next_stage_key',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'display_order' => 'integer',
    ];

    public function followUps(): HasMany
    {
        return $this->hasMany(FollowUp::class, 'stage', 'key');
    }

    public function nextStage()
    {
        if (!$this->next_stage_key) {
            return null;
        }
        
        return static::where('key', $this->next_stage_key)
            ->where('is_active', true)
            ->first();
    }

    public static function getActiveStages()
    {
        return Cache::remember('follow_up_stages_active', 3600, function () {
            return static::where('is_active', true)
                ->orderBy('display_order')
                ->get()
                ->keyBy('key')
                ->map(fn($stage) => $stage->name)
                ->toArray();
        });
    }

    public static function getStageProgression()
    {
        return Cache::remember('follow_up_stages_progression', 3600, function () {
            return static::where('is_active', true)
                ->whereNotNull('next_stage_key')
                ->pluck('next_stage_key', 'key')
                ->toArray();
        });
    }

    public static function clearCache()
    {
        Cache::forget('follow_up_stages_active');
        Cache::forget('follow_up_stages_progression');
    }

    protected static function boot()
    {
        parent::boot();

        static::saved(function () {
            static::clearCache();
        });

        static::deleted(function () {
            static::clearCache();
        });
    }
}
