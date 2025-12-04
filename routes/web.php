<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\PublishController;

// Home / Landing Page - Shows all exams
Route::get('/', [ExamController::class, 'index'])
    ->name('home');


// Exam Generator Routes
Route::prefix('exam-generator')->group(function () {
    Route::get('/login', [UserController::class, 'login'])
        ->name('user.login');

    Route::get('/signup', [UserController::class, 'signup'])
        ->name('user.signup');

    // Dashboard - List all exams
    Route::get('/', [ExamController::class, 'index'])
        ->name('exam.index');

    // Show generate form (GET) & Handle generation (POST)
    Route::get('/generate', [ExamController::class, 'generate'])
        ->name('exam.generate-form');

    Route::post('/generate', [ExamController::class, 'generate'])
        ->name('exam.generate-exam');

    Route::get('/generating', [ExamController::class, 'generating'])
        ->name('exam.generating-screen');

    // View generated exam - NOW USES QuestionController
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

// Update exam title - MOVED OUTSIDE exam-generator prefix
Route::patch('/exam/{id}/update-title', [ExamController::class, 'updateTitle'])
    ->name('exam.updateTitle');

// Question Management Routes
Route::prefix('questions')->group(function () {
    // Update a question
    Route::put('/{id}', [QuestionController::class, 'update'])
        ->name('question.update');

    // Delete a question
    Route::delete('/{id}', [QuestionController::class, 'destroy'])
        ->name('question.destroy');
});
