<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AIModelController;

// AI Model API Routes - Public access
Route::post('/ai-model/predict', [AIModelController::class, 'predict'])
    ->name('api.ai-model.predict');

Route::post('/ai-model/recommend-event', [AIModelController::class, 'recommendEvent'])
    ->name('api.ai-model.recommend-event');

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

Route::apiResource('posts', PostController::class);