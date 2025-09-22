<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Cabang;
use Illuminate\Database\Seeder;

class UserCabangSeeder extends Seeder
{
    public function run(): void
    {
        $marketingUsers = User::where('role', 'marketing')->get();
        $cabangs = Cabang::all();
        
        // Assign each marketing user to 1-2 branches
        foreach ($marketingUsers as $user) {
            $assignedCabangs = $cabangs->random(rand(1, 2));
            
            foreach ($assignedCabangs as $cabang) {
                $user->cabangs()->attach($cabang->id);
            }
        }
        
        // Assign supervisor to all branches
        $supervisor = User::where('role', 'supervisor')->first();
        if ($supervisor) {
            $supervisor->cabangs()->attach($cabangs->pluck('id'));
        }
    }
}