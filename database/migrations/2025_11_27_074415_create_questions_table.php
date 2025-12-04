<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained()->onDelete('cascade');
            $table->text('question_text');
            $table->string('question_type'); // multiple-choice, true-false, short-answer
            $table->json('options')->nullable(); // For multiple choice options
            $table->text('correct_answer');
            $table->text('explanation')->nullable();
            $table->integer('order')->default(0);
            $table->integer('points')->default(1);
            $table->timestamps();

            $table->index(['exam_id', 'order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
