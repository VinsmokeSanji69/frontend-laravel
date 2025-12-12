import { Button } from "@/components/ui/button"
import {
    Field, FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldHeader,
    FieldSet, FieldFooter, FieldLegend,
} from "@/components/ui/field"
import {X} from "lucide-react";
import FileUpload from "@/components/file-upload";
import { router } from '@inertiajs/react';
import { useState } from 'react';
import {Input} from "@/components/ui/input";
import InputNumber from "@/components/ui/input-number";

type QuestionTypeOption = "Multiple Choice" | "True or False" | "Identification";

type SelectedQuestionType = {
    type: QuestionTypeOption;
    difficulties: {
        easy: number;
        moderate: number;
        hard: number;
    };
};

export default function GenerateExamForm() {
    const [file, setFile] = useState<File | null>(null);
    const [topic, setTopic] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string>('');

    const options: QuestionTypeOption[] = ["Multiple Choice", "True or False", "Identification"];
    const [selected, setSelected] = useState<SelectedQuestionType[]>([]);

    const handleSelect = (option: QuestionTypeOption) => {
        if (!selected.find(s => s.type === option)) {
            setSelected([...selected, {
                type: option,
                difficulties: {
                    easy: 0,
                    moderate: 0,
                    hard: 0
                }
            }]);
        }
    };

    const handleRemove = (option: QuestionTypeOption) => {
        setSelected(selected.filter((s) => s.type !== option));
    };

    const handleDifficultyChange = (type: QuestionTypeOption, difficulty: 'easy' | 'moderate' | 'hard', value: number | React.ChangeEvent<HTMLInputElement>) => {
        // Handle both number and event types
        const numValue = typeof value === 'number' ? value : parseInt(value.target.value) || 0;

        setSelected(selected.map(s => {
            if (s.type === type) {
                return {
                    ...s,
                    difficulties: {
                        ...s.difficulties,
                        [difficulty]: Math.max(0, numValue)
                    }
                };
            }
            return s;
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!file && !topic.trim()) {
            setError('Please upload a PDF file or provide a topic');
            return;
        }

        if (selected.length === 0) {
            setError('Please select at least one question type');
            return;
        }

        // Validate at least one difficulty has a value
        const hasQuestions = selected.some(s =>
            s.difficulties.easy > 0 || s.difficulties.moderate > 0 || s.difficulties.hard > 0
        );

        if (!hasQuestions) {
            setError('Please specify at least one question with a difficulty level');
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();

        if (file) {
            formData.append('file', file);
        }

        if (topic.trim()) {
            formData.append('topic', topic.trim());
        }

        // Send question types with their difficulty configurations
        selected.forEach((item, index) => {
            formData.append(`question_types[${index}][type]`, item.type);
            formData.append(`question_types[${index}][difficulties][easy]`, item.difficulties.easy.toString());
            formData.append(`question_types[${index}][difficulties][moderate]`, item.difficulties.moderate.toString());
            formData.append(`question_types[${index}][difficulties][hard]`, item.difficulties.hard.toString());
        });

        try {
            router.post('/exam-generator/generate', formData, {
                forceFormData: true,
                onSuccess: () => {
                    console.log('Exam generated successfully!');
                },
                onError: (errors: any) => {
                    console.error('Generation failed:', errors);

                    if (errors.general) {
                        setError(errors.general);
                    } else if (errors.message) {
                        setError(errors.message);
                    } else if (errors.file) {
                        setError(Array.isArray(errors.file) ? errors.file[0] : errors.file);
                    } else if (errors.topic) {
                        setError(Array.isArray(errors.topic) ? errors.topic[0] : errors.topic);
                    } else if (typeof errors === 'string') {
                        setError(errors);
                    } else {
                        setError('Failed to generate exam. Please try again.');
                    }

                    setIsSubmitting(false);
                },
            });
        } catch (err) {
            console.error('Submit error:', err);
            setError('An error occurred while generating the exam');
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        router.visit('/');
    };

    const getTotalQuestions = (item: SelectedQuestionType) => {
        return item.difficulties.easy + item.difficulties.moderate + item.difficulties.hard;
    };

    return (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card w-full sm:max-w-lg max-w-md max-h-[90vh] border-2 border-card-foreground rounded-3xl z-10 overflow-hidden">
            <div className="flex flex-col h-full">
                <FieldGroup className="flex-1 overflow-y-auto">
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
                            {error && (
                                <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-4">
                                    {error}
                                </div>
                            )}

                            <Field>
                                <FieldLabel htmlFor="topic">
                                    Topic (Optional)
                                </FieldLabel>
                                <Input
                                    id="topic"
                                    type="text"
                                    placeholder="Enter a topic (e.g., Photosynthesis, World War II)"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    disabled={isSubmitting}
                                    className="w-full"
                                />
                                <FieldDescription>
                                    Provide a topic to generate questions about, or upload a PDF below
                                </FieldDescription>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="file-upload">
                                    Exam Source (Optional)
                                </FieldLabel>
                                <FileUpload
                                    onFileSelect={setFile}
                                    accept=".pdf"
                                    maxSize={10}
                                    value={file}
                                    disabled={isSubmitting}
                                />
                                <FieldDescription>
                                    Upload a PDF to generate questions from its content
                                </FieldDescription>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="question-types">
                                    Question Types
                                </FieldLabel>
                                <div className="w-full grid grid-cols-3 gap-2">
                                    {options
                                        .filter((option) => !selected.find(s => s.type === option))
                                        .map((option) => (
                                            <p
                                                key={option}
                                                className="text-sm font-medium text-foreground px-3 py-2 rounded-md border-2 border-card-foreground shadow-[4px_4px_0_#000000] cursor-pointer transition-transform hover:translate-y-[-2px]"
                                                onClick={() => handleSelect(option)}
                                            >
                                                {option}
                                            </p>
                                        ))}
                                </div>
                            </Field>

                            <Field>
                                <FieldLabel>
                                    Selected Question Types
                                </FieldLabel>
                                <div className="flex flex-col w-full text-left px-2 gap-4">
                                    {selected.length === 0 ? (
                                        <p className="text-sm text-muted-foreground text-center py-4">
                                            No question types selected yet
                                        </p>
                                    ) : (
                                        selected.map((item) => (
                                            <div key={item.type} className="flex flex-col gap-2 border-b-2 pb-4">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="bg-accent-blue text-sm font-medium text-foreground px-4 py-1.5 rounded-md border-2 border-card-foreground shadow-[4px_4px_0_#000000]">
                                                        {item.type}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-muted-foreground">
                                                            Total: {getTotalQuestions(item)}
                                                        </span>
                                                        <Button
                                                            variant="fit"
                                                            size="xs"
                                                            type="button"
                                                            className="transition-all shadow-[4px_4px_0_#000000]"
                                                            onClick={() => handleRemove(item.type)}
                                                        >
                                                            <X />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-2 mt-2">
                                                    <FieldLabel className="text-xs">Difficulty Distribution</FieldLabel>
                                                    <div className="w-full grid grid-cols-3 gap-2">
                                                        <div className="flex flex-col gap-1">
                                                            <InputNumber
                                                                label="Easy"
                                                                value={item.difficulties.easy}
                                                                onChange={(val) => handleDifficultyChange(item.type, 'easy', val)}
                                                            />
                                                        </div>
                                                        <div className="flex flex-col gap-1">
                                                            <InputNumber
                                                                label="Moderate"
                                                                value={item.difficulties.moderate}
                                                                onChange={(val) => handleDifficultyChange(item.type, 'moderate', val)}
                                                            />
                                                        </div>
                                                        <div className="flex flex-col gap-1">
                                                            <InputNumber
                                                                label="Hard"
                                                                value={item.difficulties.hard}
                                                                onChange={(val) => handleDifficultyChange(item.type, 'hard', val)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <FieldDescription className="ml-2 text-xs">
                                                        Specify how many questions at each difficulty level
                                                    </FieldDescription>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </Field>
                        </FieldContent>
                    </FieldSet>
                </FieldGroup>
                <FieldFooter className="border-t-2 p-4">
                    <Button
                        variant="fit"
                        size="xs"
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting || (!file && !topic.trim()) || selected.length === 0}
                        className="transition-all hover:-translate-y-0.5 shadow-[4px_4px_0_#000000] disabled:opacity-50 disabled:cursor-not-allowed w-full"
                    >
                        {isSubmitting ? 'Generating Exam...' : 'Generate'}
                    </Button>
                </FieldFooter>
            </div>
        </div>
    );
}
