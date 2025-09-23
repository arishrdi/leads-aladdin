<?php

use App\Http\Controllers\CabangController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DokumenController;
use App\Http\Controllers\FollowUpController;
use App\Http\Controllers\LeadsController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SumberLeadsController;
use App\Http\Controllers\TipeKarpetController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    // return Inertia::render('welcome');
    return to_route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Leads Management
    Route::resource('leads', LeadsController::class);
    
    // Follow-ups Management
    Route::get('follow-ups', [FollowUpController::class, 'index'])->name('follow-ups.index');
    Route::get('follow-ups/excel-view', [FollowUpController::class, 'excelView'])->name('follow-ups.excel-view');
    Route::get('leads/{lead}/follow-ups/create', [FollowUpController::class, 'create'])->name('follow-ups.create');
    Route::post('leads/{lead}/follow-ups', [FollowUpController::class, 'store'])->name('follow-ups.store');
    Route::get('follow-ups/{followUp}', [FollowUpController::class, 'show'])->name('follow-ups.show');
    Route::patch('follow-ups/{followUp}/complete', [FollowUpController::class, 'complete'])->name('follow-ups.complete');
    Route::patch('follow-ups/{followUp}/reschedule', [FollowUpController::class, 'reschedule'])->name('follow-ups.reschedule');

    // Documents Management
    Route::get('dokumens', [DokumenController::class, 'allIndex'])->name('dokumens.all');
    Route::get('dokumens/create', [DokumenController::class, 'generalCreate'])->name('dokumens.general-create');
    Route::post('dokumens', [DokumenController::class, 'generalStore'])->name('dokumens.general-store');
    Route::get('leads/{lead}/dokumens', [DokumenController::class, 'index'])->name('dokumens.index');
    Route::get('leads/{lead}/dokumens/create', [DokumenController::class, 'create'])->name('dokumens.create');
    Route::post('leads/{lead}/dokumens', [DokumenController::class, 'store'])->name('dokumens.store');
    Route::get('dokumens/{dokumen}', [DokumenController::class, 'show'])->name('dokumens.show');
    Route::get('dokumens/{dokumen}/download', [DokumenController::class, 'download'])->name('dokumens.download');
    Route::delete('dokumens/{dokumen}', [DokumenController::class, 'destroy'])->name('dokumens.destroy');

    // Branch Management (Super User only)
    Route::resource('cabangs', CabangController::class);
    Route::post('cabangs/{cabang}/assign-users', [CabangController::class, 'assignUsers'])->name('cabangs.assign-users');

    // Reports & Analytics (Supervisor, Super User)
    Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('reports/export', [ReportController::class, 'export'])->name('reports.export');

    // Master Data Management (Super User only)
    Route::resource('users', UserController::class);
    Route::resource('sumber-leads', SumberLeadsController::class);
    Route::resource('tipe-karpets', TipeKarpetController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
