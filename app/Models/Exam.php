<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Exam extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'share_code',
        'settings',
        'total_questions',
        'user_id'
    ];

    protected $casts = [
        'settings' => 'array'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($exam) {
            if (empty($exam->share_code)) {
                $exam->share_code = Str::random(8);
            }
        });
    }

    // ADD THIS RELATIONSHIP
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function questions()
    {
        return $this->hasMany(Question::class)->orderBy('order');
    }

    public function attempts()
    {
        return $this->hasMany(ExamAttempt::class);
    }
}
