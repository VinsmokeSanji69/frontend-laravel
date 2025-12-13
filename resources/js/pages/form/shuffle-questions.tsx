import { Button } from "@/components/ui/button"
import {
    FieldGroup,
    FieldHeader,
    FieldFooter, FieldLegend, FieldLabel, FieldDescription,
} from "@/components/ui/field"
import { X } from "lucide-react";
import { router } from "@inertiajs/react";
import * as React from "react";
import { useState } from "react";

type ExamData = {
    id: number;
    title: string;
    topic: string;
    question_types: string[];
    difficulty: string;
    extracted_topic?: string;
};

type QuestionData = {
    multiple: Array<{
        id: number;
        question: string;
        choices: string[];
        answer: string;
    }>;
    trueOrFalse: Array<{
        id: number;
        question: string;
        answer: string;
    }>;
    identification: Array<{
        id: number;
        question: string;
        answer: string;
    }>;
};

interface ShuffleQuestionsProps extends React.ComponentProps<"div"> {
    exam: ExamData;
    questions: QuestionData;
    onClose?: () => void;
    // New prop to communicate back to parent
    onShuffleComplete?: (shuffledData: QuestionData) => void;
}

function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export default function ShuffleQuestions({
                                             exam,
                                             questions,
                                             onClose,
                                             onShuffleComplete,
                                             ...props
                                         }: ShuffleQuestionsProps) {

    const [examQuestions, setExamQuestions] = useState<QuestionData>({ ...questions });

    const handleShuffle = async () => {
        // 1. Perform Shuffle Locally
        const shuffledQuestions: QuestionData = {
            multiple: shuffleArray(examQuestions.multiple),
            trueOrFalse: shuffleArray(examQuestions.trueOrFalse),
            identification: shuffleArray(examQuestions.identification),
        };

        // 2. Update Local State (Good practice)
        setExamQuestions(shuffledQuestions);

        // 3. IMMEDIATE UI UPDATE (Optimistic)
        // Pass the shuffled data back to parent immediately
        if (onShuffleComplete) {
            onShuffleComplete(shuffledQuestions);
        }

        // 4. Save to Database
        try {
            const payload = [
                ...shuffledQuestions.multiple.map((q, i) => ({ id: q.id, order: i + 1 })),
                ...shuffledQuestions.trueOrFalse.map((q, i) => ({ id: q.id, order: i + 1 })),
                ...shuffledQuestions.identification.map((q, i) => ({ id: q.id, order: i + 1 })),
            ];

            await router.post(
                `/exam-generator/shuffle-questions/${exam.id}`,
                { questions: payload },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        console.log("Questions shuffled successfully!");
                        // Close the modal
                        onClose?.();
                    },
                }
            );
        } catch (error) {
            console.error("Failed to save new question order:", error);
            // Optionally: You might want to revert the UI here if save fails
        }
    };

    return (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card w-full sm:max-w-lg max-w-md max-h-[90vh] border-2 border-card-foreground rounded-3xl z-50 flex flex-col overflow-hidden">
            {/* Header */}
            <FieldHeader className="shrink-0 px-4 py-3 border-b-2 flex items-center justify-between">
                <FieldLegend>Shuffle Exam Questions</FieldLegend>
                <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={onClose}
                    className="hover:border-card-foreground bg-card border-2 border-transparent"
                >
                    <X />
                </Button>
            </FieldHeader>

            {/* Scrollable Content */}
            <FieldGroup className="flex-1 overflow-y-auto px-4 py-4 gap-2">
                <FieldLabel className="text-lg">Randomize Order</FieldLabel>
                <FieldDescription className="text-md">
                    Randomizes the order of all questions in this exam. This helps reduce pattern bias and improve exam integrity.
                </FieldDescription>
            </FieldGroup>

            {/* Footer */}
            <FieldFooter className="shrink-0 border-t-2 p-4">
                <Button
                    variant="fit"
                    size="xs"
                    type="button"
                    onClick={handleShuffle}
                    className="transition-all hover:-translate-y-0.5 shadow-[4px_4px_0_#000000] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Confirm
                </Button>
            </FieldFooter>
        </div>
    );
}
