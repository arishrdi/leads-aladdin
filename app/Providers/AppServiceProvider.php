<?php

namespace App\Providers;

use App\Models\Cabang;
use App\Models\Leads;
use App\Policies\CabangPolicy;
use App\Policies\LeadsPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Leads::class, LeadsPolicy::class);
        Gate::policy(Cabang::class, CabangPolicy::class);
    }
}
