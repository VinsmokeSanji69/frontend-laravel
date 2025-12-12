import { Button } from "@/components/ui/button"
import {
    Field, FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldHeader,
    FieldSet, FieldFooter, FieldLegend, FieldSeparator,
} from "@/components/ui/field"
import {Plus, X} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import FileUpload from "@/components/file-upload";
import ToggleRadioGroup from "@/components/ui/radio-group";
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {Input} from "@/components/ui/input";
import InputNumber from "@/components/ui/input-number";

type Option = {
    id: string;
    label: string;
    color?: "blue" | "green" | "red" | "violet" | "yellow";
};
type QuestionTypeOption = "Multiple Choice" | "True or False" | "Identification";

export default function GenerateExamForm() {
    const [difficulty, setDifficulty] = useState<string>('moderate');
    const [questionTypes, setQuestionTypes] = useState<string[]>(['multipleChoice']);
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string>('');

    const options: QuestionTypeOption[] = ["Multiple Choice", "True or False", "Identification"];
    const [selected, setSelected] = useState<QuestionTypeOption[]>([]);

    const handleSelect = (option: QuestionTypeOption) => {
        if (!selected.includes(option)) {
            setSelected([...selected, option]);
        }
    };

    const handleRemove = (option: QuestionTypeOption) => {
        setSelected(selected.filter((o) => o !== option));
    };

    const difficultyOptions: Option[] = [
        { id: "easy", label: "Easy", color: "green" },
        { id: "moderate", label: "Moderate", color: "yellow" },
        { id: "hard", label: "Hard", color: "red" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!file) {
            setError('Please upload a PDF file');
            return;
        }

        if (questionTypes.length === 0) {
            setError('Please select at least one question type');
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('difficulty', difficulty);
        formData.append('num_questions', '10');

        // Send question types as array
        questionTypes.forEach((type, index) => {
            formData.append(`question_types[${index}]`, type);
        });

        try {
            router.post('/exam-generator/generate', formData, {
                forceFormData: true,
                onSuccess: () => {
                    console.log('Exam generated successfully!');
                    // Don't set isSubmitting to false here - page will redirect
                },
                onError: (errors: any) => {
                    console.error('Generation failed:', errors);

                    // Handle different error formats
                    if (errors.general) {
                        setError(errors.general);
                    } else if (errors.message) {
                        setError(errors.message);
                    } else if (errors.file) {
                        setError(Array.isArray(errors.file) ? errors.file[0] : errors.file);
                    } else if (typeof errors === 'string') {
                        setError(errors);
                    } else {
                        setError('Failed to generate exam. Please try again.');
                    }

                    setIsSubmitting(false);
                },
                onFinish: () => {
                    // Only executed after both success and error callbacks
                    // Don't set isSubmitting here to prevent flickering
                }
            });
        } catch (err) {
            console.error('Submit error:', err);
            setError('An error occurred while generating the exam');
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        window.history.back();
    };

    return (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card w-full sm:max-w-lg max-w-md h-md border-2 border-card-foreground rounded-3xl z-10">
            <form onSubmit={handleSubmit} className="h-md">
                <FieldGroup>
                    <FieldSet>
                        <FieldHeader>
                            <FieldLegend>Generate Exam</FieldLegend>
                            <Button
                                variant="ghost"
                                size="sm"
                                type="button"
                                onClick={handleClose}
                                className="hover:border-card-foreground bg-card border-2 border-transparent"
                            >
                                <X />
                            </Button>
                        </FieldHeader>
                        <FieldContent>
                            <Field>
                                <FieldLabel htmlFor="question-types">
                                    Question Types
                                </FieldLabel>
                                <div className="w-full grid grid-cols-3 gap-2">
                                    {options
                                        .filter((option) => !selected.includes(option))
                                        .map((option) => (
                                            <p
                                                key={option}
                                                className="text-md font-medium text-foreground px-4 py-1.5 rounded-md border-2 border-card-foreground shadow-[4px_4px_0_#000000] cursor-pointer transition-transform"
                                                onClick={() => handleSelect(option)}
                                            >
                                                {option}
                                            </p>
                                        ))}
                                </div>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="difficulty">
                                    Selected
                                </FieldLabel>
                                <div className="flex flex-col w-full text-left px-2 gap-4">
                                    {selected.map((option) => (
                                        <div key={option} className="flex flex-col gap-2 border-b-2 pb-2 gap-3">
                                            <div className="flex items-center gap-2 w-fit">
                                                <p className="bg-accent-blue text-md font-medium text-foreground px-4 py-1.5 rounded-md border-2 border-card-foreground shadow-[4px_4px_0_#000000] cursor-pointer">
                                                    {option}
                                                </p>
                                                <Button
                                                    variant="fit"
                                                    size="xs"
                                                    type="button"
                                                    className="transition-all shadow-[4px_4px_0_#000000]"
                                                    onClick={() => handleRemove(option)}
                                                >
                                                    <X />
                                                </Button>
                                            </div>

                                            {/* Difficulty Inputs */}
                                            <div className="flex flex-col gap-2">
                                                <FieldLabel htmlFor="difficulty"> Difficulty </FieldLabel>
                                                <div className="w-full grid grid-cols-3 gap-2">
                                                    <div className="flex flex-col gap-1">
                                                        <InputNumber label="Easy" />
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <InputNumber label="Moderate" />
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <InputNumber label="Hard" />
                                                    </div>
                                                </div>
                                                <FieldDescription className="ml-2">Define the difficulty ranges for the question type.</FieldDescription>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="file-upload">
                                    Exam Source
                                </FieldLabel>
                                <FileUpload
                                    onFileSelect={setFile}
                                    accept=".pdf"
                                    maxSize={10}
                                    value={file}
                                    disabled={isSubmitting}
                                />
                            </Field>
                        </FieldContent>
                    </FieldSet>
                    <FieldFooter>
                        <Button
                            variant="fit"
                            size="xs"
                            type="submit"
                            disabled={isSubmitting || !file}
                            className="transition-all hover:-translate-y-0.5 shadow-[4px_4px_0_#000000] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Generating Exam...' : 'Generate'}
                        </Button>
                    </FieldFooter>
                </FieldGroup>
            </form>
        </div>
    );
}
