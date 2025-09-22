<?php

namespace App\Providers;

use App\Models\Cabang;
use App\Models\Leads;
use App\Models\SumberLeads;
use App\Models\TipeKarpet;
use App\Models\User;
use App\Policies\CabangPolicy;
use App\Policies\LeadsPolicy;
use App\Policies\SumberLeadsPolicy;
use App\Policies\TipeKarpetPolicy;
use App\Policies\UserPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Leads::class => LeadsPolicy::class,
        Cabang::class => CabangPolicy::class,
        User::class => UserPolicy::class,
        SumberLeads::class => SumberLeadsPolicy::class,
        TipeKarpet::class => TipeKarpetPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        //
    }
}