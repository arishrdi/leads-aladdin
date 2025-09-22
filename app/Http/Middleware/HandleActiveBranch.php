<?php

namespace App\Http\Middleware;

use App\Models\Cabang;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class HandleActiveBranch
{
    public function handle(Request $request, Closure $next)
    {
        $user = auth()->user();
        
        if (!$user) {
            return $next($request);
        }

        // Get active branch from request or session
        $activeBranchId = $request->get('active_branch') 
            ?? Session::get('active_branch_id');

        // Get available branches based on user role
        $availableBranches = $this->getAvailableBranches($user);
        
        // Validate and set active branch
        $activeBranch = null;
        if ($activeBranchId && $activeBranchId !== 'all') {
            $activeBranch = $availableBranches->firstWhere('id', $activeBranchId);
        }

        // Store active branch in session if provided in request
        if ($request->has('active_branch')) {
            if ($request->get('active_branch') === 'all') {
                Session::forget('active_branch_id');
            } else {
                Session::put('active_branch_id', $activeBranchId);
            }
        }

        // Share data with Inertia
        Inertia::share([
            'activeBranch' => $activeBranch,
            'availableBranches' => $availableBranches,
        ]);

        // Add active branch to request for controllers to use
        $request->merge(['active_branch_object' => $activeBranch]);

        return $next($request);
    }

    private function getAvailableBranches($user)
    {
        if ($user->role === 'super_user') {
            return Cabang::where('is_active', true)
                ->orderBy('nama_cabang')
                ->get(['id', 'nama_cabang']);
        }

        if ($user->role === 'supervisor') {
            return $user->cabangs()
                ->where('cabangs.is_active', true)
                ->orderBy('nama_cabang')
                ->get(['cabangs.id', 'nama_cabang']);
        }

        // Marketing users only have access to their assigned branches
        return $user->cabangs()
            ->where('cabangs.is_active', true)
            ->orderBy('nama_cabang')
            ->get(['cabangs.id', 'nama_cabang']);
    }
}