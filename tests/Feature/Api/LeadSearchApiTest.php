<?php

use App\Models\Cabang;
use App\Models\Leads;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

it('requires authentication for lead search', function () {
    $response = $this->getJson('/api/v1/leads/search?phone=8123');

    $response->assertStatus(401)
        ->assertJson(['message' => 'Unauthenticated.']);
});

it('requires phone parameter for search', function () {
    $user = User::factory()->create(['role' => 'super_user']);
    Sanctum::actingAs($user);

    $response = $this->getJson('/api/v1/leads/search');

    $response->assertStatus(422)
        ->assertJson([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => [
                'phone' => ['Phone number parameter is required']
            ]
        ]);
});

it('searches leads by phone number successfully', function () {
    $cabang = Cabang::factory()->create();
    $user = User::factory()->create(['role' => 'super_user']);
    $user->cabangs()->attach($cabang->id, ['is_active' => true]);
    
    Sanctum::actingAs($user);
    
    // Create test leads
    $matchingLead = Leads::factory()->create([
        'no_whatsapp' => '628123456789',
        'nama_pelanggan' => 'Test User',
        'cabang_id' => $cabang->id,
        'user_id' => $user->id,
        'is_active' => true
    ]);
    
    Leads::factory()->create([
        'no_whatsapp' => '628999888777',
        'nama_pelanggan' => 'Other User',
        'cabang_id' => $cabang->id,
        'user_id' => $user->id,
        'is_active' => true
    ]);

    $response = $this->getJson('/api/v1/leads/search?phone=8123');

    $response->assertStatus(200)
        ->assertJson([
            'success' => true,
            'meta' => [
                'total' => 1,
                'limit' => 20,
                'offset' => 0,
                'phone_search' => '8123'
            ]
        ])
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.id', $matchingLead->id)
        ->assertJsonPath('data.0.nama_pelanggan', 'Test User');
});

it('excludes inactive leads from search results', function () {
    $cabang = Cabang::factory()->create();
    $user = User::factory()->create(['role' => 'super_user']);
    $user->cabangs()->attach($cabang->id, ['is_active' => true]);
    
    Sanctum::actingAs($user);
    
    // Create active lead
    $activeLead = Leads::factory()->create([
        'no_whatsapp' => '628123456789',
        'cabang_id' => $cabang->id,
        'user_id' => $user->id,
        'is_active' => true
    ]);
    
    // Create inactive lead
    Leads::factory()->create([
        'no_whatsapp' => '628123456799',
        'cabang_id' => $cabang->id,
        'user_id' => $user->id,
        'is_active' => false
    ]);

    $response = $this->getJson('/api/v1/leads/search?phone=8123');

    $response->assertStatus(200)
        ->assertJson([
            'success' => true,
            'meta' => ['total' => 1]
        ])
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.id', $activeLead->id);
});
