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
     * Upload PDF and generate questions using topic-based approach
     */
    public function uploadPdfAndGenerate(Request $request)
    {
        // Increase PHP execution time for AI processing
        set_time_limit(180); // 3 minutes

        $request->validate([
            'file' => 'required|mimes:pdf|max:10240',
            'num_questions' => 'integer|min:1|max:50',
            'difficulty' => 'in:easy,medium,hard',
            'type' => 'in:multiple-choice,true-false,short-answer'
        ]);

        try {
            // Step 1: Extract PDF text
            Log::info('Step 1: Extracting PDF');

            $pdfResponse = Http::timeout(60)->attach(
                'file',
                file_get_contents($request->file('file')->path()),
                $request->file('file')->getClientOriginalName()
            )->post("{$this->flaskUrl}/api/ai/extract-pdf");

            if (!$pdfResponse->successful()) {
                Log::error('PDF extraction failed', ['response' => $pdfResponse->json()]);
                return response()->json([
                    'error' => 'PDF extraction failed',
                    'details' => $pdfResponse->json()
                ], 500);
            }

            $content = $pdfResponse->json()['content'];
            Log::info('PDF extracted', ['chars' => strlen($content)]);

            // Step 2: Analyze topic from content
            Log::info('Step 2: Analyzing topic');

            $topicResponse = Http::timeout(60)->post("{$this->flaskUrl}/api/ai/analyze-topic", [
                'content' => $content
            ]);

            if (!$topicResponse->successful()) {
                Log::error('Topic analysis failed', ['response' => $topicResponse->json()]);
                return response()->json([
                    'error' => 'Topic analysis failed',
                    'details' => $topicResponse->json()
                ], 500);
            }

            $topic = $topicResponse->json()['topic'];
            Log::info('Topic extracted', ['topic' => $topic]);

            // Step 3: Generate questions from topic (not full content)
            Log::info('Step 3: Generating questions from topic');

            $questionsResponse = Http::timeout(90)->post("{$this->flaskUrl}/api/ai/generate-questions", [
                'topic' => $topic,  // Send topic instead of content
                'num_questions' => $request->num_questions ?? 5,
                'difficulty' => $request->difficulty ?? 'medium',
                'type' => $request->type ?? 'multiple-choice'
            ]);

            if (!$questionsResponse->successful()) {
                Log::error('Question generation failed', ['response' => $questionsResponse->json()]);
                return response()->json([
                    'error' => 'Question generation failed',
                    'details' => $questionsResponse->json()
                ], 500);
            }

            $data = $questionsResponse->json();

            return response()->json([
                'success' => true,
                'questions' => $data['questions'],
                'count' => $data['count'] ?? count($data['questions']),
                'topic' => $topic,
                'source_pages' => $pdfResponse->json()['pages'] ?? null
            ]);

        } catch (\Exception $e) {
            Log::error('AI processing failed', ['error' => $e->getMessage()]);
            return response()->json([
                'error' => 'AI processing failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate questions from text content
     */
    public function generateFromText(Request $request)
    {
        // Increase PHP execution time
        set_time_limit(180);

        $request->validate([
            'content' => 'required|string|min:50',
            'num_questions' => 'integer|min:1|max:50',
            'difficulty' => 'in:easy,medium,hard',
            'type' => 'in:multiple-choice,true-false,short-answer'
        ]);

        try {
            // Step 1: Analyze topic from content
            Log::info('Analyzing topic from text');

            $topicResponse = Http::timeout(60)->post("{$this->flaskUrl}/api/ai/analyze-topic", [
                'content' => $request->content
            ]);

            if (!$topicResponse->successful()) {
                Log::error('Topic analysis failed');
                // Fallback: use first 200 chars as topic
                $topic = substr($request->content, 0, 200);
            } else {
                $topic = $topicResponse->json()['topic'];
            }

            // Step 2: Generate questions from topic
            $response = Http::timeout(90)->post("{$this->flaskUrl}/api/ai/generate-questions", [
                'topic' => $topic,
                'num_questions' => $request->num_questions ?? 5,
                'difficulty' => $request->difficulty ?? 'medium',
                'type' => $request->type ?? 'multiple-choice'
            ]);

            if (!$response->successful()) {
                return response()->json([
                    'error' => 'Question generation failed',
                    'details' => $response->json()
                ], 500);
            }

            $data = $response->json();
            $data['topic'] = $topic;

            return response()->json($data);

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
            $response = Http::timeout(30)->post("{$this->flaskUrl}/api/ai/evaluate-difficulty", [
                'question' => $request->question,
                'options' => $request->options ?? []
            ]);

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
            'question' => 'required|string'
        ]);

        try {
            $response = Http::timeout(30)->post("{$this->flaskUrl}/api/ai/improve-question", [
                'question' => $request->question
            ]);

            return response()->json($response->json());

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Improvement failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Analyze topic from content (NEW ENDPOINT)
     */
    public function analyzeTopic(Request $request)
    {
        $request->validate([
            'content' => 'required|string|min:50'
        ]);

        try {
            $response = Http::timeout(30)->post("{$this->flaskUrl}/api/ai/analyze-topic", [
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
}
