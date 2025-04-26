<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserRoleController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


// User and Profile routes
Route::middleware(['auth'])->group(function () {
    // Role selection routes
    Route::get('/role-selection', [UserRoleController::class, 'showRoleSelection'])
        ->name('role.selection');
    Route::post('/user/assign-role', [UserRoleController::class, 'assignRole'])
        ->name('user.assign.role')
        ->middleware(['auth', 'web']);
        
    // Profile completion routes
    Route::get('/profile-completion', [UserRoleController::class, 'showProfileCompletion'])
        ->name('profile.completion')
        ->middleware(['auth', 'web']);
    Route::post('/profile-completion', [UserRoleController::class, 'saveProfileCompletion'])
        ->name('profile.completion.save')
        ->middleware(['auth', 'web']);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
