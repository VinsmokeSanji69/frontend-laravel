<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\Question;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuestionController extends Controller
{
    /**
     * Display questions for a specific exam
     */
    public function index($examId)
    {
        $exam = Exam::with('questions')->findOrFail($examId);

        // Transform questions by type
        $transformedQuestions = [
            'multiple' => [],
            'trueOrFalse' => [],
            'identification' => []
        ];

        foreach ($exam->questions as $question) {
            $options = is_string($question->options)
                ? json_decode($question->options, true)
                : $question->options;

            if ($question->question_type === 'multiple-choice') {
                $transformedQuestions['multiple'][] = [
                    'id' => $question->id,
                    'question' => $question->question_text,
                    'choices' => $options ?? [],
                    'answer' => $question->correct_answer
                ];
            } elseif ($question->question_type === 'true-false') {
                $transformedQuestions['trueOrFalse'][] = [
                    'id' => $question->id,
                    'question' => $question->question_text,
                    'answer' => $question->correct_answer
                ];
            } else { // identification
                $transformedQuestions['identification'][] = [
                    'id' => $question->id,
                    'question' => $question->question_text,
                    'answer' => $question->correct_answer
                ];
            }
        }

        return Inertia::render('exam-view', [
            'exam' => [
                'id' => $exam->id,
                'title' => $exam->title,
                'topics' => $exam->settings['question_types'] ?? [],
                'difficulty' => ucfirst($exam->settings['difficulty'] ?? 'moderate'),
                'extracted_topic' => $exam->settings['extracted_topic'] ?? null
            ],
            'questions' => $transformedQuestions
        ]);
    }

    /**
     * Update a specific question
     */
    public function update(Request $request, $id)
    {
        $question = Question::findOrFail($id);

        $request->validate([
            'question_text' => 'sometimes|string|max:1000',
            'options' => 'sometimes|array',
            'correct_answer' => 'sometimes|string|max:500',
        ]);

        $question->update($request->only(['question_text', 'options', 'correct_answer']));

        return back()->with('success', 'Question updated successfully');
    }

    /**
     * Delete a specific question
     */
    public function destroy($id)
    {
        $question = Question::findOrFail($id);
        $examId = $question->exam_id;

        $question->delete();

        // Update total questions count
        $exam = Exam::find($examId);
        $exam->total_questions = $exam->questions()->count();
        $exam->save();

        return back()->with('success', 'Question deleted successfully');
    }
}
