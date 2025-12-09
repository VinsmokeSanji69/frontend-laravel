import { Button } from "@/components/ui/button"
import {
    Field, FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldHeader,
    FieldSet, FieldFooter, FieldLegend,
} from "@/components/ui/field"
import { X } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import FileUpload from "@/components/file-upload";
import ToggleRadioGroup from "@/components/ui/radio-group";
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

type Option = {
    id: string;
    label: string;
    color?: "blue" | "green" | "red" | "violet" | "yellow";
};

export default function GenerateExamForm() {
    const [difficulty, setDifficulty] = useState<string>('moderate');
    const [questionTypes, setQuestionTypes] = useState<string[]>(['multipleChoice']);
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string>('');

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
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card w-full sm:max-w-lg max-w-md h-fit border-2 border-card-foreground rounded-3xl z-10">
            <form onSubmit={handleSubmit}>
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
                                disabled={isSubmitting}
                            >
                                <X />
                            </Button>
                        </FieldHeader>
                        <FieldContent>
                            <Field>
                                <FieldLabel htmlFor="difficulty">
                                    Difficulty
                                </FieldLabel>
                                <ToggleRadioGroup
                                    options={difficultyOptions}
                                    value={difficulty}
                                    onValueChange={setDifficulty}
                                    disabled={isSubmitting}
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="question-types">
                                    Question Types
                                </FieldLabel>
                                <ToggleGroup
                                    type="multiple"
                                    variant="outline"
                                    value={questionTypes}
                                    onValueChange={(value) => {
                                        if (value.length > 0) {
                                            setQuestionTypes(value);
                                        }
                                    }}
                                    disabled={isSubmitting}
                                >
                                    <ToggleGroupItem value="multipleChoice" color="blue">
                                        Multiple Choice
                                    </ToggleGroupItem>
                                    <ToggleGroupItem value="trueOrFalse" color="green">
                                        True or False
                                    </ToggleGroupItem>
                                    <ToggleGroupItem value="identification" color="red">
                                        Identification
                                    </ToggleGroupItem>
                                </ToggleGroup>
                                <FieldDescription className="mt-2 text-xs text-secondary-foreground text-left">
                                    Select one or more question types
                                </FieldDescription>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="file-upload">
                                    Upload Material
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
