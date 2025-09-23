<?php

use App\Http\Controllers\Api\ApiLeadsController;
use Illuminate\Support\Facades\Route;

/**
 * API Routes for External Applications
 * 
 * All routes are prefixed with /api and require authentication via Laravel Sanctum.
 * Rate limiting: 100 requests per minute per token.
 */

Route::prefix('v1')->middleware(['auth:sanctum', 'throttle:100,1'])->group(function () {
    
    /**
     * Search leads by phone number (partial matching)
     * GET /api/v1/leads/search?phone=8899&limit=20&offset=0
     */
    Route::get('/leads/search', [ApiLeadsController::class, 'search'])
        ->name('api.leads.search');
    
    /**
     * Update lead status
     * PATCH /api/v1/leads/{id}/status
     * Body: { "status": "HOT", "notes": "Customer interested" }
     */
    Route::patch('/leads/{id}/status', [ApiLeadsController::class, 'updateStatus'])
        ->name('api.leads.update-status');
    
    /**
     * Get lead details by ID (bonus endpoint)
     * GET /api/v1/leads/{id}
     */
    Route::get('/leads/{id}', [ApiLeadsController::class, 'show'])
        ->name('api.leads.show');
    
    /**
     * Get API user info (authentication test endpoint)
     * GET /api/v1/user
     */
    Route::get('/user', function () {
        return response()->json([
            'success' => true,
            'data' => auth()->user(),
            'message' => 'Authenticated successfully'
        ]);
    })->name('api.user');
});

/**
 * Health check endpoint (no authentication required)
 * GET /api/health
 */
Route::get('/health', function () {
    return response()->json([
        'success' => true,
        'message' => 'API is healthy',
        'timestamp' => now()->toISOString(),
        'version' => '1.0.0'
    ]);
})->name('api.health');