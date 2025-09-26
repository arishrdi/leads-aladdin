<?php

namespace App\Http\Controllers;

use App\Models\Leads;
use App\Models\FollowUp;
use App\Models\Cabang;
use App\Models\Kunjungan;
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
        
        // Get kunjungan based on user role and active branch
        $kunjunganQuery = Kunjungan::where('is_active', true);
        
        // Apply active branch filtering first (if set)
        if ($activeBranch) {
            $kunjunganQuery->where('cabang_id', $activeBranch->id);
        }
        // Apply role-based filtering if no active branch is set
        elseif ($user->isMarketing()) {
            $kunjunganQuery->where('user_id', $user->id);
        } elseif ($user->isSupervisor()) {
            $cabangIds = $user->cabangs()->pluck('user_cabangs.cabang_id');
            $kunjunganQuery->whereIn('cabang_id', $cabangIds);
        }

        // Calculate statistics
        $stats = [
            'total_leads' => $leadsQuery->count(),
            'warm_leads' => (clone $leadsQuery)->where('status', 'WARM')->count(),
            'hot_leads' => (clone $leadsQuery)->where('status', 'HOT')->count(),
            'customers' => (clone $leadsQuery)->where('status', 'CUSTOMER')->count(),
            'total_kunjungan' => $kunjunganQuery->count(),
            'active_kunjungan' => (clone $kunjunganQuery)->whereIn('status', ['WARM', 'HOT'])->count(),
            'completed_kunjungan' => (clone $kunjunganQuery)->where('status', 'HOT')->count(),
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

        // Get recent kunjungan
        $recentKunjungan = (clone $kunjunganQuery)
            ->with(['user', 'cabang'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($kunjungan) {
                return [
                    'id' => $kunjungan->id,
                    'nama_masjid' => $kunjungan->nama_masjid,
                    'status' => $kunjungan->status,
                    'waktu_canvasing' => $kunjungan->waktu_canvasing->format('d M Y'),
                    'bertemu_dengan' => $kunjungan->bertemu_dengan,
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

        // Get all branches data for comparison mode (super-user only)
        $allBranches = [];
        $outletComparison = [];
        
        if ($user->role === 'super_user') {
            // Get all branches for super user
            $allBranchesData = Cabang::where('is_active', true)->get();
            
            $allBranches = $allBranchesData->map(function ($cabang) {
                $cabangLeads = Leads::where('cabang_id', $cabang->id)->where('is_active', true);
                
                $totalLeads = $cabangLeads->count();
                $warmLeads = (clone $cabangLeads)->where('status', 'WARM')->count();
                $hotLeads = (clone $cabangLeads)->where('status', 'HOT')->count();
                $customers = (clone $cabangLeads)->where('status', 'CUSTOMER')->count();
                $exitLeads = (clone $cabangLeads)->where('status', 'EXIT')->count();
                $coldLeads = (clone $cabangLeads)->where('status', 'COLD')->count();
                $crossSellingLeads = (clone $cabangLeads)->where('status', 'CROSS_SELLING')->count();
                
                $conversionRate = $totalLeads > 0 ? round(($customers / $totalLeads) * 100, 1) : 0;
                
                // Calculate potential revenue
                $potentialRevenue = (clone $cabangLeads)->sum('potensi_nilai') ?? 0;
                $dealRevenue = (clone $cabangLeads)->where('status', 'CUSTOMER')->sum('nominal_deal') ?? 0;
                
                // This month's stats
                $thisMonthLeads = (clone $cabangLeads)
                    ->whereMonth('created_at', Carbon::now()->month)
                    ->whereYear('created_at', Carbon::now()->year)
                    ->count();
                
                $thisMonthCustomers = (clone $cabangLeads)
                    ->where('status', 'CUSTOMER')
                    ->whereMonth('tanggal_closing', Carbon::now()->month)
                    ->whereYear('tanggal_closing', Carbon::now()->year)
                    ->count();

                // Follow-up stats for this branch
                $todaysFollowups = FollowUp::whereHas('leads', function ($q) use ($cabang) {
                        $q->where('cabang_id', $cabang->id);
                    })
                    ->whereDate('scheduled_at', Carbon::today())
                    ->where('status', 'scheduled')
                    ->count();
                    
                $overdueFollowups = FollowUp::whereHas('leads', function ($q) use ($cabang) {
                        $q->where('cabang_id', $cabang->id);
                    })
                    ->where('scheduled_at', '<', Carbon::today())
                    ->where('status', 'scheduled')
                    ->count();

                // Kunjungan stats for this branch
                $cabangKunjungan = Kunjungan::where('cabang_id', $cabang->id)->where('is_active', true);
                $totalKunjungan = $cabangKunjungan->count();
                $activeKunjungan = (clone $cabangKunjungan)->whereIn('status', ['WARM', 'HOT'])->count();
                $completedKunjungan = (clone $cabangKunjungan)->where('status', 'HOT')->count();
                
                $thisMonthKunjungan = (clone $cabangKunjungan)
                    ->whereMonth('created_at', Carbon::now()->month)
                    ->whereYear('created_at', Carbon::now()->year)
                    ->count();

                // Recent leads for this branch
                $recentLeads = (clone $cabangLeads)
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

                return [
                    'id' => $cabang->id,
                    'nama_cabang' => $cabang->nama_cabang,
                    'lokasi' => $cabang->lokasi,
                    'pic' => $cabang->pic,
                    'stats' => [
                        'total_leads' => $totalLeads,
                        'warm_leads' => $warmLeads,
                        'hot_leads' => $hotLeads,
                        'customers' => $customers,
                        'exit_leads' => $exitLeads,
                        'cold_leads' => $coldLeads,
                        'cross_selling_leads' => $crossSellingLeads,
                        'conversion_rate' => $conversionRate,
                        'potential_revenue' => $potentialRevenue,
                        'deal_revenue' => $dealRevenue,
                        'this_month_leads' => $thisMonthLeads,
                        'this_month_customers' => $thisMonthCustomers,
                        'todays_followups' => $todaysFollowups,
                        'overdue_followups' => $overdueFollowups,
                        'total_kunjungan' => $totalKunjungan,
                        'active_kunjungan' => $activeKunjungan,
                        'completed_kunjungan' => $completedKunjungan,
                        'this_month_kunjungan' => $thisMonthKunjungan,
                    ],
                    'recent_leads' => $recentLeads
                ];
            });
            
            // Set outlet comparison to current logic for backward compatibility
            $outletComparison = $allBranches;
        } elseif ($user->isSupervisor()) {
            // Get branches assigned to supervisor
            $cabangs = $user->cabangs()->where('is_active', true)->get();

            $outletComparison = $cabangs->map(function ($cabang) {
                $cabangLeads = Leads::where('cabang_id', $cabang->id)->where('is_active', true);
                
                $totalLeads = $cabangLeads->count();
                $warmLeads = (clone $cabangLeads)->where('status', 'WARM')->count();
                $hotLeads = (clone $cabangLeads)->where('status', 'HOT')->count();
                $customers = (clone $cabangLeads)->where('status', 'CUSTOMER')->count();
                $exitLeads = (clone $cabangLeads)->where('status', 'EXIT')->count();
                $coldLeads = (clone $cabangLeads)->where('status', 'COLD')->count();
                
                $conversionRate = $totalLeads > 0 ? round(($customers / $totalLeads) * 100, 1) : 0;
                
                // Calculate potential revenue
                $potentialRevenue = (clone $cabangLeads)->sum('potensi_nilai') ?? 0;
                $dealRevenue = (clone $cabangLeads)->where('status', 'CUSTOMER')->sum('nominal_deal') ?? 0;
                
                // This month's stats
                $thisMonthLeads = (clone $cabangLeads)
                    ->whereMonth('created_at', Carbon::now()->month)
                    ->whereYear('created_at', Carbon::now()->year)
                    ->count();
                
                $thisMonthCustomers = (clone $cabangLeads)
                    ->where('status', 'CUSTOMER')
                    ->whereMonth('tanggal_closing', Carbon::now()->month)
                    ->whereYear('tanggal_closing', Carbon::now()->year)
                    ->count();

                return [
                    'id' => $cabang->id,
                    'nama_cabang' => $cabang->nama_cabang,
                    'lokasi' => $cabang->lokasi,
                    'pic' => $cabang->pic,
                    'stats' => [
                        'total_leads' => $totalLeads,
                        'warm_leads' => $warmLeads,
                        'hot_leads' => $hotLeads,
                        'customers' => $customers,
                        'exit_leads' => $exitLeads,
                        'cold_leads' => $coldLeads,
                        'conversion_rate' => $conversionRate,
                        'potential_revenue' => $potentialRevenue,
                        'deal_revenue' => $dealRevenue,
                        'this_month_leads' => $thisMonthLeads,
                        'this_month_customers' => $thisMonthCustomers,
                    ]
                ];
            });
        }

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recent_leads' => $recentLeads,
            'recent_kunjungan' => $recentKunjungan,
            'todays_followups' => $todaysFollowups,
            'outlet_comparison' => $outletComparison,
            'all_branches' => $allBranches,
        ]);
    }
}
