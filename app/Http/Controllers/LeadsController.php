<?php

namespace App\Http\Controllers;

use App\Models\Cabang;
use App\Models\Leads;
use App\Models\SumberLeads;
use App\Models\TipeKarpet;
use App\Services\LeadManagementService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeadsController extends Controller
{
    public function __construct(
        private LeadManagementService $leadService
    ) {
        //
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', Leads::class);

        $user = auth()->user();
        $activeBranch = $request->get('active_branch_object');
        
        $query = Leads::with(['user', 'cabang', 'sumberLeads', 'tipeKarpet'])
            ->where('is_active', true);

        // Apply active branch filtering first (if set)
        if ($activeBranch) {
            $query->where('cabang_id', $activeBranch->id);
        }
        // Apply role-based filtering if no active branch is set
        elseif ($user->isMarketing()) {
            $query->where('user_id', $user->id);
        } elseif ($user->isSupervisor()) {
            $cabangIds = $user->cabangs()->pluck('user_cabangs.cabang_id');
            $query->whereIn('cabang_id', $cabangIds);
        }

        // Apply filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('cabang_id') && $user->isSuperUser()) {
            $query->where('cabang_id', $request->cabang_id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_pelanggan', 'like', "%{$search}%")
                  ->orWhere('no_whatsapp', 'like', "%{$search}%")
                  ->orWhere('nama_masjid_instansi', 'like', "%{$search}%");
            });
        }

        $leads = $query->orderBy('created_at', 'desc')->paginate(15);

        return Inertia::render('leads/index', [
            'leads' => $leads,
            'filters' => $request->only(['status', 'cabang_id', 'search']),
            'statuses' => config('leads.statuses'),
            'cabangs' => $user->isSuperUser() ? Cabang::where('is_active', true)->get() : $user->cabangs,
        ]);
    }

    public function create()
    {
        $this->authorize('create', Leads::class);

        $user = auth()->user();

        return Inertia::render('leads/create', [
            'sumberLeads' => SumberLeads::where('is_active', true)->get(),
            'tipeKarpets' => TipeKarpet::where('is_active', true)->get(),
            'cabangs' => $user->isMarketing() ? $user->cabangs : Cabang::where('is_active', true)->get(),
            'config' => [
                'statuses' => config('leads.statuses'),
                'prioritas' => config('leads.prioritas'),
                'sapaan' => config('leads.sapaan'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Leads::class);

        // Clean formatted currency before validation
        if ($request->filled('potensi_nilai')) {
            $cleanValue = (float) str_replace('.', '', $request->input('potensi_nilai'));
            $request->merge(['potensi_nilai' => $cleanValue]);
        }
        
        $validated = $request->validate([
            'tanggal_leads' => 'required|date',
            'sapaan' => 'required|in:Bapak,Ibu',
            'nama_pelanggan' => 'required|string|max:255',
            'no_whatsapp' => 'required|string|max:255',
            'nama_masjid_instansi' => 'nullable|string|max:255',
            'sumber_leads_id' => 'required|exists:sumber_leads,id',
            'catatan' => 'nullable|string',
            'alamat' => 'nullable|string',
            'prioritas' => 'required|in:fasttrack,normal,rendah',
            'kebutuhan_karpet' => 'nullable|string|max:255',
            'potensi_nilai' => 'nullable|numeric|min:0',
            'tipe_karpet_id' => 'nullable|exists:tipe_karpets,id',
            'cabang_id' => 'required|exists:cabangs,id',
            'status' => 'required|in:WARM,HOT,CUSTOMER,EXIT,COLD,CROSS_SELLING',
        ]);

        // Format phone number
        $validated['no_whatsapp'] = $this->leadService->formatPhoneNumber($validated['no_whatsapp']);
        $validated['user_id'] = auth()->id();

        $lead = Leads::create($validated);

        // Auto-create first follow-up for leads that need follow-up
        if (in_array($lead->status, ['WARM', 'HOT'])) {
            $this->leadService->createFirstFollowUp($lead);
        }

        return redirect()->route('leads.index')
            ->with('success', 'Lead berhasil dibuat.');
    }

    public function show(Leads $lead)
    {
        $this->authorize('view', $lead);

        $lead->load(['user', 'cabang', 'sumberLeads', 'tipeKarpet', 'followUps.user', 'dokumens.user']);

        return Inertia::render('leads/show', [
            'lead' => $lead,
            'config' => [
                'statuses' => config('leads.statuses'),
                'followUpStages' => config('leads.follow_up_stages'),
            ],
        ]);
    }

    public function edit(Leads $lead)
    {
        $this->authorize('update', $lead);

        $user = auth()->user();

        return Inertia::render('leads/edit', [
            'lead' => $lead,
            'sumberLeads' => SumberLeads::where('is_active', true)->get(),
            'tipeKarpets' => TipeKarpet::where('is_active', true)->get(),
            'cabangs' => $user->isMarketing() ? $user->cabangs : Cabang::where('is_active', true)->get(),
            'config' => [
                'statuses' => config('leads.statuses'),
                'prioritas' => config('leads.prioritas'),
                'sapaan' => config('leads.sapaan'),
                'alasanClosing' => config('leads.alasan_closing'),
                'alasanTidakClosing' => config('leads.alasan_tidak_closing'),
            ],
        ]);
    }

    public function update(Request $request, Leads $lead)
    {
        $this->authorize('update', $lead);

        // Clean formatted currency before validation
        if ($request->filled('potensi_nilai')) {
            $cleanValue = (float) str_replace('.', '', $request->input('potensi_nilai'));
            $request->merge(['potensi_nilai' => $cleanValue]);
        }
        
        $validated = $request->validate([
            'tanggal_leads' => 'required|date',
            'sapaan' => 'required|in:Bapak,Ibu',
            'nama_pelanggan' => 'required|string|max:255',
            'no_whatsapp' => 'required|string|max:255',
            'nama_masjid_instansi' => 'nullable|string|max:255',
            'sumber_leads_id' => 'required|exists:sumber_leads,id',
            'catatan' => 'nullable|string',
            'alamat' => 'nullable|string',
            'alasan_closing' => 'nullable|string',
            'alasan_tidak_closing' => 'nullable|string',
            'prioritas' => 'required|in:fasttrack,normal,rendah',
            'kebutuhan_karpet' => 'nullable|string|max:255',
            'potensi_nilai' => 'nullable|numeric|min:0',
            'tipe_karpet_id' => 'nullable|exists:tipe_karpets,id',
            'cabang_id' => 'required|exists:cabangs,id',
            'status' => 'required|in:WARM,HOT,CUSTOMER,EXIT,COLD,CROSS_SELLING',
        ]);

        // Format phone number
        $validated['no_whatsapp'] = $this->leadService->formatPhoneNumber($validated['no_whatsapp']);

        $lead->update($validated);

        return redirect()->route('leads.show', $lead)
            ->with('success', 'Lead berhasil diperbarui.');
    }

    public function destroy(Leads $lead)
    {
        $this->authorize('delete', $lead);

        $lead->update(['is_active' => false]);

        return redirect()->route('leads.index')
            ->with('success', 'Lead berhasil dihapus.');
    }
}
