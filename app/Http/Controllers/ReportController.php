<?php

namespace App\Http\Controllers;

use App\Models\Leads;
use App\Models\FollowUp;
use App\Models\Cabang;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Dompdf\Dompdf;
use Dompdf\Options;

class ReportController extends Controller
{
    public function __construct()
    {
        //
    }

    public function index(Request $request)
    {
        $user = auth()->user();
        $activeBranch = $request->get('active_branch_object');
        $dateFrom = $request->get('date_from', now()->startOfMonth()->toDateString());
        $dateTo = $request->get('date_to', now()->toDateString());
        $cabangId = $request->get('cabang_id');
        $userId = $request->get('user_id');

        // Build base query with user role restrictions
        $leadsQuery = Leads::query();
        
        // Apply active branch filtering first (if set)
        if ($activeBranch) {
            $leadsQuery->where('cabang_id', $activeBranch->id);
        }
        // Apply role-based filtering if no active branch is set
        elseif ($user->role === 'supervisor') {
            $userCabangIds = $user->cabangs->pluck('id');
            $leadsQuery->whereIn('cabang_id', $userCabangIds);
        }

        // Apply filters
        $leadsQuery->whereBetween('leads.created_at', [$dateFrom . ' 00:00:00', $dateTo . ' 23:59:59']);
        
        if ($cabangId) {
            $leadsQuery->where('cabang_id', $cabangId);
        }
        
        if ($userId) {
            $leadsQuery->where('user_id', $userId);
        }

        // Get summary statistics
        $totalLeads = (clone $leadsQuery)->count();
        $warmLeads = (clone $leadsQuery)->where('status', 'WARM')->count();
        $hotLeads = (clone $leadsQuery)->where('status', 'HOT')->count();
        $customerLeads = (clone $leadsQuery)->where('status', 'CUSTOMER')->count();
        $exitLeads = (clone $leadsQuery)->where('status', 'EXIT')->count();
        $coldLeads = (clone $leadsQuery)->where('status', 'COLD')->count();
        $crossSellingLeads = (clone $leadsQuery)->where('status', 'CROSS_SELLING')->count();
        
        $totalRevenue = (clone $leadsQuery)->where('status', 'CUSTOMER')->sum('nominal_deal') ?? 0;
        $averageDeal = $customerLeads > 0 ? $totalRevenue / $customerLeads : 0;
        $conversionRate = $totalLeads > 0 ? ($customerLeads / $totalLeads) * 100 : 0;

        // Lead sources analysis
        $leadSources = (clone $leadsQuery)
            ->select('sumber_leads.nama', DB::raw('count(*) as total'))
            ->join('sumber_leads', 'leads.sumber_leads_id', '=', 'sumber_leads.id')
            ->groupBy('sumber_leads.id', 'sumber_leads.nama')
            ->orderByDesc('total')
            ->get();

        // Daily leads trend
        $dailyLeads = (clone $leadsQuery)
            ->select(DB::raw('DATE(leads.created_at) as date'), DB::raw('count(*) as total'))
            ->groupBy(DB::raw('DATE(leads.created_at)'))
            ->orderBy('date')
            ->get();

        // Top performers
        $topPerformers = (clone $leadsQuery)
            ->select('users.name', 'users.email', 
                DB::raw('count(*) as total_leads'),
                DB::raw('sum(case when status = "CUSTOMER" then 1 else 0 end) as converted_leads'),
                DB::raw('sum(case when status = "CUSTOMER" then nominal_deal else 0 end) as total_revenue')
            )
            ->join('users', 'leads.user_id', '=', 'users.id')
            ->groupBy('users.id', 'users.name', 'users.email')
            ->orderByDesc('converted_leads')
            ->limit(10)
            ->get();

        // Branch performance
        $branchPerformance = (clone $leadsQuery)
            ->select('cabangs.nama_cabang', 
                DB::raw('count(*) as total_leads'),
                DB::raw('sum(case when status = "CUSTOMER" then 1 else 0 end) as converted_leads'),
                DB::raw('sum(case when status = "CUSTOMER" then nominal_deal else 0 end) as total_revenue')
            )
            ->join('cabangs', 'leads.cabang_id', '=', 'cabangs.id')
            ->groupBy('cabangs.id', 'cabangs.nama_cabang')
            ->orderByDesc('total_revenue')
            ->get();

        // Follow-up effectiveness
        $followUpStats = FollowUp::whereHas('leads', function($query) use ($leadsQuery) {
                $query->whereIn('id', $leadsQuery->pluck('id'));
            })
            ->select('stage', 
                DB::raw('count(*) as total'),
                DB::raw('avg(attempt_count) as avg_attempts')
            )
            ->whereNotNull('completed_at')
            ->groupBy('stage')
            ->orderBy('stage')
            ->get();

        // Get filter options
        $cabangs = Cabang::where('is_active', true)->orderBy('nama_cabang')->get();
        
        $usersQuery = User::where('role', 'marketing')->where('is_active', true);
        if ($user->role === 'supervisor') {
            $userCabangIds = $user->cabangs->pluck('id');
            $usersQuery->whereHas('cabangs', function($query) use ($userCabangIds) {
                $query->whereIn('cabangs.id', $userCabangIds);
            });
        }
        $users = $usersQuery->orderBy('name')->get();

        return Inertia::render('reports/index', [
            'summary' => [
                'total_leads' => $totalLeads,
                'warm_leads' => $warmLeads,
                'hot_leads' => $hotLeads,
                'customer_leads' => $customerLeads,
                'exit_leads' => $exitLeads,
                'cold_leads' => $coldLeads,
                'cross_selling_leads' => $crossSellingLeads,
                'total_revenue' => $totalRevenue,
                'average_deal' => $averageDeal,
                'conversion_rate' => $conversionRate,
            ],
            'charts' => [
                'lead_sources' => $leadSources,
                'daily_leads' => $dailyLeads,
                'follow_up_stats' => $followUpStats,
            ],
            'performance' => [
                'top_performers' => $topPerformers,
                'branch_performance' => $branchPerformance,
            ],
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
                'cabang_id' => $cabangId,
                'user_id' => $userId,
            ],
            'options' => [
                'cabangs' => $cabangs,
                'users' => $users,
            ],
        ]);
    }

    public function export(Request $request)
    {
        $user = auth()->user();
        $activeBranch = $request->get('active_branch_object');
        $dateFrom = $request->get('date_from', now()->startOfMonth()->toDateString());
        $dateTo = $request->get('date_to', now()->toDateString());
        $format = $request->get('format', 'excel'); // excel or pdf

        // Build query with same filters as index
        $leadsQuery = Leads::with(['user', 'cabang', 'sumberLeads', 'tipeKarpet'])
            ->whereBetween('leads.created_at', [$dateFrom . ' 00:00:00', $dateTo . ' 23:59:59']);

        // Apply active branch filtering first (if set)
        if ($activeBranch) {
            $leadsQuery->where('cabang_id', $activeBranch->id);
        }
        // Apply role-based filtering if no active branch is set
        elseif ($user->role === 'supervisor') {
            $userCabangIds = $user->cabangs->pluck('id');
            $leadsQuery->whereIn('cabang_id', $userCabangIds);
        }

        if ($request->cabang_id) {
            $leadsQuery->where('cabang_id', $request->cabang_id);
        }

        if ($request->user_id) {
            $leadsQuery->where('user_id', $request->user_id);
        }

        $leads = $leadsQuery->orderBy('created_at', 'desc')->get();

        if ($format === 'pdf') {
            return $this->exportToPdf($leads, $dateFrom, $dateTo);
        }

        return $this->exportToExcel($leads, $dateFrom, $dateTo);
    }

    private function exportToExcel($leads, $dateFrom, $dateTo)
    {
        $filename = "laporan_leads_{$dateFrom}_to_{$dateTo}.csv";
        
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function() use ($leads) {
            $file = fopen('php://output', 'w');
            
            // CSV Headers
            fputcsv($file, [
                'Tanggal Dibuat',
                'Nama Pelanggan',
                'Sapaan',
                'No WhatsApp',
                'Nama Masjid/Instansi',
                'Alamat',
                'Status',
                'Sumber Leads',
                'Tipe Karpet',
                'Budget Min',
                'Budget Max',
                'Nominal Deal',
                'Tanggal Closing',
                'PIC Marketing',
                'Cabang',
                'Catatan'
            ]);

            // CSV Data
            foreach ($leads as $lead) {
                fputcsv($file, [
                    $lead->created_at->format('d/m/Y H:i'),
                    $lead->nama_pelanggan,
                    $lead->sapaan,
                    $lead->no_whatsapp,
                    $lead->nama_masjid_instansi,
                    $lead->alamat,
                    $lead->status,
                    $lead->sumberLeads->nama ?? '',
                    $lead->tipeKarpet->nama ?? '',
                    $lead->budget_min,
                    $lead->budget_max,
                    $lead->nominal_deal ?? '',
                    $lead->tanggal_closing ? $lead->tanggal_closing->format('d/m/Y') : '',
                    $lead->user->name ?? '',
                    $lead->cabang->nama_cabang ?? '',
                    $lead->catatan
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    private function exportToPdf($leads, $dateFrom, $dateTo)
    {
        $user = auth()->user();
        $activeBranch = request()->get('active_branch_object');
        
        // Build query for summary data (reuse logic from index method)
        $leadsQuery = Leads::query();
        
        if ($activeBranch) {
            $leadsQuery->where('cabang_id', $activeBranch->id);
        } elseif ($user->role === 'supervisor') {
            $userCabangIds = $user->cabangs->pluck('id');
            $leadsQuery->whereIn('cabang_id', $userCabangIds);
        }
        
        $leadsQuery->whereBetween('leads.created_at', [$dateFrom . ' 00:00:00', $dateTo . ' 23:59:59']);
        
        if (request()->cabang_id) {
            $leadsQuery->where('cabang_id', request()->cabang_id);
        }
        
        if (request()->user_id) {
            $leadsQuery->where('user_id', request()->user_id);
        }

        // Get summary statistics
        $totalLeads = (clone $leadsQuery)->count();
        $warmLeads = (clone $leadsQuery)->where('status', 'WARM')->count();
        $hotLeads = (clone $leadsQuery)->where('status', 'HOT')->count();
        $customerLeads = (clone $leadsQuery)->where('status', 'CUSTOMER')->count();
        $exitLeads = (clone $leadsQuery)->where('status', 'EXIT')->count();
        $coldLeads = (clone $leadsQuery)->where('status', 'COLD')->count();
        $crossSellingLeads = (clone $leadsQuery)->where('status', 'CROSS_SELLING')->count();
        
        $totalRevenue = (clone $leadsQuery)->where('status', 'CUSTOMER')->sum('nominal_deal') ?? 0;
        $averageDeal = $customerLeads > 0 ? $totalRevenue / $customerLeads : 0;
        $conversionRate = $totalLeads > 0 ? ($customerLeads / $totalLeads) * 100 : 0;

        // Lead sources analysis
        $leadSources = (clone $leadsQuery)
            ->select('sumber_leads.nama', DB::raw('count(*) as total'))
            ->join('sumber_leads', 'leads.sumber_leads_id', '=', 'sumber_leads.id')
            ->groupBy('sumber_leads.id', 'sumber_leads.nama')
            ->orderByDesc('total')
            ->get();

        // Top performers
        $topPerformers = (clone $leadsQuery)
            ->select('users.name', 'users.email', 
                DB::raw('count(*) as total_leads'),
                DB::raw('sum(case when status = "CUSTOMER" then 1 else 0 end) as converted_leads'),
                DB::raw('sum(case when status = "CUSTOMER" then nominal_deal else 0 end) as total_revenue')
            )
            ->join('users', 'leads.user_id', '=', 'users.id')
            ->groupBy('users.id', 'users.name', 'users.email')
            ->orderByDesc('converted_leads')
            ->limit(10)
            ->get();

        // Branch performance
        $branchPerformance = (clone $leadsQuery)
            ->select('cabangs.nama_cabang', 
                DB::raw('count(*) as total_leads'),
                DB::raw('sum(case when status = "CUSTOMER" then 1 else 0 end) as converted_leads'),
                DB::raw('sum(case when status = "CUSTOMER" then nominal_deal else 0 end) as total_revenue')
            )
            ->join('cabangs', 'leads.cabang_id', '=', 'cabangs.id')
            ->groupBy('cabangs.id', 'cabangs.nama_cabang')
            ->orderByDesc('total_revenue')
            ->get();

        $data = [
            'summary' => [
                'total_leads' => $totalLeads,
                'warm_leads' => $warmLeads,
                'hot_leads' => $hotLeads,
                'customer_leads' => $customerLeads,
                'exit_leads' => $exitLeads,
                'cold_leads' => $coldLeads,
                'cross_selling_leads' => $crossSellingLeads,
                'total_revenue' => $totalRevenue,
                'average_deal' => $averageDeal,
                'conversion_rate' => $conversionRate,
            ],
            'charts' => [
                'lead_sources' => $leadSources,
            ],
            'performance' => [
                'top_performers' => $topPerformers,
                'branch_performance' => $branchPerformance,
            ],
            'date_from' => $dateFrom,
            'date_to' => $dateTo,
        ];

        // Configure DomPDF options
        $options = new Options();
        $options->set('defaultFont', 'DejaVu Sans');
        $options->set('isRemoteEnabled', true);
        $options->set('isHtml5ParserEnabled', true);
        
        // Create DomPDF instance
        $dompdf = new Dompdf($options);
        
        // Load HTML content
        $html = view('reports.pdf', $data)->render();
        $dompdf->loadHtml($html);
        
        // Set paper size and orientation
        $dompdf->setPaper('A4', 'portrait');
        
        // Render the PDF
        $dompdf->render();
        
        // Generate filename
        $filename = "laporan_leads_{$dateFrom}_to_{$dateTo}.pdf";
        
        // Return the PDF as download
        return response()->streamDownload(function () use ($dompdf) {
            echo $dompdf->output();
        }, $filename, [
            'Content-Type' => 'application/pdf',
        ]);
    }
}