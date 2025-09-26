<?php

namespace App\Http\Controllers;

use App\Models\Cabang;
use App\Models\Kunjungan;
use App\Models\KunjunganItemCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class KunjunganController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $activeBranch = $request->get('active_branch_object');
        
        $query = Kunjungan::with(['user', 'cabang'])
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
                $q->where('nama_masjid', 'like', "%{$search}%")
                  ->orWhere('bertemu_dengan', 'like', "%{$search}%")
                  ->orWhere('nomor_aktif_takmir', 'like', "%{$search}%");
            });
        }

        $kunjungans = $query->orderBy('created_at', 'desc')->paginate(15);

        return Inertia::render('kunjungans/index', [
            'kunjungans' => $kunjungans,
            'filters' => $request->only(['status', 'cabang_id', 'search']),
            'statuses' => ['COLD' => 'COLD', 'WARM' => 'WARM', 'HOT' => 'HOT'],
            'cabangs' => $user->isSuperUser() ? Cabang::where('is_active', true)->get() : $user->cabangs,
        ]);
    }

    public function create()
    {
        $user = auth()->user();

        return Inertia::render('kunjungans/create', [
            'cabangs' => $user->isMarketing() ? $user->cabangs : Cabang::where('is_active', true)->get(),
            'itemCategories' => KunjunganItemCategory::with('activeKunjunganItems')
                ->where('is_active', true)
                ->orderBy('urutan')
                ->get(),
            'config' => [
                'statuses' => ['COLD' => 'COLD', 'WARM' => 'WARM', 'HOT' => 'HOT'],
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'cabang_id' => 'required|exists:cabangs,id',
            'waktu_canvasing' => 'required|date',
            'bertemu_dengan' => 'required|string|max:255',
            'nomor_aktif_takmir' => 'required|string|max:255',
            'nama_masjid' => 'required|string|max:255',
            'alamat_masjid' => 'required|string',
            'foto_masjid' => 'nullable|image|max:10240',
            'nama_pengurus' => 'required|string|max:255',
            'jumlah_shof' => 'required|string|max:255',
            'kondisi_karpet' => 'required|string',
            'status' => 'required|in:COLD,WARM,HOT',
            'kebutuhan' => 'required|string',
            'catatan' => 'nullable|string',
            'item_responses' => 'array',
            'item_responses.*' => 'in:ada,belum_ada',
        ]);

        // Handle file upload
        if ($request->hasFile('foto_masjid')) {
            $validated['foto_masjid'] = $request->file('foto_masjid')->store('kunjungans', 'public');
        }

        $validated['user_id'] = auth()->id();

        $kunjungan = Kunjungan::create($validated);

        // Store item responses
        if ($request->filled('item_responses')) {
            foreach ($request->item_responses as $itemId => $status) {
                $kunjungan->kunjunganItems()->attach($itemId, ['status' => $status]);
            }
        }

        return to_route('kunjungans.index')
            ->with('success', 'Kunjungan berhasil ditambahkan.');
    }

    public function show(Kunjungan $kunjungan)
    {
        $kunjungan->load(['user', 'cabang', 'kunjunganItems.kunjunganItemCategory']);

        return Inertia::render('kunjungans/show', [
            'kunjungan' => $kunjungan,
        ]);
    }

    public function edit(Kunjungan $kunjungan)
    {
        $user = auth()->user();
        $kunjungan->load(['kunjunganItems']);

        return Inertia::render('kunjungans/edit', [
            'kunjungan' => $kunjungan,
            'cabangs' => $user->isMarketing() ? $user->cabangs : Cabang::where('is_active', true)->get(),
            'itemCategories' => KunjunganItemCategory::with('activeKunjunganItems')
                ->where('is_active', true)
                ->orderBy('urutan')
                ->get(),
            'config' => [
                'statuses' => ['COLD' => 'COLD', 'WARM' => 'WARM', 'HOT' => 'HOT'],
            ],
        ]);
    }

    public function update(Request $request, Kunjungan $kunjungan)
    {
        $validated = $request->validate([
            'cabang_id' => 'required|exists:cabangs,id',
            'waktu_canvasing' => 'required|date',
            'bertemu_dengan' => 'required|string|max:255',
            'nomor_aktif_takmir' => 'required|string|max:255',
            'nama_masjid' => 'required|string|max:255',
            'alamat_masjid' => 'required|string',
            'foto_masjid' => 'nullable|image|max:10240',
            'nama_pengurus' => 'required|string|max:255',
            'jumlah_shof' => 'required|string|max:255',
            'kondisi_karpet' => 'required|string',
            'status' => 'required|in:COLD,WARM,HOT',
            'kebutuhan' => 'required|string',
            'catatan' => 'nullable|string',
            'item_responses' => 'array',
            'item_responses.*' => 'in:ada,belum_ada',
        ]);

        // Handle file upload
        if ($request->hasFile('foto_masjid')) {
            // Delete old file if exists
            if ($kunjungan->foto_masjid) {
                Storage::disk('public')->delete($kunjungan->foto_masjid);
            }
            $validated['foto_masjid'] = $request->file('foto_masjid')->store('kunjungans', 'public');
        } else {
            // Remove foto_masjid from validated data if no file uploaded
            unset($validated['foto_masjid']);
        }

        $kunjungan->update($validated);

        // Update item responses
        $kunjungan->kunjunganItems()->detach();
        if ($request->filled('item_responses')) {
            foreach ($request->item_responses as $itemId => $status) {
                $kunjungan->kunjunganItems()->attach($itemId, ['status' => $status]);
            }
        }

        return to_route('kunjungans.index')
            ->with('success', 'Kunjungan berhasil diperbarui.');
    }

    public function image(Kunjungan $kunjungan)
    {
        if (!$kunjungan->foto_masjid) {
            abort(404, 'Image not found.');
        }

        $filePath = storage_path('app/public/' . $kunjungan->foto_masjid);
        
        if (!file_exists($filePath)) {
            abort(404, 'Image file not found.');
        }

        return response()->file($filePath);
    }

    public function downloadImage(Kunjungan $kunjungan)
    {
        if (!$kunjungan->foto_masjid) {
            abort(404, 'Image not found.');
        }

        $filePath = storage_path('app/public/' . $kunjungan->foto_masjid);
        
        if (!file_exists($filePath)) {
            abort(404, 'Image file not found.');
        }

        $fileName = 'foto_masjid_' . $kunjungan->nama_masjid . '_' . $kunjungan->id . '.' . pathinfo($kunjungan->foto_masjid, PATHINFO_EXTENSION);

        return response()->download($filePath, $fileName);
    }

    public function destroy(Kunjungan $kunjungan)
    {
        // Delete associated file
        if ($kunjungan->foto_masjid) {
            Storage::disk('public')->delete($kunjungan->foto_masjid);
        }

        $kunjungan->update(['is_active' => false]);

        return back()->with('success', 'Kunjungan berhasil dihapus.');
    }
}
