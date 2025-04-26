<?php

use App\Http\Controllers\AIModelController;
use App\Http\Controllers\ProfileController;
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

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // AI Model routes
    Route::get('/ai-model', [AIModelController::class, 'index'])->name('ai-model.index');
    Route::post('/ai-model/predict', [AIModelController::class, 'predict'])->name('ai-model.predict');
    Route::get('/ai-model/recommend-event', [AIModelController::class, 'showRecommendEvent'])->name('ai-model.recommend-event.show');
    Route::post('/ai-model/recommend-event', [AIModelController::class, 'recommendEvent'])->name('ai-model.recommend-event');
});

require __DIR__.'/auth.php';
