<?php

namespace App\Http\Controllers;

use App\Models\Leads;
use App\Models\FollowUp;
use App\Services\LeadManagementService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
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
        
        // Get leads based on user role
        $leadsQuery = Leads::where('is_active', true);
        
        // Apply active branch filtering first (if set)
        if ($activeBranch) {
            $leadsQuery->where('cabang_id', $activeBranch->id);
        }
        // Apply role-based filtering if no active branch is set
        elseif ($user->isMarketing()) {
            $leadsQuery->where('user_id', $user->id);
        } elseif ($user->isSupervisor()) {
            $cabangIds = $user->cabangs()->pluck('user_cabangs.cabang_id');
            $leadsQuery->whereIn('cabang_id', $cabangIds);
        }
        
        // Calculate statistics
        $stats = [
            'total_leads' => $leadsQuery->count(),
            'warm_leads' => (clone $leadsQuery)->where('status', 'WARM')->count(),
            'hot_leads' => (clone $leadsQuery)->where('status', 'HOT')->count(),
            'customers' => (clone $leadsQuery)->where('status', 'CONVERTED')->count(),
        ];

        // Add follow-up stats based on role and active branch
        if ($user->isMarketing()) {
            $stats['todays_followups'] = $this->leadService->getTodaysFollowUps($user->id)->count();
            $stats['overdue_followups'] = $this->leadService->getOverdueFollowUps($user->id)->count();
        } else {
            // For supervisors and super_users, get follow-ups based on active branch
            $followUpQuery = FollowUp::whereHas('leads', function ($q) use ($leadsQuery) {
                $q->whereIn('id', $leadsQuery->pluck('id'));
            });
            
            $stats['todays_followups'] = (clone $followUpQuery)
                ->whereDate('scheduled_at', Carbon::today())
                ->where('status', 'scheduled')
                ->count();
                
            $stats['overdue_followups'] = (clone $followUpQuery)
                ->where('scheduled_at', '<', Carbon::today())
                ->where('status', 'scheduled')
                ->count();
        }

        // Get recent leads
        $recentLeads = (clone $leadsQuery)
            ->with(['user', 'cabang'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($lead) {
                return [
                    'id' => $lead->id,
                    'nama_pelanggan' => $lead->nama_pelanggan,
                    'status' => $lead->status,
                    'tanggal_leads' => $lead->tanggal_leads->format('d M Y'),
                ];
            });

        // Get today's follow-ups based on role and active branch
        $todaysFollowups = [];
        if ($user->isMarketing()) {
            $todaysFollowups = $this->leadService->getTodaysFollowUps($user->id);
        } else {
            // For supervisors and super_users, get follow-ups based on active branch
            $todaysFollowups = FollowUp::with(['leads'])
                ->whereHas('leads', function ($q) use ($leadsQuery) {
                    $q->whereIn('id', $leadsQuery->pluck('id'));
                })
                ->whereDate('scheduled_at', Carbon::today())
                ->where('status', 'scheduled')
                ->orderBy('scheduled_at')
                ->get();
        }

        $todaysFollowups = $todaysFollowups->map(function ($followUp) {
            return [
                'id' => $followUp->id,
                'stage' => $followUp->stage,
                'scheduled_at' => $followUp->scheduled_at->toISOString(),
                'leads' => [
                    'nama_pelanggan' => $followUp->leads->nama_pelanggan,
                    'status' => $followUp->leads->status,
                ],
            ];
        });

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recent_leads' => $recentLeads,
            'todays_followups' => $todaysFollowups,
        ]);
    }
}
