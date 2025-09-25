<?php

namespace App\Http\Controllers;

use App\Models\FollowUp;
use App\Models\Leads;
use App\Services\LeadManagementService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FollowUpController extends Controller
{
    public function __construct(
        private LeadManagementService $leadService
    ) {
        //
    }

    public function index(Request $request)
    {
        $user = auth()->user();
        $activeBranch = $request->get('active_branch_object');
        
        // Get date filters
        $startDate = $request->get('start_date');
        $endDate = $request->get('end_date');
        
        // Default to today if no date filter provided
        if (!$startDate && !$endDate) {
            if ($user->isMarketing()) {
                $todaysFollowUps = $this->leadService->getTodaysFollowUps($user->id, $activeBranch);
                $overdueFollowUps = $this->leadService->getOverdueFollowUps($user->id, $activeBranch);
                $successfulFollowUps = $this->getTodaysSuccessfulFollowUps($user->id, $activeBranch);
            } else {
                // For supervisor and super_user, get follow-ups based on active branch
                $todaysFollowUps = $this->getTodaysFollowUpsByBranch($activeBranch, $user);
                $overdueFollowUps = $this->getOverdueFollowUpsByBranch($activeBranch, $user);
                $successfulFollowUps = $this->getTodaysSuccessfulFollowUpsByBranch($activeBranch, $user);
            }
            $allFollowUps = [];
        } else {
            // Get filtered follow-ups
            $todaysFollowUps = [];
            $overdueFollowUps = [];
            $successfulFollowUps = [];
            $allFollowUps = $this->getFilteredFollowUps($user, $activeBranch, $startDate, $endDate);
        }

        // Convert string dates to Carbon objects for the service
        $startDateCarbon = $startDate ? \Carbon\Carbon::parse($startDate) : null;
        $endDateCarbon = $endDate ? \Carbon\Carbon::parse($endDate) : null;

        // Get statistics based on role
        if ($user->isMarketing()) {
            $statistics = $this->leadService->getFollowUpStatistics($user->id, $startDateCarbon, $endDateCarbon, $activeBranch);
        } else {
            $statistics = $this->getFollowUpStatisticsByBranch($activeBranch, $user, $startDateCarbon, $endDateCarbon);
        }

        return Inertia::render('follow-ups/index', [
            'todaysFollowUps' => $todaysFollowUps,
            'overdueFollowUps' => $overdueFollowUps,
            'successfulFollowUps' => $successfulFollowUps ?? [],
            'allFollowUps' => $allFollowUps,
            'statistics' => $statistics,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
            'config' => [
                'followUpStages' => \App\Models\FollowUpStage::getActiveStages(),
            ],
        ]);
    }

    private function getFilteredFollowUps($user, $activeBranch, $startDate, $endDate)
    {
        $query = FollowUp::with(['leads.cabang', 'user']);

        // Apply role-based filtering
        if ($user->isMarketing()) {
            $query->where('user_id', $user->id);
        } else {
            // For supervisor and super_user, filter by active branch
            if ($activeBranch) {
                $query->whereHas('leads', function ($q) use ($activeBranch) {
                    $q->where('cabang_id', $activeBranch->id);
                });
            } elseif ($user->isSupervisor()) {
                // Show follow-ups from supervisor's assigned branches
                $branchIds = $user->cabangs()->pluck('cabangs.id');
                $query->whereHas('leads', function ($q) use ($branchIds) {
                    $q->whereIn('cabang_id', $branchIds);
                });
            }
            // For super_user with no active branch, show all follow-ups (no additional filter)
        }

        // Apply date filters
        if ($startDate) {
            $query->whereDate('scheduled_at', '>=', $startDate);
        }
        if ($endDate) {
            $query->whereDate('scheduled_at', '<=', $endDate);
        }

        return $query->orderBy('scheduled_at', 'asc')
            ->get()
            ->map(function ($followUp) {
                return [
                    'id' => $followUp->id,
                    'stage' => $followUp->stage,
                    'attempt' => $followUp->attempt,
                    'attempt_count' => $followUp->attempt_count,
                    'attempt_1_completed' => $followUp->attempt_1_completed,
                    'attempt_2_completed' => $followUp->attempt_2_completed,
                    'attempt_3_completed' => $followUp->attempt_3_completed,
                    'attempt_1_completed_at' => $followUp->attempt_1_completed_at,
                    'attempt_2_completed_at' => $followUp->attempt_2_completed_at,
                    'attempt_3_completed_at' => $followUp->attempt_3_completed_at,
                    'completed_attempts_count' => $followUp->completed_attempts_count,
                    'next_attempt_number' => $followUp->next_attempt_number,
                    'scheduled_at' => $followUp->scheduled_at,
                    'completed_at' => $followUp->completed_at,
                    'status' => $followUp->status,
                    'catatan' => $followUp->catatan,
                    'hasil_followup' => $followUp->hasil_followup,
                    'ada_respon' => $followUp->ada_respon,
                    'auto_scheduled' => $followUp->auto_scheduled,
                    'leads' => [
                        'id' => $followUp->leads->id,
                        'nama_pelanggan' => $followUp->leads->nama_pelanggan,
                        'no_whatsapp' => $followUp->leads->no_whatsapp,
                        'status' => $followUp->leads->status,
                        'nama_masjid_instansi' => $followUp->leads->nama_masjid_instansi,
                    ],
                ];
            });
    }

    private function getTodaysSuccessfulFollowUps($userId, $activeBranch)
    {
        $query = FollowUp::with(['leads.cabang', 'user'])
            ->where('user_id', $userId)
            ->whereDate('completed_at', today())
            ->where('ada_respon', true)
            ->whereIn('status', ['completed']);

        // Apply branch filter if not super user
        if ($activeBranch && auth()->user()->role !== 'super_user') {
            $query->whereHas('leads', function ($q) use ($activeBranch) {
                $q->where('cabang_id', $activeBranch->id);
            });
        }

        return $query->orderBy('completed_at', 'desc')
            ->get()
            ->map(function ($followUp) {
                return [
                    'id' => $followUp->id,
                    'stage' => $followUp->stage,
                    'attempt' => $followUp->attempt_count,
                    'attempt_count' => $followUp->attempt_count,
                    'attempt_1_completed' => $followUp->attempt_1_completed,
                    'attempt_2_completed' => $followUp->attempt_2_completed,
                    'attempt_3_completed' => $followUp->attempt_3_completed,
                    'attempt_1_completed_at' => $followUp->attempt_1_completed_at,
                    'attempt_2_completed_at' => $followUp->attempt_2_completed_at,
                    'attempt_3_completed_at' => $followUp->attempt_3_completed_at,
                    'completed_attempts_count' => $followUp->completed_attempts_count,
                    'next_attempt_number' => $followUp->next_attempt_number,
                    'scheduled_at' => $followUp->scheduled_at,
                    'completed_at' => $followUp->completed_at,
                    'status' => $followUp->status,
                    'catatan' => $followUp->catatan,
                    'hasil_followup' => $followUp->hasil_followup,
                    'ada_respon' => $followUp->ada_respon,
                    'auto_scheduled' => $followUp->auto_scheduled,
                    'leads' => [
                        'id' => $followUp->leads->id,
                        'nama_pelanggan' => $followUp->leads->nama_pelanggan,
                        'no_whatsapp' => $followUp->leads->no_whatsapp,
                        'status' => $followUp->leads->status,
                        'nama_masjid_instansi' => $followUp->leads->nama_masjid_instansi,
                    ],
                ];
            });
    }

    public function create(Leads $lead)
    {
        if ($lead->user_id !== auth()->id()) {
            abort(403, 'Anda tidak dapat membuat follow-up untuk lead ini.');
        }

        return Inertia::render('follow-ups/create', [
            'lead' => $lead->load(['user', 'cabang']),
            'config' => [
                'followUpStages' => \App\Models\FollowUpStage::getActiveStages(),
            ],
        ]);
    }

    public function store(Request $request, Leads $lead)
    {
        if ($lead->user_id !== auth()->id()) {
            abort(403, 'Anda tidak dapat membuat follow-up untuk lead ini.');
        }

        $validated = $request->validate([
            'stage' => 'required|in:greeting,impresi,small_talk,rekomendasi,pengajuan_survei,presentasi,form_pemesanan,up_cross_selling,invoice,konfirmasi_pemasangan',
            'scheduled_at' => 'required|date|after:now',
            'catatan' => 'nullable|string',
        ]);

        $this->leadService->createFollowUp(
            $lead,
            $validated['stage'],
            1,
            \Carbon\Carbon::parse($validated['scheduled_at'])
        );

        return redirect()->route('follow-ups.index')
            ->with('success', 'Follow-up berhasil dijadwalkan.');
    }

    public function show(FollowUp $followUp)
    {
        $user = auth()->user();
        
        // Check access permissions based on user role
        if ($user->role === 'marketing') {
            // Marketing can only see their own follow-ups
            if ($followUp->user_id !== $user->id) {
                abort(403, 'Anda tidak dapat melihat follow-up ini.');
            }
        } elseif ($user->role === 'supervisor') {
            // Supervisor can see follow-ups from their assigned branches
            $userBranchIds = $user->cabangs()->pluck('cabangs.id')->toArray();
            if (!in_array($followUp->leads->cabang_id, $userBranchIds)) {
                abort(403, 'Anda tidak dapat melihat follow-up ini.');
            }
        }
        // Super user can see all follow-ups (no additional check needed)

        $followUp->load(['leads.cabang', 'user']);

        return Inertia::render('follow-ups/show', [
            'followUp' => $followUp,
            'config' => [
                'followUpStages' => \App\Models\FollowUpStage::getActiveStages(),
                'alasanClosing' => config('leads.alasan_closing'),
                'alasanTidakClosing' => config('leads.alasan_tidak_closing'),
            ],
            'canEdit' => $user->role === 'marketing' && $followUp->user_id === $user->id,
        ]);
    }

    public function complete(Request $request, FollowUp $followUp)
    {
        if ($followUp->user_id !== auth()->id()) {
            abort(403, 'Anda tidak dapat menyelesaikan follow-up ini.');
        }

        if ($followUp->status !== 'scheduled') {
            return back()->with('error', 'Follow-up ini sudah diselesaikan.');
        }

        $validated = $request->validate([
            'ada_respon' => 'required|boolean',
            'catatan' => 'nullable|string',
            'hasil_followup' => 'nullable|string',
            'lead_status' => 'nullable|in:NEW,QUALIFIED,WARM,HOT,CUSTOMER,CONVERTED,COLD,CROSS_SELLING,EXIT',
            'alasan_closing' => 'nullable|string',
            'alasan_tidak_closing' => 'nullable|string',
            'auto_schedule_next' => 'nullable|boolean',
            'progress_to_next_stage' => 'nullable|boolean',
            'next_stage' => 'nullable|string|in:greeting,impresi,small_talk,rekomendasi,pengajuan_survei,presentasi,form_pemesanan,up_cross_selling,invoice,konfirmasi_pemasangan',
        ]);

        $this->leadService->completeFollowUp(
            $followUp,
            $validated['ada_respon'],
            $validated['catatan'],
            $validated['hasil_followup'] ?? null,
            $validated['auto_schedule_next'] ?? true, // Default to true
            $validated['progress_to_next_stage'] ?? false,
            $validated['next_stage'] ?? null
        );

        // Update lead status if provided
        if (isset($validated['lead_status'])) {
            $updateData = ['status' => $validated['lead_status']];
            
            // Add closing reasons based on status
            if ($validated['lead_status'] === 'CUSTOMER' && isset($validated['alasan_closing'])) {
                $updateData['alasan_closing'] = $validated['alasan_closing'];
                $updateData['tanggal_closing'] = now()->toDateString();
            } elseif ($validated['lead_status'] === 'EXIT' && isset($validated['alasan_tidak_closing'])) {
                $updateData['alasan_tidak_closing'] = $validated['alasan_tidak_closing'];
            }
            
            $followUp->leads->update($updateData);
        }

        return redirect()->route('follow-ups.index')
            ->with('success', 'Follow-up berhasil diselesaikan.');
    }

    public function excelView(Request $request)
    {
        $user = auth()->user();
        $activeBranch = $request->get('active_branch_object');

        // Get all leads with follow-ups
        $leadsQuery = Leads::with(['user', 'cabang', 'followUps']);

        // Apply role-based filtering
        if ($user->role === 'marketing') {
            $leadsQuery->where('user_id', $user->id);
        } elseif ($user->role === 'supervisor') {
            if ($activeBranch) {
                $leadsQuery->where('cabang_id', $activeBranch->id);
            } else {
                $userBranchIds = $user->cabangs()->pluck('cabangs.id');
                $leadsQuery->whereIn('cabang_id', $userBranchIds);
            }
        } elseif ($user->role === 'super_user' && $activeBranch) {
            $leadsQuery->where('cabang_id', $activeBranch->id);
        }

        $leads = $leadsQuery->orderBy('nama_pelanggan')->get();

        // Get all follow-ups for these leads
        $followUpsQuery = FollowUp::with(['leads']);

        // Apply the same filtering to follow-ups
        if ($user->role === 'marketing') {
            $followUpsQuery->where('user_id', $user->id);
        } elseif ($user->role === 'supervisor') {
            if ($activeBranch) {
                $followUpsQuery->whereHas('leads', function ($q) use ($activeBranch) {
                    $q->where('cabang_id', $activeBranch->id);
                });
            } else {
                $userBranchIds = $user->cabangs()->pluck('cabangs.id');
                $followUpsQuery->whereHas('leads', function ($q) use ($userBranchIds) {
                    $q->whereIn('cabang_id', $userBranchIds);
                });
            }
        } elseif ($user->role === 'super_user' && $activeBranch) {
            $followUpsQuery->whereHas('leads', function ($q) use ($activeBranch) {
                $q->where('cabang_id', $activeBranch->id);
            });
        }

        $followUps = $followUpsQuery->get();

        return Inertia::render('follow-ups/excel-view', [
            'leads' => $leads,
            'followUps' => $followUps,
            'config' => [
                'followUpStages' => \App\Models\FollowUpStage::getActiveStages(),
            ],
        ]);
    }

    public function reschedule(Request $request, FollowUp $followUp)
    {
        if ($followUp->user_id !== auth()->id()) {
            abort(403, 'Anda tidak dapat mengubah jadwal follow-up ini.');
        }

        if ($followUp->status !== 'scheduled') {
            return back()->with('error', 'Follow-up ini sudah diselesaikan.');
        }

        $validated = $request->validate([
            'scheduled_at' => 'required|date|after:now',
        ]);

        // Convert the datetime to UTC for storage (assuming input is in Asia/Jakarta timezone)
        $scheduledAt = \Carbon\Carbon::createFromFormat('Y-m-d\TH:i', $validated['scheduled_at'], 'Asia/Jakarta');
        $scheduledAtUtc = $scheduledAt->utc();

        $followUp->update([
            'scheduled_at' => $scheduledAtUtc,
        ]);

        return back()->with('success', 'Jadwal follow-up berhasil diperbarui.');
    }

    private function getTodaysFollowUpsByBranch($activeBranch, $user)
    {
        $query = FollowUp::with(['leads.cabang', 'user'])
            ->whereDate('scheduled_at', today())
            ->where('status', 'scheduled');

        return $this->applyBranchFilter($query, $activeBranch, $user)->orderBy('scheduled_at')->get();
    }

    private function getOverdueFollowUpsByBranch($activeBranch, $user)
    {
        $query = FollowUp::with(['leads.cabang', 'user'])
            ->where('scheduled_at', '<', today())
            ->where('status', 'scheduled');

        return $this->applyBranchFilter($query, $activeBranch, $user)->orderBy('scheduled_at')->get();
    }

    private function getTodaysSuccessfulFollowUpsByBranch($activeBranch, $user)
    {
        $query = FollowUp::with(['leads.cabang', 'user'])
            ->whereDate('completed_at', today())
            ->where('ada_respon', true)
            ->whereIn('status', ['completed']);

        return $this->applyBranchFilter($query, $activeBranch, $user)->orderBy('completed_at', 'desc')->get();
    }

    private function getFollowUpStatisticsByBranch($activeBranch, $user, $startDate = null, $endDate = null)
    {
        $query = FollowUp::query();

        // Apply date filters
        if ($startDate) {
            $query->whereDate('scheduled_at', '>=', $startDate);
        }
        if ($endDate) {
            $query->whereDate('scheduled_at', '<=', $endDate);
        }

        $this->applyBranchFilter($query, $activeBranch, $user);

        $total = $query->count();
        $completed = (clone $query)->where('status', 'completed')->count();
        $noResponse = (clone $query)->where('status', 'completed')->where('ada_respon', false)->count();
        $scheduled = (clone $query)->where('status', 'scheduled')->count();
        
        $responseRate = $total > 0 ? (($completed - $noResponse) / $total) * 100 : 0;

        return [
            'total' => $total,
            'completed' => $completed,
            'no_response' => $noResponse,
            'scheduled' => $scheduled,
            'response_rate' => round($responseRate, 1),
        ];
    }

    private function applyBranchFilter($query, $activeBranch, $user)
    {
        if ($activeBranch) {
            $query->whereHas('leads', function ($q) use ($activeBranch) {
                $q->where('cabang_id', $activeBranch->id);
            });
        } elseif ($user->isSupervisor()) {
            // Show follow-ups from supervisor's assigned branches
            $branchIds = $user->cabangs()->pluck('cabangs.id');
            $query->whereHas('leads', function ($q) use ($branchIds) {
                $q->whereIn('cabang_id', $branchIds);
            });
        }
        // For super_user with no active branch, show all follow-ups (no additional filter)

        return $query;
    }
}
