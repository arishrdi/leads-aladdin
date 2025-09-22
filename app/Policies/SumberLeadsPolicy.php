<?php

namespace App\Policies;

use App\Models\SumberLeads;
use App\Models\User;

class SumberLeadsPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->is_active && $user->isSuperUser();
    }

    public function view(User $user, SumberLeads $sumberLeads): bool
    {
        return $user->is_active && $user->isSuperUser();
    }

    public function create(User $user): bool
    {
        return $user->is_active && $user->isSuperUser();
    }

    public function update(User $user, SumberLeads $sumberLeads): bool
    {
        return $user->is_active && $user->isSuperUser();
    }

    public function delete(User $user, SumberLeads $sumberLeads): bool
    {
        return $user->is_active && $user->isSuperUser();
    }
}