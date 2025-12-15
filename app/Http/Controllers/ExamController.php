<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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
        return Inertia::render('landing-page');
    }

    public function generate(Request $request)
    {
        if ($request->isMethod('get')) {
            return Inertia::render('form/generate-exam-form', []);
        }

        // Increase PHP execution time for AI processing
        set_time_limit(300);
        ini_set('max_execution_time', '300');

        // Validation rules
        $request->validate([
            'file' => 'nullable|mimes:pdf|max:10240',
            'topic' => 'nullable|string|max:255',
            'question_types' => 'required|array|min:1',
            'question_types.*.type' => 'required|in:Multiple Choice,True or False,Identification',
            'question_types.*.difficulties' => 'required|array',
            'question_types.*.difficulties.easy' => 'required|integer|min:0',
            'question_types.*.difficulties.moderate' => 'required|integer|min:0',
            'question_types.*.difficulties.hard' => 'required|integer|min:0',
        ], [
            'file.required_without' => 'Please provide either a PDF file or a topic.',
            'topic.required_without' => 'Please provide either a PDF file or a topic.',
        ]);

        // Ensure either file or topic is provided
        if (!$request->hasFile('file') && !$request->filled('topic')) {
            return back()->withErrors([
                'general' => 'Please provide either a PDF file or a topic.'
            ]);
        }

        try {
            $content = null;
            $extractedTopic = null;
            $sourceFile = null;
            $sourcePages = null;

            // ===== STEP 1: Get content (either from PDF or topic) =====
            if ($request->hasFile('file')) {
                Log::info('Step 1: Extracting PDF content');

                // FIX: Added withoutVerifying() to bypass SSL error
                $pdfResponse = Http::withoutVerifying()
                    ->timeout(60)
                    ->attach(
                        'file',
                        file_get_contents($request->file('file')->path()),
                        $request->file('file')->getClientOriginalName()
                    )
                    ->post("{$this->flaskUrl}/api/ai/extract-pdf");

                if (!$pdfResponse->successful()) {
                    $apiError = $pdfResponse->json()['error'] ?? 'Failed to extract PDF content. Please try again.';
                    Log::error('PDF extraction failed', ['response' => $pdfResponse->json()]);
                    return back()->withErrors(['general' => $apiError]);
                }

                $pdfData = $pdfResponse->json();
                $content = $pdfData['content'];
                $sourceFile = $request->file('file')->getClientOriginalName();
                $sourcePages = $pdfData['pages'] ?? null;

                Log::info('PDF extracted', [
                    'pages' => $pdfData['pages'],
                    'chars' => strlen($content)
                ]);

                // Analyze topic from PDF content
                Log::info('Step 2: Analyzing main topic from content');

                // FIX: Added withoutVerifying() to bypass SSL error
                $topicResponse = Http::withoutVerifying()
                    ->timeout(90)
                    ->withHeaders(['Accept' => 'application/json'])
                    ->post("{$this->flaskUrl}/api/ai/analyze-topic", [
                        'content' => $content
                    ]);

                if ($topicResponse->successful()) {
                    $topicData = $topicResponse->json();
                    $extractedTopic = $topicData['topic'];
                    Log::info('Topic extracted', ['topic' => $extractedTopic]);
                } else {
                    Log::warning('Topic analysis failed, using filename');
                    $extractedTopic = pathinfo($sourceFile, PATHINFO_FILENAME);
                }
            } else {
                // User provided topic directly
                $extractedTopic = $request->topic;
                $content = $request->topic; // Use topic as content for question generation
                Log::info('Using user-provided topic', ['topic' => $extractedTopic]);
            }

            // ===== STEP 2: Process question types and difficulties =====
            $questionTypeMap = [
                'Multiple Choice' => 'multiple-choice',
                'True or False' => 'true-false',
                'Identification' => 'identification'
            ];

            $difficultyMap = [
                'easy' => 'easy',
                'moderate' => 'medium',
                'hard' => 'hard'
            ];

            // Build question requests
            $questionRequests = [];
            foreach ($request->question_types as $qtData) {
                $backendType = $questionTypeMap[$qtData['type']];

                foreach ($qtData['difficulties'] as $difficulty => $count) {
                    if ($count > 0) {
                        $questionRequests[] = [
                            'type' => $backendType,
                            'difficulty' => $difficultyMap[$difficulty],
                            'count' => (int)$count
                        ];
                    }
                }
            }

            if (empty($questionRequests)) {
                return back()->withErrors([
                    'general' => 'Please specify at least one question with a difficulty level.'
                ]);
            }

            // ===== STEP 3: Generate questions =====
            Log::info('Step 3: Generating questions', ['requests' => $questionRequests]);

            $allQuestions = [];

            foreach ($questionRequests as $qRequest) {
                Log::info("Generating {$qRequest['count']} {$qRequest['type']} questions at {$qRequest['difficulty']} difficulty");

                try {
                    // FIX: Added withoutVerifying() to bypass SSL error
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

                            Log::info("Successfully generated {$generatedCount} questions");
                        } else {
                            Log::warning("Question generation returned empty", ['request' => $qRequest]);
                        }
                    } else {
                        $errorData = $questionsResponse->json();
                        Log::error("Question generation failed", ['error' => $errorData, 'request' => $qRequest]);
                    }

                } catch (\Exception $e) {
                    Log::error("Exception while generating questions: " . $e->getMessage());
                }
            }

            if (empty($allQuestions)) {
                return back()->withErrors([
                    'general' => 'Failed to generate questions. Please try again.'
                ]);
            }

            Log::info('Total questions generated', ['count' => count($allQuestions)]);

            // ===== STEP 4: Save to database =====
            $exam = Exam::create([
                'title' => $extractedTopic . ' Exam',
                'description' => $sourceFile ? "Generated from {$sourceFile}" : "Generated from topic: {$extractedTopic}",
                'total_questions' => count($allQuestions),
                'user_id' => Auth::id(),
                'settings' => [
                    'question_types_config' => $request->question_types,
                    'source_file' => $sourceFile,
                    'source_pages' => $sourcePages,
                    'extracted_topic' => $extractedTopic,
                    'user_provided_topic' => $request->topic,
                    'generation_method' => $request->hasFile('file') ? 'pdf' : 'topic'
                ]
            ]);

            // Save questions with difficulty
            foreach ($allQuestions as $index => $q) {
                Question::create([
                    'exam_id' => $exam->id,
                    'question_text' => $q['question'],
                    'question_type' => $q['type'],
                    'difficulty' => $q['difficulty'],
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
                ->with('success', "Successfully generated exam: {$extractedTopic} ({$exam->total_questions} questions)");

        } catch (\Exception $e) {
            Log::error('Exam generation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withErrors([
                'general' => 'Failed to generate exam: ' . $e->getMessage()
            ]);
        }
    }

    public function generating()
    {
        return Inertia::render('loader-screen', []);
    }

    // FIXED: duplicateExam() - Add validation
    public function duplicateExam($id)
    {
        // Validate ID
        if (!is_numeric($id) || $id <= 0) {
            Log::error('Invalid exam ID for duplication', ['id' => $id]);
            return back()->withErrors(['general' => 'Invalid exam ID.']);
        }

        try {
            $originalExam = Exam::with('questions')->findOrFail($id);

            // Check authorization
            if ($originalExam->user_id !== Auth::id()) {
                return back()->withErrors(['general' => 'Unauthorized action.']);
            }

            DB::beginTransaction();

            // Create new exam
            $examAttributes = $originalExam->getAttributes();
            unset($examAttributes['id']);
            unset($examAttributes['created_at']);
            unset($examAttributes['updated_at']);
            $examAttributes['share_code'] = null;
            $examAttributes['title'] = $originalExam->title . ' (Copy)';
            $examAttributes['user_id'] = Auth::id();

            // Ensure settings are properly copied
            $originalSettings = $originalExam->settings ?? [];
            $originalTopic = $originalSettings['extracted_topic'] ?? $originalExam->title;
            $newSettings = $originalSettings;
            $newSettings['extracted_topic'] = $originalTopic;
            $examAttributes['settings'] = $newSettings;

            $newExam = Exam::create($examAttributes);

            // Duplicate questions with proper options handling
            foreach ($originalExam->questions as $question) {
                $questionAttributes = $question->getAttributes();

                unset($questionAttributes['id']);
                unset($questionAttributes['created_at']);
                unset($questionAttributes['updated_at']);
                $questionAttributes['exam_id'] = $newExam->id;

                // Handle options field
                if (isset($questionAttributes['options'])) {
                    $options = $questionAttributes['options'];

                    if (is_string($options)) {
                        $options = json_decode($options, true);
                    }

                    if (!is_array($options)) {
                        $options = [];
                    }

                    $options = array_values(array_filter($options, function($val) {
                        return $val !== null && $val !== '';
                    }));

                    $questionAttributes['options'] = json_encode($options);
                } else {
                    $questionAttributes['options'] = json_encode([]);
                }

                Question::create($questionAttributes);
            }

            DB::commit();

            Log::info('Exam duplicated successfully', [
                'original_id' => $id,
                'new_id' => $newExam->id
            ]);

            return redirect()->route('exam.view', ['id' => $newExam->id])
                ->with('success', "Exam duplicated successfully! New exam: {$newExam->title}");

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Exam duplication failed', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors(['general' => 'Failed to duplicate exam: ' . $e->getMessage()]);
        }
    }

    // FIXED: deleteExam() - Add validation
    public function deleteExam($id)
    {
        // Validate ID
        if (!is_numeric($id) || $id <= 0) {
            Log::error('Invalid exam ID for deletion', ['id' => $id]);
            return back()->withErrors(['general' => 'Invalid exam ID.']);
        }

        try {
            $exam = Exam::findOrFail($id);

            // Check authorization
            if ($exam->user_id !== Auth::id()) {
                return back()->withErrors(['general' => 'Unauthorized action.']);
            }

            $examTitle = $exam->title;

            DB::beginTransaction();

            // Delete questions first
            $exam->questions()->delete();

            // Then delete the exam itself
            $exam->delete();

            DB::commit();

            Log::info('Exam deleted successfully', ['id' => $id, 'title' => $examTitle]);

            return back()->with('success', "Exam '{$examTitle}' deleted successfully.");

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Exam deletion failed', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);
            return back()->withErrors(['general' => 'Failed to delete exam.']);
        }
    }

    public function view($id)
    {
        // Explicitly order questions by the 'order' column
        $exam = Exam::with(['questions' => function ($query) {
            $query->orderBy('order', 'asc');
        }])->findOrFail($id);

        // Transform questions for components
        $transformedQuestions = [
            'multiple' => [],
            'trueOrFalse' => [],
            'identification' => []
        ];

        foreach ($exam->questions as $question) {

            // --- ROBUST OPTIONS HANDLING ---
            $options = $question->options;

            // Case 1: It's a JSON string - decode it
            if (is_string($options)) {
                $decoded = json_decode($options, true);
                $options = is_array($decoded) ? $decoded : [];
            }
            // Case 2: It's null or not an array - default to empty array
            elseif (!is_array($options)) {
                $options = [];
            }
            // Case 3: It's already an array - use as-is

            // Additional safety: filter out null/invalid values
            $options = array_values(array_filter($options, function($val) {
                return $val !== null && $val !== '';
            }));

            // --- BUILD QUESTION DATA ---
            $questionData = [
                'id' => $question->id,
                'question' => $question->question_text,
                'answer' => $question->correct_answer,
                'difficulty' => $question->difficulty ?? 'medium'
            ];

            if ($question->question_type === 'multiple-choice') {
                $questionData['choices'] = $options; // Now guaranteed to be an array
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
                'question_types_config' => $exam->settings['question_types_config'] ?? [],
                'extracted_topic' => $extractedTopic,
                'generation_method' => $exam->settings['generation_method'] ?? null
            ],
            'questions' => $transformedQuestions
        ]);
    }

    public function shuffleQuestions(Request $request, $id)
    {
        $request->validate([
            'questions' => 'required|array',
            'questions.*.id' => 'required|integer|exists:questions,id',
            'questions.*.order' => 'required|integer|min:1',
        ]);

        try {
            DB::beginTransaction();

            foreach ($request->input('questions') as $item) {
                Question::where('id', $item['id'])->update(['order' => $item['order']]);
            }

            DB::commit();

            return back()->with('success', 'Questions shuffled successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Shuffle failed', ['error' => $e->getMessage()]);
            return back()->withErrors(['general' => 'Failed to save order']);
        }
    }

    public function updateTitle(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255'
        ]);

        $exam = Exam::findOrFail($id);
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
                $settings = $exam->settings ?? [];

                return [
                    'id' => $exam->id, // CRITICAL: This must be here!
                    'title' => $exam->title,
                    'topic' => $settings['extracted_topic'] ?? 'Unknown',
                    'extracted_topic' => $settings['extracted_topic'] ?? 'Unknown', // For backward compatibility
                    'questionCount' => $exam->questions->count(), // camelCase to match TypeScript
                    'question_count' => $exam->questions->count(), // snake_case for backward compatibility
                    'created_at' => $exam->created_at->toISOString(),
                    'generation_method' => $settings['generation_method'] ?? null,
                ];
            });

        // DEBUG: Log the data to verify
        Log::info('Exam library data', [
            'count' => $exams->count(),
            'first_exam' => $exams->first(),
            'user_id' => auth()->id()
        ]);

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
