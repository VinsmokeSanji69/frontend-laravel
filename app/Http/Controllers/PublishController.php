<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use Barryvdh\DomPDF\Facade\Pdf;

class PublishController extends Controller
{
    public function generatePdf($examId)
    {
        // Load exam with questions
        $exam = Exam::with('questions')->findOrFail($examId);

        // Group questions by type
        $questionsByType = [
            'multiple_choice' => [],
            'true_false' => [],
            'identification' => []
        ];

        foreach ($exam->questions as $question) {
            if ($question->question_type === 'multiple_choice') {
                $questionsByType['multiple_choice'][] = $question;
            } elseif ($question->question_type === 'true_false') {
                $questionsByType['true_false'][] = $question;
            } elseif ($question->question_type === 'identification') {
                $questionsByType['identification'][] = $question;
            }
        }

        // Determine which test types to include and their order
        $testTypes = [];
        if (count($questionsByType['multiple_choice']) > 0) {
            $testTypes[] = [
                'name' => 'MULTIPLE CHOICE',
                'instruction' => 'Choose the best answer and encircle the letter on the answer sheet.',
                'questions' => $questionsByType['multiple_choice'],
                'type' => 'multiple_choice'
            ];
        }
        if (count($questionsByType['true_false']) > 0) {
            $testTypes[] = [
                'name' => 'TRUE OR FALSE',
                'instruction' => 'Write TRUE if the statement is correct and FALSE if it is not.',
                'questions' => $questionsByType['true_false'],
                'type' => 'true_false'
            ];
        }
        if (count($questionsByType['identification']) > 0) {
            $testTypes[] = [
                'name' => 'IDENTIFICATION',
                'instruction' => 'Write the correct term, concept, or name being described.',
                'questions' => $questionsByType['identification'],
                'type' => 'identification'
            ];
        }

        // Get exam settings
        $settings = $exam->settings ?? [];
        $difficulty = $settings['difficulty'] ?? 'Medium';
        $topics = $settings['topics'] ?? [];
        $extractedTopic = $settings['extracted_topic'] ?? 'General';

        // Format topics string
        $topicsString = is_array($topics) ? implode(', ', $topics) : $topics;

        // Prepare data for PDF
        $data = [
            'exam' => $exam,
            'testTypes' => $testTypes,
            'difficulty' => $difficulty,
            'topics' => $topicsString,
            'extractedTopic' => $extractedTopic,
        ];

        // Generate PDF
        $pdf = Pdf::loadView('exam.pdf-template', $data);
        $pdf->setPaper('letter', 'portrait');

        // Return PDF to open in new tab
        return $pdf->stream('exam-' . $exam->id . '.pdf');
    }

    public function generateAnswerKey($examId)
    {
        // Load exam with questions
        $exam = Exam::with('questions')->findOrFail($examId);

        // Group questions by type
        $questionsByType = [
            'multiple_choice' => [],
            'true_false' => [],
            'identification' => []
        ];

        foreach ($exam->questions as $question) {
            if ($question->question_type === 'multiple_choice') {
                $questionsByType['multiple_choice'][] = $question;
            } elseif ($question->question_type === 'true_false') {
                $questionsByType['true_false'][] = $question;
            } elseif ($question->question_type === 'identification') {
                $questionsByType['identification'][] = $question;
            }
        }

        // Determine which test types to include
        $testTypes = [];
        if (count($questionsByType['multiple_choice']) > 0) {
            $testTypes[] = [
                'name' => 'MULTIPLE CHOICE',
                'questions' => $questionsByType['multiple_choice'],
                'type' => 'multiple_choice'
            ];
        }
        if (count($questionsByType['true_false']) > 0) {
            $testTypes[] = [
                'name' => 'TRUE OR FALSE',
                'questions' => $questionsByType['true_false'],
                'type' => 'true_false'
            ];
        }
        if (count($questionsByType['identification']) > 0) {
            $testTypes[] = [
                'name' => 'IDENTIFICATION',
                'questions' => $questionsByType['identification'],
                'type' => 'identification'
            ];
        }

        // Get exam settings
        $settings = $exam->settings ?? [];
        $difficulty = $settings['difficulty'] ?? 'Medium';
        $topics = $settings['topics'] ?? [];
        $extractedTopic = $settings['extracted_topic'] ?? 'General';

        // Format topics string
        $topicsString = is_array($topics) ? implode(', ', $topics) : $topics;

        // Prepare data for PDF
        $data = [
            'exam' => $exam,
            'testTypes' => $testTypes,
            'difficulty' => $difficulty,
            'topics' => $topicsString,
            'extractedTopic' => $extractedTopic,
        ];

        // Generate Answer Key PDF
        $pdf = Pdf::loadView('exam.answer-key-template', $data);
        $pdf->setPaper('letter', 'portrait');

        // Return PDF to open in new tab
        return $pdf->stream('exam-answer-key-' . $exam->id . '.pdf');
    }
}
