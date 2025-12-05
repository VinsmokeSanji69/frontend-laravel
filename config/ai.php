<?php

return [
    'flask_url' => env('FLASK_AI_URL', 'http://localhost:5000'),
    'max_pdf_size' => 10240, // in KB
    'default_num_questions' => 5,
    'default_difficulty' => 'medium',
    'default_type' => 'multiple-choice',
];

