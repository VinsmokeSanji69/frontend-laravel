import * as React from "react";
import { cn } from "@/lib/utils";
import {Trash, X} from "lucide-react";
import { router } from "@inertiajs/react";
import Swal from "sweetalert2";
import {useState} from "react";
import { createPortal } from "react-dom";
import DeleteQuestion from "@/pages/form/delete-question";

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

export function MultipleChoice({
                                   data,
                                   className,
                                   index,
                                   onDelete,
                                   ...props
                               }: MultipleChoiceProps) {
    const letters = ["A", "B", "C", "D"];
    const [showForm, setShowForm] = useState(false);

    const stripLeadingLetter = (text: string) =>
        text?.replace(/^[A-F][.)]\s*/i, "").trim() || "";

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
        const answerIndex = cleanedChoices.findIndex(
            (c) => c.toLowerCase() === cleanedAnswer.toLowerCase()
        );
        correctLetter = answerIndex !== -1 ? letters[answerIndex] : "";
    }

    const handleDelete = () => {
        setShowForm(true);
    };

    return (
        <div
            className={cn(
                "group flex w-full flex-col border-2 border-card-foreground rounded-lg gap-2 px-4 py-3 shadow-[6px_6px_0_#000000] transition-all hover:-translate-y-0.5",
                className
            )}
            {...props}
        >
            <div className="flex justify-between items-start">
                <p className="font-medium text-lg">
                    {index + 1}. {data.question}
                </p>

                {/* Trash button — appears on hover */}
                <button
                    type="button"
                    onClick={handleDelete}
                    className="opacity-0 group-hover:opacity-100 transition-opacity
                               border-2 border-card-foreground bg-background
                               p-1 rounded-md shadow-[3px_3px_0_#000000]"
                >
                    <Trash className="h-4 w-4 text-red-600" />
                </button>
            </div>

            {showForm &&
                createPortal(
                    <>
                        <div
                            className="fixed inset-0 bg-black/60 z-50"
                            onClick={() => setShowForm(false)}
                        />
                        <DeleteQuestion data={data} index={index} onDelete={onDelete} onClose={() => setShowForm(false)}/>
                    </>,
                    document.body
                )}

            <div className="flex flex-col gap-1 text-md text-foreground">
                {cleanedChoices.map((choice, idx) => (
                    <p key={idx}>
                        <span className="font-semibold">{letters[idx]}.</span>{" "}
                        {choice}
                    </p>
                ))}
            </div>

            <p className="text-md font-medium">
                Answer:{" "}
                <span className="font-semibold">
                    {correctLetter}. {cleanedAnswer}
                </span>
            </p>
        </div>
    );
}
