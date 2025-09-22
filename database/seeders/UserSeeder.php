<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Super User
        User::create([
            'name' => 'Administrator',
            'email' => 'admin@leadsaladdin.com',
            'password' => Hash::make('password'),
            'role' => 'super_user',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Supervisor
        User::create([
            'name' => 'Supervisor Jakarta',
            'email' => 'supervisor@leadsaladdin.com',
            'password' => Hash::make('password'),
            'role' => 'supervisor',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Marketing Users
        $marketingUsers = [
            ['name' => 'Ahmad Rivaldi', 'email' => 'ahmad@leadsaladdin.com'],
            ['name' => 'Siti Nurhaliza', 'email' => 'siti@leadsaladdin.com'],
            ['name' => 'Budi Santoso', 'email' => 'budi@leadsaladdin.com'],
            ['name' => 'Dewi Anggraeni', 'email' => 'dewi@leadsaladdin.com'],
            ['name' => 'Rizki Pratama', 'email' => 'rizki@leadsaladdin.com'],
        ];

        foreach ($marketingUsers as $user) {
            User::create([
                'name' => $user['name'],
                'email' => $user['email'],
                'password' => Hash::make('password'),
                'role' => 'marketing',
                'is_active' => true,
                'email_verified_at' => now(),
            ]);
        }
    }
}