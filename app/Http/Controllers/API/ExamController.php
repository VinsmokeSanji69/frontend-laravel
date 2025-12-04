<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ExamController extends Controller
{
    private $flaskUrl;

    public function __construct()
    {
        $this->flaskUrl = env('FLASK_AI_URL', 'http://localhost:5000');
    }

    public function index()
    {
        return Inertia::render('ExamGenerator/Index');
    }

    public function generate(Request $request)
    {
        if ($request->isMethod('get')) {
            return Inertia::render('ExamGenerator/Generate');
        }

        $request->validate([
            'file' => 'required|mimes:pdf|max:10240',
            'difficulty' => 'required|in:easy,moderate,hard',
            'question_types' => 'required|array|min:1',
            'question_types.*' => 'in:multipleChoice,trueOrFalse,identification',
            'num_questions' => 'integer|min:1|max:50'
        ]);

        try {
            // Map frontend difficulty to backend
            $difficultyMap = [
                'easy' => 'easy',
                'moderate' => 'medium',
                'hard' => 'hard'
            ];

            // Map frontend question types to backend
            $typeMap = [
                'multipleChoice' => 'multiple-choice',
                'trueOrFalse' => 'true-false',
                'identification' => 'short-answer'
            ];

            $selectedTypes = array_map(function($type) use ($typeMap) {
                return $typeMap[$type] ?? 'multiple-choice';
            }, $request->question_types);

            // Step 1: Extract PDF content
            $pdfResponse = Http::timeout(30)
                ->attach(
                    'file',
                    file_get_contents($request->file('file')->path()),
                    $request->file('file')->getClientOriginalName()
                )
                ->post("{$this->flaskUrl}/api/ai/extract-pdf");

            if (!$pdfResponse->successful()) {
                Log::error('PDF extraction failed', ['response' => $pdfResponse->json()]);
                return back()->with('error', 'Failed to extract PDF content. Please try again.');
            }

            $pdfData = $pdfResponse->json();
            $content = $pdfData['content'];

            // Step 2: Generate questions for each type
            $allQuestions = [];
            $questionsPerType = ceil(($request->num_questions ?? 10) / count($selectedTypes));

            foreach ($selectedTypes as $type) {
                $questionsResponse = Http::timeout(60)
                    ->post("{$this->flaskUrl}/api/ai/generate-questions", [
                        'content' => $content,
                        'num_questions' => $questionsPerType,
                        'difficulty' => $difficultyMap[$request->difficulty],
                        'type' => $type
                    ]);

                if ($questionsResponse->successful()) {
                    $data = $questionsResponse->json();
                    if (isset($data['questions'])) {
                        $allQuestions = array_merge($allQuestions, $data['questions']);
                    }
                }
            }

            if (empty($allQuestions)) {
                return back()->with('error', 'Failed to generate questions. Please try again.');
            }

            // Step 3: Save to database
            $exam = Exam::create([
                'title' => 'Generated Exam - ' . now()->format('Y-m-d H:i'),
                'description' => "Generated from {$request->file('file')->getClientOriginalName()}",
                'total_questions' => count($allQuestions),
                'settings' => [
                    'difficulty' => $request->difficulty,
                    'question_types' => $request->question_types,
                    'source_file' => $request->file('file')->getClientOriginalName(),
                    'source_pages' => $pdfData['pages'] ?? null
                ]
            ]);

            // Save questions
            foreach ($allQuestions as $index => $q) {
                Question::create([
                    'exam_id' => $exam->id,
                    'question_text' => $q['question'],
                    'question_type' => $this->mapQuestionType($q),
                    'options' => json_encode($q['options'] ?? []),
                    'correct_answer' => $q['correct_answer'],
                    'explanation' => $q['explanation'] ?? null,
                    'order' => $index + 1,
                    'points' => 1
                ]);
            }

            return redirect()->route('exam.view', ['id' => $exam->id])
                ->with('success', "Successfully generated {$exam->total_questions} questions!");

        } catch (\Exception $e) {
            Log::error('Exam generation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->with('error', 'Failed to generate exam: ' . $e->getMessage());
        }
    }

    public function view($id)
    {
        $exam = Exam::with('questions')->findOrFail($id);

        return Inertia::render('ExamGenerator/View', [
            'exam' => $exam
        ]);
    }

    public function export($examId)
    {
        $exam = Exam::with('questions')->findOrFail($examId);

        // TODO: Implement export functionality (PDF/Word)
        return response()->json([
            'message' => 'Export functionality coming soon',
            'exam' => $exam
        ]);
    }

    private function mapQuestionType($question)
    {
        if (isset($question['options'])) {
            $optionCount = count($question['options']);
            if ($optionCount === 2 &&
                (in_array('True', $question['options']) || in_array('true', $question['options']))) {
                return 'true-false';
            }
            if ($optionCount > 2) {
                return 'multiple-choice';
            }
        }
        return 'short-answer';
    }
}
