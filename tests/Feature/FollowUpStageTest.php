<?php

use App\Models\FollowUpStage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Run the follow up stage seeder
    $this->artisan('db:seed', ['--class' => 'FollowUpStageSeeder']);
});

it('can retrieve active stages from database', function () {
    $stages = FollowUpStage::getActiveStages();
    
    expect($stages)->toBeArray();
    expect($stages)->toHaveKey('greeting');
    expect($stages['greeting'])->toBe('Greeting');
});

it('can get stage progression', function () {
    $progression = FollowUpStage::getStageProgression();
    
    expect($progression)->toBeArray();
    expect($progression)->toHaveKey('greeting');
    expect($progression['greeting'])->toBe('impresi');
});

it('super user can access stage management', function () {
    $superUser = User::factory()->create([
        'role' => 'super_user',
        'is_active' => true
    ]);
    
    $response = $this->actingAs($superUser)->get('/follow-up-stages');
    
    $response->assertStatus(200);
});

it('non-super user cannot access stage management', function () {
    $marketingUser = User::factory()->create(['role' => 'marketing']);
    
    $response = $this->actingAs($marketingUser)->get('/follow-up-stages');
    
    $response->assertStatus(403);
});

it('can create new follow-up stage', function () {
    $superUser = User::factory()->create([
        'role' => 'super_user',
        'is_active' => true
    ]);
    
    $response = $this->actingAs($superUser)->post('/follow-up-stages', [
        'key' => 'test_stage',
        'name' => 'Test Stage',
        'next_stage_key' => 'greeting',
        'is_active' => true,
    ]);
    
    $response->assertRedirect('/follow-up-stages');
    
    $this->assertDatabaseHas('follow_up_stages', [
        'key' => 'test_stage',
        'name' => 'Test Stage',
    ]);
});

it('validates required fields when creating stage', function () {
    $superUser = User::factory()->create([
        'role' => 'super_user',
        'is_active' => true
    ]);
    
    $response = $this->actingAs($superUser)->post('/follow-up-stages', []);
    
    $response->assertSessionHasErrors(['key', 'name']);
});