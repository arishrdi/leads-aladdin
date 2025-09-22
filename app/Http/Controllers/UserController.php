<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Cabang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class UserController extends Controller
{
    public function __construct()
    {
        //
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', User::class);

        $currentUser = auth()->user();
        $activeBranch = $request->get('active_branch_object');
        
        $usersQuery = User::with(['cabangs']);
        
        // Filter users based on active branch for supervisor and super_user
        if ($currentUser->role !== 'marketing') {
            if ($activeBranch) {
                // Show users assigned to the active branch
                $usersQuery->whereHas('cabangs', function ($q) use ($activeBranch) {
                    $q->where('cabangs.id', $activeBranch->id);
                });
            } elseif ($currentUser->role === 'supervisor') {
                // Show users from supervisor's assigned branches
                $branchIds = $currentUser->cabangs()->pluck('cabangs.id');
                $usersQuery->whereHas('cabangs', function ($q) use ($branchIds) {
                    $q->whereIn('cabangs.id', $branchIds);
                });
            }
            // For super_user with no active branch, show all users (no additional filter)
        }

        $users = $usersQuery->orderBy('name')->get();

        return Inertia::render('users/index', [
            'users' => $users,
        ]);
    }

    public function create()
    {
        $this->authorize('create', User::class);

        $cabangs = Cabang::where('is_active', true)
            ->orderBy('nama_cabang')
            ->get();

        return Inertia::render('users/create', [
            'cabangs' => $cabangs,
            'config' => [
                'roles' => [
                    'super_user' => 'Super User',
                    'supervisor' => 'Supervisor',
                    'marketing' => 'Marketing',
                ],
            ],
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', User::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => 'required|in:super_user,supervisor,marketing',
            'is_active' => 'boolean',
            'cabang_ids' => 'array',
            'cabang_ids.*' => 'exists:cabangs,id',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'is_active' => $validated['is_active'] ?? true,
            'email_verified_at' => now(),
        ]);

        // Assign cabang relationships
        if (!empty($validated['cabang_ids'])) {
            $user->cabangs()->attach($validated['cabang_ids']);
        }

        return redirect()->route('users.index')
            ->with('success', 'User berhasil ditambahkan.');
    }

    public function show(User $user)
    {
        $this->authorize('view', $user);

        $user->load(['cabangs', 'leads', 'followUps']);

        $stats = [
            'total_leads' => $user->leads()->count(),
            'converted_leads' => $user->leads()->where('status', 'CONVERTED')->count(),
            'total_followups' => $user->followUps()->count(),
            'completed_followups' => $user->followUps()->where('status', 'completed')->count(),
        ];

        return Inertia::render('users/show', [
            'user' => $user,
            'stats' => $stats,
        ]);
    }

    public function edit(User $user)
    {
        $this->authorize('update', $user);

        $user->load('cabangs');
        
        $cabangs = Cabang::where('is_active', true)
            ->orderBy('nama_cabang')
            ->get();

        return Inertia::render('users/edit', [
            'user' => $user,
            'cabangs' => $cabangs,
            'config' => [
                'roles' => [
                    'super_user' => 'Super User',
                    'supervisor' => 'Supervisor',
                    'marketing' => 'Marketing',
                ],
            ],
        ]);
    }

    public function update(Request $request, User $user)
    {
        $this->authorize('update', $user);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => ['nullable', 'confirmed', Password::defaults()],
            'role' => 'required|in:super_user,supervisor,marketing',
            'is_active' => 'boolean',
            'cabang_ids' => 'array',
            'cabang_ids.*' => 'exists:cabangs,id',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'is_active' => $validated['is_active'] ?? true,
        ];

        // Only update password if provided
        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);

        // Sync cabang relationships
        $user->cabangs()->sync($validated['cabang_ids'] ?? []);

        return redirect()->route('users.index')
            ->with('success', 'User berhasil diperbarui.');
    }

    public function destroy(User $user)
    {
        $this->authorize('delete', $user);

        // Prevent deleting yourself
        if ($user->id === auth()->id()) {
            return back()->with('error', 'Anda tidak dapat menghapus akun sendiri.');
        }

        // Check if user has active leads
        $activeLeadsCount = $user->leads()->whereIn('status', ['NEW', 'QUALIFIED', 'WARM', 'HOT'])->count();
        
        if ($activeLeadsCount > 0) {
            return back()->with('error', 'Tidak dapat menghapus user yang masih memiliki leads aktif.');
        }

        // Detach all cabang relationships
        $user->cabangs()->detach();
        
        $user->delete();

        return redirect()->route('users.index')
            ->with('success', 'User berhasil dihapus.');
    }
}