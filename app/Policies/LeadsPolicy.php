<?php

namespace App\Policies;

use App\Models\Leads;
use App\Models\User;

class LeadsPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->is_active && in_array($user->role, ['super_user', 'supervisor', 'marketing']);
    }

    public function view(User $user, Leads $leads): bool
    {
        if (!$user->is_active) {
            return false;
        }

        // Super user can view all leads
        if ($user->isSuperUser()) {
            return true;
        }

        // Supervisor can view leads from their assigned branches
        if ($user->isSupervisor()) {
            return $user->cabangs()->where('user_cabangs.cabang_id', $leads->cabang_id)->exists();
        }

        // Marketing can only view their own leads
        if ($user->isMarketing()) {
            return $leads->user_id === $user->id;
        }

        return false;
    }

    public function create(User $user): bool
    {
        return $user->is_active && ($user->isMarketing() || $user->isSuperUser());
    }

    public function update(User $user, Leads $leads): bool
    {
        if (!$user->is_active) {
            return false;
        }

        // Super user can update all leads
        if ($user->isSuperUser()) {
            return true;
        }

        // Marketing can only update their own leads
        if ($user->isMarketing()) {
            return $leads->user_id === $user->id;
        }

        return false;
    }

    public function delete(User $user, Leads $leads): bool
    {
        return $user->is_active && $user->isSuperUser();
    }

    public function viewReports(User $user): bool
    {
        return $user->is_active && in_array($user->role, ['super_user', 'supervisor']);
    }

    public function viewAllBranches(User $user): bool
    {
        return $user->is_active && $user->isSuperUser();
    }
}
