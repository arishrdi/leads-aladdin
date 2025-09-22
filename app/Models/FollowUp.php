<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FollowUp extends Model
{
    use HasFactory;

    protected $fillable = [
        'leads_id',
        'user_id',
        'stage',
        'attempt_count',
        'attempt_1_completed',
        'attempt_2_completed',
        'attempt_3_completed',
        'attempt_1_completed_at',
        'attempt_2_completed_at',
        'attempt_3_completed_at',
        'scheduled_at',
        'completed_at',
        'catatan',
        'hasil_followup',
        'ada_respon',
        'status',
        'auto_scheduled',
    ];

    protected function casts(): array
    {
        return [
            'scheduled_at' => 'datetime',
            'completed_at' => 'datetime',
            'attempt_1_completed_at' => 'datetime',
            'attempt_2_completed_at' => 'datetime',
            'attempt_3_completed_at' => 'datetime',
            'ada_respon' => 'boolean',
            'attempt_1_completed' => 'boolean',
            'attempt_2_completed' => 'boolean',
            'attempt_3_completed' => 'boolean',
            'auto_scheduled' => 'boolean',
        ];
    }

    protected $appends = ['scheduled_at_jakarta', 'completed_attempts_count', 'next_attempt_number'];

    public function leads(): BelongsTo
    {
        return $this->belongsTo(Leads::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isScheduled(): bool
    {
        return $this->status === 'scheduled';
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function isNoResponse(): bool
    {
        return $this->status === 'no_response';
    }

    public function getScheduledAtJakartaAttribute(): ?string
    {
        if (!$this->scheduled_at) {
            return null;
        }
        
        return $this->scheduled_at->setTimezone('Asia/Jakarta')->toISOString();
    }

    public function getCompletedAttemptsCountAttribute(): int
    {
        $count = 0;
        if ($this->attempt_1_completed) $count++;
        if ($this->attempt_2_completed) $count++;
        if ($this->attempt_3_completed) $count++;
        return $count;
    }

    public function getNextAttemptNumberAttribute(): int
    {
        if (!$this->attempt_1_completed) return 1;
        if (!$this->attempt_2_completed) return 2;
        if (!$this->attempt_3_completed) return 3;
        return 4; // All attempts completed
    }

    public function canAddAttempt(): bool
    {
        return $this->getCompletedAttemptsCountAttribute() < 3;
    }

    public function allAttemptsCompleted(): bool
    {
        return $this->attempt_1_completed && $this->attempt_2_completed && $this->attempt_3_completed;
    }
}
