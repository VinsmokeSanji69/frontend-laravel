<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\PublishController;

// Home / Landing Page - Shows all exams
Route::get('/', [ExamController::class, 'index'])
    ->name('home');

// Authentication Routes
Route::middleware('guest')->group(function () {
    // Login routes
    Route::get('/login', [UserController::class, 'login'])->name('login');
    Route::post('/login', [UserController::class, 'loginStore'])->name('login.store');

    // Signup routes
    Route::get('/signup', [UserController::class, 'signup'])->name('signup');
    Route::post('/signup', [UserController::class, 'signupStore'])->name('signup.store');
});

// Logout route
Route::post('/logout', [UserController::class, 'logout'])
    ->middleware('auth')
    ->name('logout');

// Exam Generator Routes - PROTECTED WITH AUTH
Route::prefix('exam-generator')->middleware('auth')->group(function () {
    // Dashboard - List all exams
    Route::get('/', [ExamController::class, 'index'])
        ->name('exam.index');

    // Show generate form (GET)
    Route::get('/generate', [ExamController::class, 'generate'])
        ->name('exam.generate-form');

    // Handle generation (POST) - THIS IS THE KEY ROUTE
    Route::post('/generate', [ExamController::class, 'generate'])
        ->name('exam.generate');

    Route::get('/generating', [ExamController::class, 'generating'])
        ->name('exam.generating-screen');

    // View generated exam
    Route::get('/view/{id}', [QuestionController::class, 'index'])
        ->name('exam.view');

    // Export generated exam (PDF / Word / etc.)
    Route::get('/export/{examId}', [ExamController::class, 'export'])
        ->name('exam.export');

    // Publish exam - Generate PDF
    Route::get('/publish/{examId}', [PublishController::class, 'generatePdf'])
        ->name('exam.publish');

    // Generate Answer Key PDF
    Route::get('/answer-key/{examId}', [PublishController::class, 'generateAnswerKey'])
        ->name('exam.answer-key');
});

// routes/web.php
Route::get('/exam-library', [ExamController::class, 'library'])->name('exam.library');

// Update exam title - PROTECTED
Route::patch('/exam/{id}/update-title', [ExamController::class, 'updateTitle'])
    ->middleware('auth')
    ->name('exam.updateTitle');

// Question Management Routes - PROTECTED
Route::prefix('questions')->middleware('auth')->group(function () {
    // Update a question
    Route::put('/{id}', [QuestionController::class, 'update'])
        ->name('question.update');

    // Delete a question
    Route::delete('/{id}', [QuestionController::class, 'destroy'])
        ->name('question.destroy');
});

Route::post('/_boost/browser-logs', function (Request $request) {
    return response()->json(['ok' => true], 200);
});

// Debug route
Route::get('/debug-vite', function () {
    $buildPath = public_path('build');
    $manifestPath = public_path('build/manifest.json');

    return response()->json([
        'public_path' => public_path(),
        'build_path' => $buildPath,
        'build_exists' => is_dir($buildPath),
        'manifest_path' => $manifestPath,
        'manifest_exists' => file_exists($manifestPath),
        'build_contents' => is_dir($buildPath) ? scandir($buildPath) : 'Directory does not exist',
        'manifest_content' => file_exists($manifestPath) ? file_get_contents($manifestPath) : 'File does not exist',
    ]);
});
