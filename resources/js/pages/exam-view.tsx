import { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Check, X } from "lucide-react";
import { RadioButton } from "@/components/ui/radio-group";
import { MultipleChoice } from "@/pages/question-layout/multiple-choice";
import { TrueOrFalse } from "@/pages/question-layout/true-or-false";
import { Identification } from "@/pages/question-layout/identification";
import { router } from "@inertiajs/react";
import { generateExamPdf } from "@/utils/generateExamPdf";

type Option = {
    id: string;
    label: string;
    color?: "blue" | "green" | "red" | "violet" | "yellow";
};

type ExamData = {
    id: number;
    title: string;
    topic: string;
    question_types: string[]; // Question types selected
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

type Props = {
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

export default function ExamView({ exam, questions }: Props) {
    const options = generateOptions(questions);

    const getInitialSelected = () => {
        if (questions.multiple.length > 0) return "multiple";
        if (questions.trueOrFalse.length > 0) return "trueOrFalse";
        if (questions.identification.length > 0) return "identification";
        return "multiple";
    };

    const [selected, setSelected] = useState<string>(getInitialSelected());
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState(exam.title);
    const [isSaving, setIsSaving] = useState(false);

    const handleBack = () => {
        router.visit('/exam-generator');
    };

    const handlePublish = () => {
        try {
            generateExamPdf(exam, questions);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        }
    };

    const handleSaveTitle = async () => {
        if (editedTitle.trim() === '') {
            alert('Title cannot be empty');
            setEditedTitle(exam.title);
            setIsEditingTitle(false);
            return;
        }

        if (editedTitle === exam.title) {
            setIsEditingTitle(false);
            return;
        }

        setIsSaving(true);

        router.patch(`/exam/${exam.id}/update-title`,
            { title: editedTitle },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsEditingTitle(false);
                    setIsSaving(false);
                },
                onError: (errors) => {
                    console.error('Failed to update title:', errors);
                    alert('Failed to update title. Please try again.');
                    setEditedTitle(exam.title);
                    setIsSaving(false);
                }
            }
        );
    };

    const handleCancelEdit = () => {
        setEditedTitle(exam.title);
        setIsEditingTitle(false);
    };

    const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSaveTitle();
        } else if (e.key === 'Escape') {
            handleCancelEdit();
        }
    };

    return (
        <AppLayout>
            <div className="flex flex-1 min-h-[620px] mt-20 flex-col items-center justify-start gap-3 rounded-xl px-10 pb-10">
                <div className="flex flex-row w-full justify-between">
                    <Button variant="fit" size="xs" onClick={handleBack}>
                        <ArrowLeft />
                    </Button>
                    <Button variant="fit" size="xs" onClick={handlePublish}>
                        Publish
                    </Button>
                </div>

                <div className="flex flex-col w-full border-2 border-card-foreground rounded-md gap-1 px-3 py-2">
                    <div className="flex flex-row w-full gap-3 items-center">
                        {isEditingTitle ? (
                            <>
                                <input
                                    type="text"
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                    onKeyDown={handleTitleKeyDown}
                                    className="flex-1 text-2xl font-medium text-foreground outline-none border-b-2 border-blue-500 focus:outline-none focus:ring-0 bg-transparent"
                                    autoFocus
                                    disabled={isSaving}
                                />
                                <button
                                    onClick={handleSaveTitle}
                                    disabled={isSaving}
                                    className="p-1.5 hover:bg-green-100 rounded text-green-600 disabled:opacity-50"
                                    title="Save (Enter)"
                                >
                                    <Check size={22} />
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    disabled={isSaving}
                                    className="p-1.5 hover:bg-red-100 rounded text-red-600 disabled:opacity-50"
                                    title="Cancel (Esc)"
                                >
                                    <X size={22} />
                                </button>
                            </>
                        ) : (
                            <>
                                <h1 className="flex-1 text-2xl font-medium text-foreground">
                                    {exam.title}
                                </h1>
                                <button
                                    onClick={() => setIsEditingTitle(true)}
                                    className="p-1.5 hover:bg-gray-100 rounded text-gray-500 transition-colors"
                                    title="Click to edit title"
                                >
                                    <Pencil size={20} />
                                </button>
                            </>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <div className="flex flex-row w-fit space-x-1">
                            <p className="text-md text-foreground">Difficulty:</p>
                            <p className="text-md font-semibold text-foreground">{exam.difficulty}</p>
                        </div>
                        <div className="flex flex-row w-fit space-x-1">
                            <p className="text-md text-foreground">Topic:</p>
                            <p className="text-md font-semibold text-foreground">{exam.extracted_topic}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col w-full gap-2">
                    <h2 className="font-medium text-md">Test Types</h2>
                    <div className="flex flex-col md:flex-row sm:gap-8 w-full gap-4">
                        <div className="flex flex-col w-full md:w-[24%] gap-2">
                            {options.map((option) => {
                                return (
                                    <RadioButton
                                        key={option.id}
                                        option={option}
                                        isSelected={selected === option.id}
                                        onSelect={setSelected}
                                    />
                                );
                            })}
                        </div>

                        <div className="flex flex-col w-full md:w-[50%]">
                            {selected === "multiple" && questions.multiple.length > 0 ? (
                                <section id="multiple" className="flex w-full flex-col gap-3">
                                    {questions.multiple.map((questionProps, index) => (
                                        <MultipleChoice key={questionProps.id} index={index} data={questionProps} />
                                    ))}
                                </section>
                            ) : selected === "trueOrFalse" && questions.trueOrFalse.length > 0 ? (
                                <section id="trueOrFalse" className="flex w-full flex-col gap-3">
                                    {questions.trueOrFalse.map((questionProps, index) => (
                                        <TrueOrFalse key={questionProps.id} index={index} data={questionProps} />
                                    ))}
                                </section>
                            ) : selected === "identification" && questions.identification.length > 0 ? (
                                <section id="identification" className="flex w-full flex-col gap-3">
                                    {questions.identification.map((questionProps, index) => (
                                        <Identification key={questionProps.id} index={index} data={questionProps} />
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
