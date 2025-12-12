import { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Check, X, Shuffle } from "lucide-react";
import { RadioButton } from "@/components/ui/radio-group";
import { MultipleChoice } from "@/pages/question-layout/multiple-choice";
import { TrueOrFalse } from "@/pages/question-layout/true-or-false";
import { Identification } from "@/pages/question-layout/identification";
import { router } from "@inertiajs/react";
import { generateExamPdf } from "@/utils/generateExamPdf";
import Swal from "sweetalert2";

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

interface User {
    id: number;
    name: string;
    email: string;
}

type Props = {
    auth?: { user: User | null };
    exam: ExamData;
    questions: QuestionData;
};

const optionConfig: Record<string, { label: string; color: string }> = {
    multiple: { label: "Multiple Choice", color: "violet" },
    trueOrFalse: { label: "True or False", color: "yellow" },
    identification: { label: "Identification", color: "blue" },
};

function generateOptions(data: QuestionData) {
    return (Object.keys(data) as Array<keyof QuestionData>)
        .filter(key => data[key] && data[key].length > 0)
        .map(key => ({
            id: key,
            label: optionConfig[key].label,
            color: optionConfig[key].color,
        }));
}

// Helper to shuffle array
function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export default function ExamView({ exam, questions, auth }: Props) {
    const options = generateOptions(questions);

    const getInitialSelected = () => {
        if (questions.multiple.length > 0) return "multiple";
        if (questions.trueOrFalse.length > 0) return "trueOrFalse";
        if (questions.identification.length > 0) return "identification";
        return "multiple";
    };

    const [selected, setSelected] = useState<string>(getInitialSelected());
    const [examQuestions, setExamQuestions] = useState<QuestionData>({ ...questions });
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState(exam.title);
    const [isSaving, setIsSaving] = useState(false);

    const handleBack = () => router.visit("/exam-library");

    const handlePublish = () => {
        try {
            generateExamPdf(exam, examQuestions);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Please try again.");
        }
    };

    const handleShuffle = async () => {
        const result = await Swal.fire({
            title: "Shuffle Questions?",
            text: "All questions will be randomly rearranged. This action is permanent but you can shuffle again.",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#2563eb",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Shuffle",
        });

        if (!result.isConfirmed) return;

        // Shuffle each type
        const shuffledQuestions: QuestionData = {
            multiple: shuffleArray(examQuestions.multiple),
            trueOrFalse: shuffleArray(examQuestions.trueOrFalse),
            identification: shuffleArray(examQuestions.identification),
        };

        setExamQuestions(shuffledQuestions);

        try {
            const payload = [
                ...shuffledQuestions.multiple.map((q, i) => ({ id: q.id, order: i + 1 })),
                ...shuffledQuestions.trueOrFalse.map((q, i) => ({ id: q.id, order: i + 1 })),
                ...shuffledQuestions.identification.map((q, i) => ({ id: q.id, order: i + 1 })),
            ];

            await router.post(
                `/exam-generator/shuffle-questions/${exam.id}`,
                { questions: payload },
                { preserveScroll: true }
            );

            Swal.fire("Shuffled!", "Questions have been shuffled successfully.", "success");
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Failed to save new question order.", "error");
        }
    };

    const handleSaveTitle = async () => {
        if (editedTitle.trim() === "") return alert("Title cannot be empty");
        if (editedTitle === exam.title) return setIsEditingTitle(false);

        setIsSaving(true);
        router.patch(
            `/exam/${exam.id}/update-title`,
            { title: editedTitle },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsEditingTitle(false);
                    setIsSaving(false);
                },
                onError: () => {
                    setEditedTitle(exam.title);
                    setIsSaving(false);
                    alert("Failed to update title");
                },
            }
        );
    };

    const handleCancelEdit = () => {
        setEditedTitle(exam.title);
        setIsEditingTitle(false);
    };

    const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSaveTitle();
        else if (e.key === "Escape") handleCancelEdit();
    };

    // --- Delete handler for all question types ---
    const handleDeleteQuestion = (type: keyof QuestionData, id: number) => {
        setExamQuestions(prev => ({
            ...prev,
            [type]: prev[type].filter(q => q.id !== id)
        }));
    };

    return (
        <AppLayout auth={auth}>
            <div className="flex flex-1 min-h-[620px] mt-20 flex-col items-center justify-start gap-3 rounded-xl px-4 pb-10">
                {/* Header Buttons */}
                <div className="flex flex-row w-full justify-between gap-2">
                    <Button variant="fit" size="xs" className="shadow-[4px_4px_0_#000000]" onClick={handleBack}>
                        <ArrowLeft />
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="fit" size="xs" className="shadow-[4px_4px_0_#000000]" onClick={handleShuffle}>
                            <Shuffle />
                        </Button>
                        <Button variant="fit" size="xs" className="shadow-[4px_4px_0_#000000]" onClick={handlePublish}>
                            Publish
                        </Button>
                    </div>
                </div>

                {/* Exam Title */}
                <div className="flex flex-col w-full border-2 border-card-foreground rounded-md gap-1 px-3 py-2">
                    <div className="flex flex-row w-full gap-3 items-center">
                        {isEditingTitle ? (
                            <>
                                <input
                                    type="text"
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                    onKeyDown={handleTitleKeyDown}
                                    className="flex-1 text-2xl font-medium text-foreground outline-none border-b-2 border-blue-500 focus:outline-none bg-transparent"
                                    autoFocus
                                    disabled={isSaving}
                                />
                                <button onClick={handleSaveTitle} disabled={isSaving} className="p-1.5 hover:bg-green-100 rounded text-green-600">
                                    <Check size={22} />
                                </button>
                                <button onClick={handleCancelEdit} disabled={isSaving} className="p-1.5 hover:bg-red-100 rounded text-red-600">
                                    <X size={22} />
                                </button>
                            </>
                        ) : (
                            <>
                                <h1 className="flex-1 text-2xl font-medium text-foreground">{exam.title}</h1>
                                <button onClick={() => setIsEditingTitle(true)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500">
                                    <Pencil size={20} />
                                </button>
                            </>
                        )}
                    </div>
                    <div className="flex flex-row w-fit space-x-1">
                        <p className="text-md text-foreground">Topic:</p>
                        <p className="text-md font-semibold text-foreground">{exam.extracted_topic}</p>
                    </div>
                </div>

                {/* Question Types */}
                <div className="flex flex-col w-full gap-2">
                    <h2 className="font-medium text-md">Test Types</h2>
                    <div className="flex flex-col md:flex-row sm:gap-8 w-full gap-4">
                        <div className="flex flex-col w-full md:w-[24%] gap-2">
                            {options.map(option => (
                                <RadioButton
                                    key={option.id}
                                    option={option}
                                    isSelected={selected === option.id}
                                    onSelect={setSelected}
                                />
                            ))}
                        </div>

                        <div className="flex flex-col w-full md:w-[50%]">
                            {selected === "multiple" && examQuestions.multiple.length > 0 ? (
                                <section id="multiple" className="flex w-full flex-col gap-3">
                                    {examQuestions.multiple.map((q, idx) => (
                                        <MultipleChoice
                                            key={q.id}
                                            index={idx}
                                            data={q}
                                            onDelete={() => handleDeleteQuestion("multiple", q.id)}
                                        />
                                    ))}
                                </section>
                            ) : selected === "trueOrFalse" && examQuestions.trueOrFalse.length > 0 ? (
                                <section id="trueOrFalse" className="flex w-full flex-col gap-3">
                                    {examQuestions.trueOrFalse.map((q, idx) => (
                                        <TrueOrFalse
                                            key={q.id}
                                            index={idx}
                                            data={q}
                                            onDelete={() => handleDeleteQuestion("trueOrFalse", q.id)}
                                        />
                                    ))}
                                </section>
                            ) : selected === "identification" && examQuestions.identification.length > 0 ? (
                                <section id="identification" className="flex w-full flex-col gap-3">
                                    {examQuestions.identification.map((q, idx) => (
                                        <Identification
                                            key={q.id}
                                            index={idx}
                                            data={q}
                                            onDelete={() => handleDeleteQuestion("identification", q.id)}
                                        />
                                    ))}
                                </section>
                            ) : (
                                <div className="flex items-center justify-center h-40 text-muted-foreground">
                                    No questions available for this type
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
