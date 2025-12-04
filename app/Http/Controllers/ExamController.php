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
    private string $flaskUrl;

    public function __construct()
    {
        $this->flaskUrl = rtrim(config('services.flask.url'), '/');

        if (!$this->flaskUrl) {
            abort(500, 'FLASK service URL not configured.');
        }
    }

    public function index(): \Inertia\Response
    {
        $exams = Exam::latest()->get();

        return Inertia::render('landing-page', [
            'exams' => $exams
        ]);
    }

    public function generate(Request $request)
    {
        if ($request->isMethod('get')) {
            return Inertia::render('form/generate-exam-form', []);
        }

        set_time_limit(300);
        ini_set('max_execution_time', '300');

        $request->validate([
            'file' => 'required|mimes:pdf|max:10240',
            'difficulty' => 'required|in:easy,moderate,hard',
            'question_types' => 'required|array|min:1',
            'question_types.*' => 'in:multipleChoice,trueOrFalse,identification',
            'num_questions' => 'integer|min:1|max:50',
            'subject' => 'nullable|string|max:100'
        ]);

        try {
            $difficultyMap = [
                'easy' => 'easy',
                'moderate' => 'medium',
                'hard' => 'hard'
            ];

            $typeMap = [
                'multipleChoice' => 'multiple-choice',
                'trueOrFalse' => 'true-false',
                'identification' => 'identification'
            ];

            $selectedTypes = array_map(fn($type) => $typeMap[$type] ?? 'multiple-choice', $request->question_types);
            $questionsPerType = intval($request->num_questions ?? 10);

            // ===== STEP 1: Extract PDF =====
            Log::info('PDF Extraction start');

            $pdfResponse = Http::timeout(90)
                ->attach(
                    'file',
                    file_get_contents($request->file('file')->path()),
                    $request->file('file')->getClientOriginalName()
                )
                ->post("{$this->flaskUrl}/api/ai/extract-pdf");

            if (!$pdfResponse->successful()) {
                Log::error('PDF extraction failed', ['response' => $pdfResponse->body()]);
                return back()->with('error', 'PDF extraction failed.');
            }

            $pdfData = $pdfResponse->json();
            $content = $pdfData['content'] ?? null;

            if (!$content) {
                return back()->with('error', 'PDF returned no content.');
            }

            // ===== STEP 2: Analyze Topic =====
            Log::info('Topic analysis start');

            $topicResponse = Http::timeout(90)
                ->post("{$this->flaskUrl}/api/ai/analyze-topic", [
                    'content' => $content
                ]);

            if (!$topicResponse->successful()) {
                Log::error('Topic analysis failed', ['response' => $topicResponse->body()]);
                return back()->with('error', 'Topic detection failed.');
            }

            $extractedTopic = $topicResponse->json()['topic'] ?? 'Generated Exam';

            // ===== STEP 3: Generate Questions =====
            $allQuestions = [];

            foreach ($selectedTypes as $type) {

                Log::info("Generating {$type} questions");

                try {
                    $questionsResponse = Http::timeout(120)
                        ->post("{$this->flaskUrl}/api/ai/generate-questions", [
                            'content' => $content,
                            'num_questions' => $questionsPerType,
                            'difficulty' => $difficultyMap[$request->difficulty],
                            'type' => $type
                        ]);

                    if ($questionsResponse->successful()) {
                        $questions = $questionsResponse->json()['questions'] ?? [];

                        foreach ($questions as &$q) {
                            $q['type'] = $type;
                        }

                        $allQuestions = array_merge($allQuestions, $questions);
                    } else {
                        Log::warning("Generation failed for {$type}", ['body' => $questionsResponse->body()]);
                    }

                } catch (\Exception $e) {
                    Log::error("Exception during generation {$type}", ['err' => $e->getMessage()]);
                }
            }

            if (empty($allQuestions)) {
                return back()->with('error', 'AI failed to generate questions.');
            }

            // ===== STEP 4: Save Exam =====
            $exam = Exam::create([
                'title' => "{$extractedTopic} - Exam (" . now()->format('Y-m-d') . ")",
                'description' => "Generated from {$request->file('file')->getClientOriginalName()}",
                'total_questions' => count($allQuestions),
                'settings' => [
                    'difficulty' => $request->difficulty,
                    'question_types' => $request->question_types,
                    'source_file' => $request->file('file')->getClientOriginalName(),
                    'source_pages' => $pdfData['pages'] ?? null,
                    'extracted_topic' => $extractedTopic,
                    'subject' => $request->subject ?? $extractedTopic
                ]
            ]);

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

            Log::info('Exam created', ['exam_id' => $exam->id]);

            return redirect()->route('exam.view', ['id' => $exam->id])
                ->with('success', "Exam generated: {$extractedTopic}");

        } catch (\Throwable $e) {
            Log::critical('Exam generation error', ['error' => $e->getMessage()]);
            return back()->with('error', 'Server error during exam generation.');
        }
    }

    public function generating()
    {
        return Inertia::render('loader-screen', []);
    }

    public function view($id)
    {
        $exam = Exam::with('questions')->findOrFail($id);

        $transformedQuestions = [
            'multiple' => [],
            'trueOrFalse' => [],
            'identification' => []
        ];

        foreach ($exam->questions as $question) {

            $options = is_string($question->options)
                ? json_decode($question->options, true)
                : $question->options;

            $payload = [
                'id' => $question->id,
                'question' => $question->question_text,
                'answer' => $question->correct_answer
            ];

            if ($question->question_type === 'multiple-choice') {
                $payload['choices'] = $options ?? [];
                $transformedQuestions['multiple'][] = $payload;
            } elseif ($question->question_type === 'true-false') {
                $transformedQuestions['trueOrFalse'][] = $payload;
            } else {
                $transformedQuestions['identification'][] = $payload;
            }
        }

        $topic = $exam->settings['extracted_topic'] ?? 'Unknown';

        return Inertia::render('exam-view', [
            'exam' => [
                'id' => $exam->id,
                'title' => $exam->title,
                'topic' => $topic,
                'difficulty' => ucfirst($exam->settings['difficulty'] ?? 'N/A'),
                'subject' => $exam->settings['subject'] ?? null
            ],
            'questions' => $transformedQuestions
        ]);
    }

    public function updateTitle(Request $request, $id)
    {
        $request->validate(['title' => 'required|string|max:255']);

        $exam = Exam::findOrFail($id);
        $exam->update(['title' => $request->title]);

        return back()->with('success', 'Exam title updated.');
    }

    public function export($examId)
    {
        $exam = Exam::with('questions')->findOrFail($examId);

        return response()->json([
            'message' => 'Export coming soon.',
            'exam' => $exam
        ]);
    }
}
