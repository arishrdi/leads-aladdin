<?php

use App\Models\Cabang;
use App\Models\Leads;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

it('requires authentication for status update', function () {
    $lead = Leads::factory()->create(['status' => 'WARM', 'is_active' => true]);
    
    $response = $this->patchJson('/api/v1/leads/' . $lead->id . '/status', [
        'status' => 'HOT'
    ]);

    $response->assertStatus(401)
        ->assertJson(['message' => 'Unauthenticated.']);
});

it('requires status field', function () {
    $cabang = Cabang::factory()->create();
    $user = User::factory()->create(['role' => 'super_user']);
    $user->cabangs()->attach($cabang->id, ['is_active' => true]);
    
    $lead = Leads::factory()->create([
        'status' => 'WARM',
        'cabang_id' => $cabang->id,
        'user_id' => $user->id,
        'is_active' => true
    ]);
    
    Sanctum::actingAs($user);

    $response = $this->patchJson('/api/v1/leads/' . $lead->id . '/status', []);

    $response->assertStatus(422)
        ->assertJson([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => [
                'status' => ['Status is required']
            ]
        ]);
});

it('validates status values', function () {
    $cabang = Cabang::factory()->create();
    $user = User::factory()->create(['role' => 'super_user']);
    $user->cabangs()->attach($cabang->id, ['is_active' => true]);
    
    $lead = Leads::factory()->create([
        'status' => 'WARM',
        'cabang_id' => $cabang->id,
        'user_id' => $user->id,
        'is_active' => true
    ]);
    
    Sanctum::actingAs($user);

    $response = $this->patchJson('/api/v1/leads/' . $lead->id . '/status', [
        'status' => 'INVALID_STATUS'
    ]);

    $response->assertStatus(422)
        ->assertJson([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => [
                'status' => ['Status must be one of: WARM, HOT, CUSTOMER, COLD, EXIT, CROSS_SELLING']
            ]
        ]);
});

it('updates lead status successfully', function () {
    $cabang = Cabang::factory()->create();
    $user = User::factory()->create(['role' => 'super_user']);
    $user->cabangs()->attach($cabang->id, ['is_active' => true]);
    
    $lead = Leads::factory()->create([
        'status' => 'WARM',
        'cabang_id' => $cabang->id,
        'user_id' => $user->id,
        'is_active' => true
    ]);
    
    Sanctum::actingAs($user);

    $response = $this->patchJson('/api/v1/leads/' . $lead->id . '/status', [
        'status' => 'HOT',
        'notes' => 'Customer showed interest'
    ]);

    $response->assertStatus(200)
        ->assertJson([
            'success' => true,
            'message' => 'Lead status updated from WARM to HOT',
            'changes' => [
                'old_status' => 'WARM',
                'new_status' => 'HOT',
                'updated_by' => $user->name
            ]
        ])
        ->assertJsonPath('data.status', 'HOT');

    // Verify database update
    $this->assertDatabaseHas('leads', [
        'id' => $lead->id,
        'status' => 'HOT'
    ]);
});

it('returns 404 for non-existent lead', function () {
    $user = User::factory()->create(['role' => 'super_user']);
    Sanctum::actingAs($user);

    $response = $this->patchJson('/api/v1/leads/99999/status', [
        'status' => 'HOT'
    ]);

    $response->assertStatus(404)
        ->assertJson([
            'success' => false,
            'message' => 'Lead not found'
        ]);
});

it('normalizes status to uppercase', function () {
    $cabang = Cabang::factory()->create();
    $user = User::factory()->create(['role' => 'super_user']);
    $user->cabangs()->attach($cabang->id, ['is_active' => true]);
    
    $lead = Leads::factory()->create([
        'status' => 'WARM',
        'cabang_id' => $cabang->id,
        'user_id' => $user->id,
        'is_active' => true
    ]);
    
    Sanctum::actingAs($user);

    $response = $this->patchJson('/api/v1/leads/' . $lead->id . '/status', [
        'status' => 'hot' // lowercase
    ]);

    $response->assertStatus(200)
        ->assertJsonPath('data.status', 'HOT');

    $this->assertDatabaseHas('leads', [
        'id' => $lead->id,
        'status' => 'HOT'
    ]);
});
