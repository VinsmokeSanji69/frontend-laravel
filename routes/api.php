<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AIController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// AI Quiz Generation Routes
Route::prefix('ai')->group(function () {
    // Upload PDF and generate questions (now uses topic-based approach)
    Route::post('/generate-from-pdf', [AIController::class, 'uploadPdfAndGenerate']);

    // Generate from text content (now uses topic-based approach)
    Route::post('/generate-from-text', [AIController::class, 'generateFromText']);

    // NEW: Analyze and extract main topic from content
    Route::post('/analyze-topic', [AIController::class, 'analyzeTopic']);

    // Evaluate question difficulty
    Route::post('/evaluate-difficulty', [AIController::class, 'evaluateDifficulty']);

    // Improve question quality
    Route::post('/improve-question', [AIController::class, 'improveQuestion']);

    // Health check
    Route::get('/health', function () {
        return response()->json([
            'status' => 'ok',
            'flask_url' => env('FLASK_AI_URL', 'http://localhost:5000'),
            'method' => 'topic-based-generation',
            'token_optimized' => true
        ]);
    });
});
