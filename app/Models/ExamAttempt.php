<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamAttempt extends Model
{
    use HasFactory;

    protected $fillable = [
        'exam_id',
        'taker_name',
        'answers',
        'score',
        'total_points',
        'started_at',
        'submitted_at'
    ];

    protected $casts = [
        'answers' => 'array',
        'started_at' => 'datetime',
        'submitted_at' => 'datetime'
    ];

    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }
}
