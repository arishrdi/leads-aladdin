<?php

namespace App\Services;

use App\Models\FollowUp;
use App\Models\Leads;
use Carbon\Carbon;

class LeadManagementService
{
    public function createFollowUp(Leads $lead, string $stage, int $attempt = 1, ?Carbon $scheduledAt = null, bool $autoScheduled = false): FollowUp
    {
        $scheduledAt = $scheduledAt ?? now()->addDays(config('leads.follow_up.default_interval_days'));

        return FollowUp::create([
            'leads_id' => $lead->id,
            'user_id' => $lead->user_id,
            'stage' => $stage,
            'attempt_count' => $attempt,
            'scheduled_at' => $scheduledAt,
            'status' => 'scheduled',
            'auto_scheduled' => $autoScheduled,
        ]);
    }

    public function completeFollowUp(FollowUp $followUp, bool $hasResponse, ?string $notes = null, ?string $hasil = null, bool $autoScheduleNext = true, bool $progressToNextStage = false, ?string $nextStage = null): void
    {
        // Mark the next attempt as completed
        $nextAttempt = $followUp->next_attempt_number;
        $attemptField = "attempt_{$nextAttempt}_completed";
        $attemptDateField = "attempt_{$nextAttempt}_completed_at";
        
        $updateData = [
            'ada_respon' => $hasResponse,
            'catatan' => $notes,
            'hasil_followup' => $hasil,
        ];

        // Update the specific attempt completion
        if ($nextAttempt <= 3) {
            $updateData[$attemptField] = true;
            $updateData[$attemptDateField] = now();
        }

        // If has response or all attempts completed, mark as completed
        if ($hasResponse || $followUp->allAttemptsCompleted()) {
            $updateData['completed_at'] = now();
            $updateData['status'] = $hasResponse ? 'completed' : 'no_response';
        }

        $followUp->update($updateData);

        $this->checkAndCreateNextFollowUp($followUp, $autoScheduleNext, $progressToNextStage, $nextStage);
    }

    public function checkAndCreateNextFollowUp(FollowUp $followUp, bool $autoScheduleNext = true, bool $progressToNextStage = false, ?string $nextStage = null): void
    {
        $lead = $followUp->leads;
        
        // If has response and progressing to next stage, create next stage follow-up
        if ($followUp->ada_respon && $progressToNextStage && $nextStage && $autoScheduleNext && $this->isAutoSchedulingEnabled()) {
            $this->createFollowUp(
                $lead,
                $nextStage,
                1,
                now()->addDays(config('leads.follow_up.default_interval_days')),
                true // Auto-scheduled
            );
            return;
        }

        // If has response but NOT progressing to next stage, and still has attempts left, schedule next attempt (same stage)
        if ($followUp->ada_respon && !$progressToNextStage && $followUp->canAddAttempt() && $autoScheduleNext && $this->isAutoSchedulingEnabled()) {
            $nextAttempt = $followUp->next_attempt_number;
            $this->createFollowUp(
                $lead,
                $followUp->stage,
                $nextAttempt,
                now()->addDays(config('leads.follow_up.default_interval_days')),
                true // Auto-scheduled
            );
            return;
        }

        // If no response and still has attempts left, schedule next attempt (same stage)
        if (!$followUp->ada_respon && $followUp->canAddAttempt() && $autoScheduleNext && $this->isAutoSchedulingEnabled()) {
            $nextAttempt = $followUp->next_attempt_number;
            $this->createFollowUp(
                $lead,
                $followUp->stage,
                $nextAttempt,
                now()->addDays(config('leads.follow_up.default_interval_days')),
                true // Auto-scheduled
            );
        }
        // If no response after all 3 attempts, mark lead as COLD
        elseif (!$followUp->ada_respon && $followUp->allAttemptsCompleted()) {
            $this->markLeadAsCold($lead);
        }
    }

    public function markLeadAsCold(Leads $lead): void
    {
        $lead->update(['status' => 'COLD']);
    }

