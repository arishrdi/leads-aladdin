<?php

namespace App\Policies;

use App\Models\Cabang;
use App\Models\User;

class CabangPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->is_active && $user->isSuperUser();
    }

    public function view(User $user, Cabang $cabang): bool
    {
        if (!$user->is_active) {
            return false;
        }

        // Super user can view all branches
        if ($user->isSuperUser()) {
            return true;
        }

        // Supervisor and Marketing can view their assigned branches
        return $user->cabangs()->where('user_cabangs.cabang_id', $cabang->id)->exists();
    }

    public function create(User $user): bool
    {
        return $user->is_active && $user->isSuperUser();
    }

    public function update(User $user, Cabang $cabang): bool
    {
        return $user->is_active && $user->isSuperUser();
    }

    public function delete(User $user, Cabang $cabang): bool
    {
        return $user->is_active && $user->isSuperUser();
    }

    public function assignUsers(User $user): bool
    {
        return $user->is_active && $user->isSuperUser();
    }
}
