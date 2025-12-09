<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
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
        // Auth data is automatically shared via HandleInertiaRequests middleware
        return Inertia::render('landing-page');
    }

    public function generate(Request $request)
    {
        if ($request->isMethod('get')) {
            return Inertia::render('form/generate-exam-form', []);
        }

        // Increase PHP execution time for AI processing
        set_time_limit(300); // 5 minutes
        ini_set('max_execution_time', '300');

        // Handle POST - Generate exam
        $request->validate([
            'file' => 'required|mimes:pdf|max:10240',
            'difficulty' => 'required|in:easy,moderate,hard',
            'question_types' => 'required|array|min:1',
            'question_types.*' => 'in:multipleChoice,trueOrFalse,identification',
            'num_questions' => 'integer|min:1|max:50',
            'subject' => 'nullable|string|max:100'
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
                'identification' => 'identification'
            ];

            $selectedTypes = array_map(function($type) use ($typeMap) {
                return $typeMap[$type] ?? 'multiple-choice';
            }, $request->question_types);

            $questionsPerType = intval($request->num_questions ?? 10);

            // ===== STEP 1: Extract PDF content =====
            Log::info('Step 1: Extracting PDF content');

            $pdfResponse = Http::timeout(60)
                ->attach(
                    'file',
                    file_get_contents($request->file('file')->path()),
                    $request->file('file')->getClientOriginalName()
                )
                ->post("{$this->flaskUrl}/api/ai/extract-pdf");

            if (!$pdfResponse->successful()) {
                $apiError = $pdfResponse->json()['error'] ?? 'Failed to extract PDF content. Please try again.';

                Log::error('PDF extraction failed', ['response' => $pdfResponse->json()]);

                return redirect()->back()->withErrors([
                    'general' => $apiError
                ]);
            }

            $pdfData = $pdfResponse->json();
            $content = $pdfData['content'];

            Log::info('PDF extracted', [
                'pages' => $pdfData['pages'],
                'chars' => strlen($content)
            ]);

            // ===== STEP 2: Analyze topic from content =====
            Log::info('Step 2: Analyzing main topic from content');

            $topicResponse = Http::timeout(90)
                ->withHeaders(['Accept' => 'application/json'])
                ->post("{$this->flaskUrl}/api/ai/analyze-topic", [
                    'content' => $content
                ]);

            if (!$topicResponse->successful()) {
                Log::error('Topic analysis failed', ['response' => $topicResponse->json()]);
                return back()->with('error', 'Failed to analyze content topic. Please try again.');
            }

            $topicData = $topicResponse->json();
            $extractedTopic = $topicData['topic'];

            Log::info('Topic extracted', ['topic' => $extractedTopic]);

            // ===== STEP 3: Generate questions from FULL CONTENT =====
            Log::info('Step 3: Generating questions from full PDF content');

            $allQuestions = [];
            $totalQuestionsNeeded = count($selectedTypes) * $questionsPerType;

            foreach ($selectedTypes as $type) {
                Log::info("Generating {$questionsPerType} {$type} questions from full content");

                try {
                    $questionsResponse = Http::timeout(120)
                        ->post("{$this->flaskUrl}/api/ai/generate-questions", [
                            'content' => $content,
                            'num_questions' => $questionsPerType,
                            'difficulty' => $difficultyMap[$request->difficulty],
                            'type' => $type
                        ]);

                    if ($questionsResponse->successful()) {
                        $data = $questionsResponse->json();

                        if (isset($data['questions']) && count($data['questions']) > 0) {
                            foreach ($data['questions'] as &$question) {
                                $question['type'] = $type;
                            }

                            $generatedCount = count($data['questions']);
                            $allQuestions = array_merge($allQuestions, $data['questions']);

                            Log::info("Successfully generated {$generatedCount} {$type} questions");
                        } else {
                            Log::warning("Question generation returned empty for type {$type}");
                        }
                    } else {
                        $errorData = $questionsResponse->json();
                        Log::error("Question generation failed for type {$type}", ['error' => $errorData]);
                    }

                } catch (\Exception $e) {
                    Log::error("Exception while generating {$type} questions: " . $e->getMessage());
                }
            }

            if (empty($allQuestions)) {
                return back()->with('error', 'Failed to generate questions from the content. Please try again.');
            }

            Log::info('Total questions generated', ['count' => count($allQuestions)]);

            // ===== STEP 4: Save to database =====
            // CHANGED: Removed date from title
            $exam = Exam::create([
                'title' => $extractedTopic,
                'description' => "Generated from {$request->file('file')->getClientOriginalName()}",
                'total_questions' => count($allQuestions),
                'user_id' => Auth::id(), // Associate with logged-in user
                'settings' => [
                    'difficulty' => $request->difficulty,
                    'question_types' => $request->question_types,
                    'source_file' => $request->file('file')->getClientOriginalName(),
                    'source_pages' => $pdfData['pages'] ?? null,
                    'extracted_topic' => $extractedTopic,
                    'subject' => $request->subject ?? $extractedTopic
                ]
            ]);

            // Save questions
            foreach ($allQuestions as $index => $q) {
                Question::create([
                    'exam_id' => $exam->id,
                    'question_text' => $q['question'],
                    'question_type' => $q['type'],
                    'options' => json_encode($q['options'] ?? []),
                    'correct_answer' => $q['correct_answer'],
                    'explanation' => null,
                    'order' => $index + 1,
                    'points' => 1
                ]);
            }

            Log::info('Exam saved successfully', [
                'exam_id' => $exam->id,
                'topic' => $extractedTopic,
                'total_questions' => count($allQuestions)
            ]);

            return redirect()->route('exam.view', ['id' => $exam->id])
                ->with('success', "Successfully generated exam on topic: {$extractedTopic} ({$exam->total_questions} questions)");

        } catch (\Exception $e) {
            Log::error('Exam generation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->with('error', 'Failed to generate exam: ' . $e->getMessage());
        }
    }

    public function generating()
    {
        return Inertia::render('loader-screen', []);
    }

    public function view($id)
    {
        $exam = Exam::with('questions')->findOrFail($id);

        // Transform questions for components
        $transformedQuestions = [
            'multiple' => [],
            'trueOrFalse' => [],
            'identification' => []
        ];

        foreach ($exam->questions as $question) {
            $options = is_string($question->options)
                ? json_decode($question->options, true)
                : $question->options;

            $questionData = [
                'id' => $question->id,
                'question' => $question->question_text,
                'answer' => $question->correct_answer
            ];

            if ($question->question_type === 'multiple-choice') {
                $questionData['choices'] = $options ?? [];
                $transformedQuestions['multiple'][] = $questionData;
            } elseif ($question->question_type === 'true-false') {
                $transformedQuestions['trueOrFalse'][] = $questionData;
            } else {
                $transformedQuestions['identification'][] = $questionData;
            }
        }

        $extractedTopic = $exam->settings['extracted_topic'] ?? 'Unknown Topic';

        return Inertia::render('exam-view', [
            'exam' => [
                'id' => $exam->id,
                'title' => $exam->title,
                'topic' => $extractedTopic,
                'question_types' => $exam->settings['question_types'] ?? [],
                'difficulty' => ucfirst($exam->settings['difficulty'] ?? 'N/A'),
                'extracted_topic' => $extractedTopic,
                'subject' => $exam->settings['subject'] ?? null
            ],
            'questions' => $transformedQuestions
        ]);
    }

    public function updateTitle(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255'
        ]);

        $exam = Exam::findOrFail($id);
        // CHANGED: Now directly saves the new title without adding date
        $exam->title = $request->title;
        $exam->save();

        return back()->with('success', 'Exam title updated successfully');
    }

    public function export($examId)
    {
        $exam = Exam::with('questions')->findOrFail($examId);

        return response()->json([
            'message' => 'Export functionality coming soon',
            'exam' => $exam
        ]);
    }

    public function library()
    {
        $exams = Exam::where('user_id', auth()->id())
            ->with('questions')
            ->latest()
            ->get()
            ->map(function ($exam) {
                return [
                    'id' => $exam->id,
                    'title' => $exam->title,
                    'topic' => $exam->settings['subject'] ?? 'Unknown',
                    'extracted_topic' => $exam->settings['extracted_topic'] ?? 'Unknown',
                    'question_count' => $exam->questions->count(),
                    'created_at' => $exam->created_at->toISOString(),
                ];
            });

        return inertia('exam-library', [
            'exams' => $exams
        ]);
    }

    public function store(Request $request)
    {
        //
    }

    public function edit(Exam $exam)
    {
        //
    }

    public function update(Request $request, Exam $exam)
    {
        //
    }

    public function destroy(Exam $exam)
    {
        //
    }
}
