<?php

namespace App\Policies;

use App\Models\FollowUpStage;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class FollowUpStagePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->is_active && $user->isSuperUser();
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, FollowUpStage $followUpStage): bool
    {
        return $user->is_active && $user->isSuperUser();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->is_active && $user->isSuperUser();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, FollowUpStage $followUpStage): bool
    {
        return $user->is_active && $user->isSuperUser();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, FollowUpStage $followUpStage): bool
    {
        return $user->is_active && $user->isSuperUser();
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, FollowUpStage $followUpStage): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, FollowUpStage $followUpStage): bool
    {
        return false;
    }
}