    /**
     * Check if auto-scheduling is enabled in configuration
     */
    public function isAutoSchedulingEnabled(): bool
    {
        return config('leads.follow_up.auto_scheduling.enabled', true);
    }

    /**
     * Get the next stage in the progression
     */
    public function getNextStage(string $currentStage): ?string
    {
        $stageProgression = config('leads.follow_up.auto_scheduling.stage_progression', []);
        return $stageProgression[$currentStage] ?? null;
    }

    /**
     * Create the first follow-up for a new lead
     */
    public function createFirstFollowUp(Leads $lead): ?FollowUp
    {
        if (!$this->isAutoSchedulingEnabled()) {
            return null;
        }

        $firstStage = 'greeting'; // Default first stage
        $firstFollowUpDays = config('leads.follow_up.auto_scheduling.first_followup_days', 1);
        
        return $this->createFollowUp(
            $lead,
            $firstStage,
            1,
            now()->addDays($firstFollowUpDays),
            true // Auto-scheduled
        );
    }

    public function getTodaysFollowUps(int $userId, $activeBranch = null): \Illuminate\Database\Eloquent\Collection
    {
        $query = FollowUp::where('user_id', $userId)
            ->whereDate('scheduled_at', today())
            ->where('status', 'scheduled')
            ->with(['leads']);

        // Filter by active branch if set
        if ($activeBranch) {
            $query->whereHas('leads', function($q) use ($activeBranch) {
                $q->where('cabang_id', $activeBranch->id);
            });
        }

        return $query->orderBy('scheduled_at')->get();
    }

    public function getOverdueFollowUps(int $userId, $activeBranch = null): \Illuminate\Database\Eloquent\Collection
    {
        $query = FollowUp::where('user_id', $userId)
            ->whereDate('scheduled_at', '<', today())
            ->where('status', 'scheduled')
            ->with(['leads']);

        // Filter by active branch if set
        if ($activeBranch) {
            $query->whereHas('leads', function($q) use ($activeBranch) {
                $q->where('cabang_id', $activeBranch->id);
            });
        }

        return $query->orderBy('scheduled_at')->get();
    }

    public function formatPhoneNumber(string $phone): string
    {
        // Remove any non-digit characters
        $phone = preg_replace('/\D/', '', $phone);
        
        // If starts with 0, replace with 62
        if (str_starts_with($phone, '0')) {
            $phone = '62' . substr($phone, 1);
        }
        // If doesn't start with 62, add it
        elseif (!str_starts_with($phone, '62')) {
            $phone = '62' . $phone;
        }
        
        return $phone;
    }

    public function getLeadsByStatus(string $status, ?int $cabangId = null): \Illuminate\Database\Eloquent\Builder
    {
        $query = Leads::where('status', $status)->where('is_active', true);
        
        if ($cabangId) {
            $query->where('cabang_id', $cabangId);
        }
        
        return $query->with(['user', 'cabang', 'sumberLeads', 'tipeKarpet']);
    }

    public function getFollowUpStatistics(int $userId, ?Carbon $startDate = null, ?Carbon $endDate = null, $activeBranch = null): array
    {
        $startDate = $startDate ?? now()->startOfMonth();
        $endDate = $endDate ?? now()->endOfMonth();

        $query = FollowUp::where('user_id', $userId)
            ->whereBetween('created_at', [$startDate, $endDate]);

        // Filter by active branch if set
        if ($activeBranch) {
            $query->whereHas('leads', function($q) use ($activeBranch) {
                $q->where('cabang_id', $activeBranch->id);
            });
        }

        $followUps = $query->get();

        return [
            'total' => $followUps->count(),
            'completed' => $followUps->where('status', 'completed')->count(),
            'no_response' => $followUps->where('status', 'no_response')->count(),
            'scheduled' => $followUps->where('status', 'scheduled')->count(),
            'response_rate' => $followUps->count() > 0 
                ? round(($followUps->where('ada_respon', true)->count() / $followUps->count()) * 100, 2)
                : 0,
        ];
    }
}