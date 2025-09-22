<?php

namespace App\Policies;

use App\Models\TipeKarpet;
use App\Models\User;

class TipeKarpetPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->is_active && $user->isSuperUser();
    }

    public function view(User $user, TipeKarpet $tipeKarpet): bool
    {
        return $user->is_active && $user->isSuperUser();
    }

    public function create(User $user): bool
    {
        return $user->is_active && $user->isSuperUser();
    }

    public function update(User $user, TipeKarpet $tipeKarpet): bool
    {
        return $user->is_active && $user->isSuperUser();
    }

    public function delete(User $user, TipeKarpet $tipeKarpet): bool
    {
        return $user->is_active && $user->isSuperUser();
    }
}