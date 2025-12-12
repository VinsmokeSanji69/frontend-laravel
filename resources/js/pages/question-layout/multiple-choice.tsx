import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { router } from "@inertiajs/react";
import Swal from "sweetalert2";

interface MultipleChoiceData {
    id: number;
    question: string;
    choices: string[];
    answer: string;
}

interface MultipleChoiceProps extends React.ComponentProps<"div"> {
    data: MultipleChoiceData;
    index: number;
    onDelete?: () => void;
}

export function MultipleChoice({ data, className, index, onDelete, ...props }: MultipleChoiceProps) {
    const letters = ["A", "B", "C", "D"];
    const stripLeadingLetter = (text: string) => text?.replace(/^[A-F][.)]\s*/i, '').trim() || '';
    const cleanedChoices = data.choices.map(stripLeadingLetter);

    const isLetterAnswer = /^[A-D]$/i.test(data.answer.trim());
    let correctLetter = "";
    let cleanedAnswer = "";

    if (isLetterAnswer) {
        correctLetter = data.answer.toUpperCase();
        const idx = letters.indexOf(correctLetter);
        cleanedAnswer = cleanedChoices[idx] || "";
    } else {
        cleanedAnswer = stripLeadingLetter(data.answer);
        const answerIndex = cleanedChoices.findIndex(c => c.toLowerCase() === cleanedAnswer.toLowerCase());
        correctLetter = answerIndex !== -1 ? letters[answerIndex] : "";
    }

    const handleDelete = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "This question will be permanently deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/questions/${data.id}`, {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire("Deleted!", "The question has been deleted.", "success");
                        onDelete && onDelete();
                    }
                });
            }
        });
    };

    return (
        <div
            className={cn("flex w-full flex-col border-2 border-card-foreground rounded-lg gap-2 px-4 py-3 shadow-[6px_6px_0_#000000] transition-all hover:-translate-y-0.5", className)}
            {...props}
        >
            <div className="flex justify-between items-start">
                <p className="font-medium text-lg">{index + 1}. {data.question}</p>
                <button onClick={handleDelete} className="text-red-600 hover:text-red-800">
                    <X size={18} />
                </button>
            </div>

            <div className="flex flex-col gap-1 text-md text-foreground">
                {cleanedChoices.map((choice, idx) => (
                    <p key={idx}>
                        <span className="font-semibold">{letters[idx]}.</span> {choice}
                    </p>
                ))}
            </div>

            <p className="text-md font-medium">
                Answer: <span className="font-semibold">{correctLetter}. {cleanedAnswer}</span>
            </p>
        </div>
    );
}
