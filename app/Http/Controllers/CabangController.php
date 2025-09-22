<?php

namespace App\Http\Controllers;

use App\Models\Cabang;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CabangController extends Controller
{
    public function __construct()
    {
        //
    }

    public function index()
    {
        $this->authorize('viewAny', Cabang::class);

        $cabangs = Cabang::withCount(['users', 'leads'])
            ->with(['users' => function($query) {
                $query->select('users.id', 'name', 'email', 'role')->where('users.is_active', true);
            }])
            ->orderBy('nama_cabang')
            ->get();

        return Inertia::render('cabangs/index', [
            'cabangs' => $cabangs,
        ]);
    }

    public function create()
    {
        $this->authorize('create', Cabang::class);

        $supervisors = User::where('role', 'supervisor')
            ->where('is_active', true)
            ->select('id', 'name', 'email', 'role')
            ->orderBy('name')
            ->get();

        return Inertia::render('cabangs/create', [
            'supervisors' => $supervisors,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Cabang::class);

        $validated = $request->validate([
            'nama_cabang' => 'required|string|max:255|unique:cabangs',
            'lokasi' => 'required|string|max:255',
            'alamat' => 'required|string',
            'no_telp' => 'required|string|max:20',
            'pic' => 'required|string|max:255',
            'is_active' => 'boolean',
            'user_ids' => 'array',
            'user_ids.*' => 'exists:users,id',
        ]);

        $cabang = Cabang::create([
            'nama_cabang' => $validated['nama_cabang'],
            'lokasi' => $validated['lokasi'],
            'alamat' => $validated['alamat'],
            'no_telp' => $validated['no_telp'],
            'pic' => $validated['pic'],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        // Assign users to this branch
        if (!empty($validated['user_ids'])) {
            $cabang->users()->attach($validated['user_ids']);
        }

        return redirect()->route('cabangs.index')
            ->with('success', 'Cabang berhasil ditambahkan.');
    }

    public function show(Cabang $cabang)
    {
        $this->authorize('view', $cabang);

        $cabang->load([
            'users' => function($query) {
                $query->select('users.id', 'name', 'email', 'role', 'users.is_active')->orderBy('name');
            },
            'leads' => function($query) {
                $query->with(['user:id,name', 'sumberLeads:id,nama'])
                    ->select('id', 'nama_pelanggan', 'status', 'budget_min', 'budget_max', 'user_id', 'sumber_leads_id', 'cabang_id', 'created_at')
                    ->latest()
                    ->take(10);
            }
        ]);

        $stats = [
            'total_leads' => $cabang->leads()->count(),
            'active_leads' => $cabang->leads()->whereIn('status', ['NEW', 'QUALIFIED', 'WARM', 'HOT'])->count(),
            'converted_leads' => $cabang->leads()->where('status', 'CONVERTED')->count(),
            'total_revenue' => $cabang->leads()->where('status', 'CONVERTED')->sum('nominal_deal') ?? 0,
        ];

        return Inertia::render('cabangs/show', [
            'cabang' => $cabang,
            'stats' => $stats,
        ]);
    }

    public function edit(Cabang $cabang)
    {
        $this->authorize('update', $cabang);

        $cabang->load('users:users.id,name,email,role');
        
        $supervisors = User::where('role', 'supervisor')
            ->where('is_active', true)
            ->select('id', 'name', 'email', 'role')
            ->orderBy('name')
            ->get();

        return Inertia::render('cabangs/edit', [
            'cabang' => $cabang,
            'supervisors' => $supervisors,
        ]);
    }

    public function update(Request $request, Cabang $cabang)
    {
        $this->authorize('update', $cabang);

        $validated = $request->validate([
            'nama_cabang' => 'required|string|max:255|unique:cabangs,nama_cabang,' . $cabang->id,
            'lokasi' => 'required|string|max:255',
            'alamat' => 'required|string',
            'no_telp' => 'required|string|max:20',
            'pic' => 'required|string|max:255',
            'is_active' => 'boolean',
            'user_ids' => 'array',
            'user_ids.*' => 'exists:users,id',
        ]);

        $cabang->update([
            'nama_cabang' => $validated['nama_cabang'],
            'lokasi' => $validated['lokasi'],
            'alamat' => $validated['alamat'],
            'no_telp' => $validated['no_telp'],
            'pic' => $validated['pic'],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        // Sync users for this branch
        $cabang->users()->sync($validated['user_ids'] ?? []);

        return redirect()->route('cabangs.index')
            ->with('success', 'Cabang berhasil diperbarui.');
    }

    public function destroy(Cabang $cabang)
    {
        $this->authorize('delete', $cabang);

        // Check if branch has active leads
        $activeLeadsCount = $cabang->leads()->whereIn('status', ['NEW', 'QUALIFIED', 'WARM', 'HOT'])->count();
        
        if ($activeLeadsCount > 0) {
            return back()->with('error', 'Tidak dapat menghapus cabang yang masih memiliki leads aktif.');
        }

        // Detach all users from this branch
        $cabang->users()->detach();
        
        $cabang->delete();

        return redirect()->route('cabangs.index')
            ->with('success', 'Cabang berhasil dihapus.');
    }
}
