<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'exam_id',
        'question_text',
        'question_type',
        'difficulty',
        'options',
        'correct_answer',
        'explanation',
        'order',
        'points'
    ];

    protected $casts = [
        'options' => 'array',
        'order' => 'integer',
        'points' => 'integer'
    ];

    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }
}
