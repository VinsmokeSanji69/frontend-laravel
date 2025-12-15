import { Button } from "@/components/ui/button"
import {
    FieldGroup,
    FieldHeader,
    FieldFooter,
    FieldLegend,
    FieldTitle,
    FieldLabel,
    FieldDescription,
} from "@/components/ui/field"
import { X } from "lucide-react";
import * as React from "react";
import { router } from "@inertiajs/react";

interface ExamData {
    id: number;
    title: string;
    topic: string;
    questionCount: number;
}

interface DuplicateExamProps extends React.ComponentProps<"div"> {
    data: ExamData;
    onSuccess?: () => void;
    onClose?: () => void;
}

export default function DuplicateExam({
                                          data,
                                          onSuccess,
                                          onClose,
                                          ...props
                                      }: DuplicateExamProps) {
    const [isDuplicating, setIsDuplicating] = React.useState(false)

    const handleDuplicate = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        setIsDuplicating(true)

        router.post(`/exam-library/${data.id}/duplicate`, {}, {
            preserveScroll: true,
            preserveState: false,
            onSuccess: () => {
                setIsDuplicating(false)
                onSuccess?.()
                onClose?.()
            },
            onError: (errors) => {
                console.error("Failed to duplicate exam:", errors)
                setIsDuplicating(false)
            },
        })
    }

    const handleClose = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        onClose?.()
    }

    return (
        <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card w-full sm:max-w-lg max-w-md max-h-[90vh] border-2 border-card-foreground rounded-3xl z-50 flex flex-col overflow-hidden shadow-[8px_8px_0_#000000]"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <FieldHeader className="shrink-0 px-4 py-3 border-b-2 flex items-center justify-between">
                <FieldLegend>Duplicate Exam</FieldLegend>
                <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={handleClose}
                    disabled={isDuplicating}
                    className="hover:border-card-foreground bg-card border-2 border-transparent"
                >
                    <X />
                </Button>
            </FieldHeader>

            {/* Scrollable Content */}
            <FieldGroup className="flex-1 overflow-y-auto px-4 py-4 gap-2">
                <FieldLabel className="text-md">Selected Exam</FieldLabel>
                <FieldTitle className="text-lg">{data.title}</FieldTitle>
                <div className="flex flex-col gap-1 mt-2">
                    <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Topic:</span> {data.topic}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Questions:</span> {data.questionCount}
                    </p>
                </div>
                <FieldDescription className="text-md pt-2">
                    This will create a copy of the exam with all its questions. The new exam will be titled "{data.title} (Copy)".
                </FieldDescription>
            </FieldGroup>

            {/* Footer */}
            <FieldFooter className="shrink-0 border-t-2 p-4">
                <Button
                    variant="fit"
                    size="xs"
                    type="button"
                    onClick={handleDuplicate}
                    disabled={isDuplicating}
                    className="transition-all hover:-translate-y-0.5 shadow-[4px_4px_0_#000000] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isDuplicating ? "Duplicating..." : "Duplicate Exam"}
                </Button>
            </FieldFooter>
        </div>
    )
}
