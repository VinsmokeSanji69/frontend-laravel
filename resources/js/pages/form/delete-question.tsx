import { Button } from "@/components/ui/button"
import {
    FieldGroup,
    FieldHeader,
    FieldFooter, FieldLegend, FieldTitle, FieldLabel, FieldDescription,
} from "@/components/ui/field"
import { X } from "lucide-react";
import * as React from "react";
import {router} from "@inertiajs/react";


interface MultipleChoiceData {
    id: number;
    question: string;
    choices: string[];
    answer: string;
}
interface TrueOrFalseData {
    id: number;
    question: string;
    answer: string;
}
interface IdentificationData {
    id: number;
    question: string;
    answer: string;
}
interface DeleteQuestionProps extends React.ComponentProps<"div"> {
    data: MultipleChoiceData | TrueOrFalseData | IdentificationData;
    index: number;
    onDelete?: () => void;
    onClose?: () => void;
}
export default function DeleteQuestion({
                                           data,
                                           index,
                                           onDelete,
                                           onClose,
                                           ...props
                                       }: DeleteQuestionProps) {
    const handleDelete = () => {
        router.delete(`/questions/${data.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                onDelete?.();
            },
            onError: (errors) => {
                console.error("Failed to delete question:", errors);
            },
        });
    };



    return (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card w-full sm:max-w-lg max-w-md max-h-[90vh] border-2 border-card-foreground rounded-3xl z-50 flex flex-col overflow-hidden">
            {/* Header */}
            <FieldHeader className="shrink-0 px-4 py-3 border-b-2 flex items-center justify-between">
                <FieldLegend>Delete Question</FieldLegend>
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
                <FieldLabel className="text-md">Selected Question</FieldLabel>
                <FieldTitle className="text-lg">{index + 1}. {data.question}</FieldTitle>
                <FieldDescription className="text-md pt-2">
                    This action will permanently remove the selected question from the exam. This cannot be undone.
                </FieldDescription>
            </FieldGroup>

            {/* Footer */}
            <FieldFooter className="shrink-0 border-t-2 p-4">
                <Button
                    variant="fit"
                    size="xs"
                    type="button"
                    onClick={handleDelete}
                    className="transition-all hover:-translate-y-0.5 shadow-[4px_4px_0_#000000] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Confirm
                </Button>
            </FieldFooter>
        </div>
    );
}
