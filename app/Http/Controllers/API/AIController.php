<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIController extends Controller
{
    private $flaskUrl;

    public function __construct()
    {
        $this->flaskUrl = env('FLASK_AI_URL', 'http://localhost:5000');
    }

    /**
     * Upload PDF and generate questions with customizable difficulty per question type
     */
    public function uploadPdfAndGenerate(Request $request)
    {
        // Increase PHP execution time for AI processing
        set_time_limit(300);
        ini_set('max_execution_time', '300');

        $request->validate([
            'file' => 'nullable|mimes:pdf|max:10240',
            'topic' => 'nullable|string|max:255',
            'question_types' => 'required|array|min:1',
            'question_types.*.type' => 'required|in:multiple-choice,true-false,identification',
            'question_types.*.difficulties' => 'required|array',
            'question_types.*.difficulties.easy' => 'required|integer|min:0',
            'question_types.*.difficulties.moderate' => 'required|integer|min:0',
            'question_types.*.difficulties.hard' => 'required|integer|min:0',
        ]);

        // Ensure either file or topic is provided
        if (!$request->hasFile('file') && !$request->filled('topic')) {
            return response()->json([
                'error' => 'Please provide either a PDF file or a topic.'
            ], 422);
        }

        try {
            $content = null;
            $extractedTopic = null;
            $sourceFile = null;
            $sourcePages = null;

            // ===== STEP 1: Get content (either from PDF or topic) =====
            if ($request->hasFile('file')) {
                Log::info('API: Step 1 - Extracting PDF content');

                // FIX: Added withoutVerifying()
                $pdfResponse = Http::withoutVerifying()
                    ->timeout(60)
                    ->attach(
                        'file',
                        file_get_contents($request->file('file')->path()),
                        $request->file('file')->getClientOriginalName()
                    )
                    ->post("{$this->flaskUrl}/api/ai/extract-pdf");

                if (!$pdfResponse->successful()) {
                    $apiError = $pdfResponse->json()['error'] ?? 'Failed to extract PDF content.';
                    Log::error('API: PDF extraction failed', ['response' => $pdfResponse->json()]);
                    return response()->json([
                        'error' => $apiError,
                        'details' => $pdfResponse->json()
                    ], 500);
                }

                $pdfData = $pdfResponse->json();
                $content = $pdfData['content'];
                $sourceFile = $request->file('file')->getClientOriginalName();
                $sourcePages = $pdfData['pages'] ?? null;

                Log::info('API: PDF extracted', [
                    'pages' => $pdfData['pages'],
                    'chars' => strlen($content)
                ]);

                // Analyze topic from PDF content
                Log::info('API: Step 2 - Analyzing topic from PDF content');

                // FIX: Added withoutVerifying()
                $topicResponse = Http::withoutVerifying()
                    ->timeout(90)
                    ->withHeaders(['Accept' => 'application/json'])
                    ->post("{$this->flaskUrl}/api/ai/analyze-topic", [
                        'content' => $content
                    ]);

                if ($topicResponse->successful()) {
                    $topicData = $topicResponse->json();
                    $extractedTopic = $topicData['topic'];
                    Log::info('API: Topic extracted', ['topic' => $extractedTopic]);
                } else {
                    Log::warning('API: Topic analysis failed, using filename');
                    $extractedTopic = pathinfo($sourceFile, PATHINFO_FILENAME);
                }
            } else {
                // User provided topic directly
                $extractedTopic = $request->topic;
                $content = $request->topic;
                Log::info('API: Using user-provided topic', ['topic' => $extractedTopic]);
            }

            // ===== STEP 2: Process question types and difficulties =====
            $difficultyMap = [
                'easy' => 'easy',
                'moderate' => 'medium',
                'hard' => 'hard'
            ];

            // Build question requests
            $questionRequests = [];
            foreach ($request->question_types as $qtData) {
                foreach ($qtData['difficulties'] as $difficulty => $count) {
                    if ($count > 0) {
                        $questionRequests[] = [
                            'type' => $qtData['type'],
                            'difficulty' => $difficultyMap[$difficulty] ?? 'medium',
                            'count' => (int)$count
                        ];
                    }
                }
            }

            if (empty($questionRequests)) {
                return response()->json([
                    'error' => 'Please specify at least one question with a difficulty level.'
                ], 422);
            }

            // ===== STEP 3: Generate questions =====
            Log::info('API: Step 3 - Generating questions', ['requests' => $questionRequests]);

            $allQuestions = [];

            foreach ($questionRequests as $qRequest) {
                Log::info("API: Generating {$qRequest['count']} {$qRequest['type']} questions at {$qRequest['difficulty']} difficulty");

                try {
                    // FIX: Added withoutVerifying()
                    $questionsResponse = Http::withoutVerifying()
                        ->timeout(120)
                        ->post("{$this->flaskUrl}/api/ai/generate-questions", [
                            'content' => $content,
                            'num_questions' => $qRequest['count'],
                            'difficulty' => $qRequest['difficulty'],
                            'type' => $qRequest['type']
                        ]);

                    if ($questionsResponse->successful()) {
                        $data = $questionsResponse->json();

                        if (isset($data['questions']) && count($data['questions']) > 0) {
                            foreach ($data['questions'] as &$question) {
                                $question['type'] = $qRequest['type'];
                                $question['difficulty'] = $qRequest['difficulty'];
                            }

                            $generatedCount = count($data['questions']);
                            $allQuestions = array_merge($allQuestions, $data['questions']);

                            Log::info("API: Successfully generated {$generatedCount} questions");
                        } else {
                            Log::warning("API: Question generation returned empty", ['request' => $qRequest]);
                        }
                    } else {
                        $errorData = $questionsResponse->json();
                        Log::error("API: Question generation failed", ['error' => $errorData, 'request' => $qRequest]);
                    }

                } catch (\Exception $e) {
                    Log::error("API: Exception while generating questions: " . $e->getMessage());
                }
            }

            if (empty($allQuestions)) {
                return response()->json([
                    'error' => 'Failed to generate questions. Please try again.'
                ], 500);
            }

            Log::info('API: Total questions generated', ['count' => count($allQuestions)]);

            // Return success response
            return response()->json([
                'success' => true,
                'questions' => $allQuestions,
                'count' => count($allQuestions),
                'topic' => $extractedTopic,
                'source_file' => $sourceFile,
                'source_pages' => $sourcePages,
                'generation_method' => $request->hasFile('file') ? 'pdf' : 'topic',
                'question_types_config' => $request->question_types
            ]);

        } catch (\Exception $e) {
            Log::error('API: Question generation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'AI processing failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate questions from text content with difficulty customization
     */
    public function generateFromText(Request $request)
    {
        // Increase PHP execution time
        set_time_limit(180);

        $request->validate([
            'content' => 'nullable|string',
            'topic' => 'nullable|string|max:255',
            'question_types' => 'required|array|min:1',
            'question_types.*.type' => 'required|in:multiple-choice,true-false,identification',
            'question_types.*.difficulties' => 'required|array',
            'question_types.*.difficulties.easy' => 'required|integer|min:0',
            'question_types.*.difficulties.moderate' => 'required|integer|min:0',
            'question_types.*.difficulties.hard' => 'required|integer|min:0',
        ]);

        // Ensure either content or topic is provided
        if (!$request->filled('content') && !$request->filled('topic')) {
            return response()->json([
                'error' => 'Please provide either content or a topic.'
            ], 422);
        }

        try {
            $extractedTopic = null;
            $content = $request->content ?? $request->topic;

            // If we have content, analyze the topic
            if ($request->filled('content') && strlen($request->content) > 50) {
                Log::info('API: Analyzing topic from text content');

                // FIX: Added withoutVerifying()
                $topicResponse = Http::withoutVerifying()
                    ->timeout(60)
                    ->post("{$this->flaskUrl}/api/ai/analyze-topic", [
                        'content' => $request->content
                    ]);

                if ($topicResponse->successful()) {
                    $extractedTopic = $topicResponse->json()['topic'];
                    Log::info('API: Topic extracted', ['topic' => $extractedTopic]);
                } else {
                    Log::warning('API: Topic analysis failed, using provided topic or first 100 chars');
                    $extractedTopic = $request->topic ?? substr($request->content, 0, 100);
                }
            } else {
                $extractedTopic = $request->topic;
            }

            // Process question types and difficulties
            $difficultyMap = [
                'easy' => 'easy',
                'moderate' => 'medium',
                'hard' => 'hard'
            ];

            $questionRequests = [];
            foreach ($request->question_types as $qtData) {
                foreach ($qtData['difficulties'] as $difficulty => $count) {
                    if ($count > 0) {
                        $questionRequests[] = [
                            'type' => $qtData['type'],
                            'difficulty' => $difficultyMap[$difficulty] ?? 'medium',
                            'count' => (int)$count
                        ];
                    }
                }
            }

            if (empty($questionRequests)) {
                return response()->json([
                    'error' => 'Please specify at least one question with a difficulty level.'
                ], 422);
            }

            // Generate questions
            Log::info('API: Generating questions from text', ['requests' => $questionRequests]);

            $allQuestions = [];

            foreach ($questionRequests as $qRequest) {
                try {
                    // FIX: Added withoutVerifying()
                    $questionsResponse = Http::withoutVerifying()
                        ->timeout(120)
                        ->post("{$this->flaskUrl}/api/ai/generate-questions", [
                            'content' => $content,
                            'num_questions' => $qRequest['count'],
                            'difficulty' => $qRequest['difficulty'],
                            'type' => $qRequest['type']
                        ]);

                    if ($questionsResponse->successful()) {
                        $data = $questionsResponse->json();

                        if (isset($data['questions']) && count($data['questions']) > 0) {
                            foreach ($data['questions'] as &$question) {
                                $question['type'] = $qRequest['type'];
                                $question['difficulty'] = $qRequest['difficulty'];
                            }

                            $allQuestions = array_merge($allQuestions, $data['questions']);
                        }
                    }

                } catch (\Exception $e) {
                    Log::error("API: Exception while generating questions: " . $e->getMessage());
                }
            }

            if (empty($allQuestions)) {
                return response()->json([
                    'error' => 'Failed to generate questions. Please try again.'
                ], 500);
            }

            return response()->json([
                'success' => true,
                'questions' => $allQuestions,
                'count' => count($allQuestions),
                'topic' => $extractedTopic,
                'generation_method' => 'text'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'AI processing failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Evaluate question difficulty
     */
    public function evaluateDifficulty(Request $request)
    {
        $request->validate([
            'question' => 'required|string',
            'options' => 'nullable|array'
        ]);

        try {
            // FIX: Added withoutVerifying()
            $response = Http::withoutVerifying()
                ->timeout(30)
                ->post("{$this->flaskUrl}/api/ai/evaluate-difficulty", [
                    'question' => $request->question,
                    'options' => $request->options ?? []
                ]);

            if (!$response->successful()) {
                return response()->json([
                    'error' => 'Difficulty evaluation failed',
                    'details' => $response->json()
                ], 500);
            }

            return response()->json($response->json());

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Evaluation failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Improve question quality
     */
    public function improveQuestion(Request $request)
    {
        $request->validate([
            'question' => 'required|string',
            'question_type' => 'nullable|in:multiple-choice,true-false,identification',
            'target_difficulty' => 'nullable|in:easy,medium,hard'
        ]);

        try {
            // FIX: Added withoutVerifying()
            $response = Http::withoutVerifying()
                ->timeout(30)
                ->post("{$this->flaskUrl}/api/ai/improve-question", [
                    'question' => $request->question,
                    'question_type' => $request->question_type,
                    'target_difficulty' => $request->target_difficulty
                ]);

            if (!$response->successful()) {
                return response()->json([
                    'error' => 'Question improvement failed',
                    'details' => $response->json()
                ], 500);
            }

            return response()->json($response->json());

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Improvement failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Analyze topic from content
     */
    public function analyzeTopic(Request $request)
    {
        $request->validate([
            'content' => 'required|string|min:50'
        ]);

        try {
            // FIX: Added withoutVerifying()
            $response = Http::withoutVerifying()
                ->timeout(60)
                ->post("{$this->flaskUrl}/api/ai/analyze-topic", [
                    'content' => $request->content
                ]);

            if (!$response->successful()) {
                return response()->json([
                    'error' => 'Topic analysis failed',
                    'details' => $response->json()
                ], 500);
            }

            return response()->json($response->json());

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Topic analysis failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Extract PDF content
     */
    public function extractPdf(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:pdf|max:10240'
        ]);

        try {
            // FIX: Added withoutVerifying()
            $response = Http::withoutVerifying()
                ->timeout(60)
                ->attach(
                    'file',
                    file_get_contents($request->file('file')->path()),
                    $request->file('file')->getClientOriginalName()
                )
                ->post("{$this->flaskUrl}/api/ai/extract-pdf");

            if (!$response->successful()) {
                return response()->json([
                    'error' => 'PDF extraction failed',
                    'details' => $response->json()
                ], 500);
            }

            return response()->json($response->json());

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'PDF extraction failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
