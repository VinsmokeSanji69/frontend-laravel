import * as React from "react"
import { cn } from "@/lib/utils"

interface MultipleChoiceData {
    question: string
    choices: string[]
    answer: string
}

interface MultipleChoiceProps extends React.ComponentProps<"div"> {
    data: MultipleChoiceData
    index: number
}
export function MultipleChoice({ data, className, index, ...props }: MultipleChoiceProps) {
    const letters = ["A", "B", "C", "D"];

    // Helper to strip leading letters like "A.", "A)", etc.
    const stripLeadingLetter = (text: string): string => {
        if (!text) return text;
        return text.replace(/^[A-F][.)]\s*/i, '').trim();
    };

    const cleanedChoices = data.choices.map(choice => stripLeadingLetter(choice));

    // --- FIX: Determine if answer is just a letter ---
    const isLetterAnswer = /^[A-D]$/i.test(data.answer.trim());

    let correctLetter = "";
    let cleanedAnswer = "";

    if (isLetterAnswer) {
        // If answer is "A", "B", "C", or "D"
        correctLetter = data.answer.toUpperCase();
        const index = letters.indexOf(correctLetter);
        cleanedAnswer = cleanedChoices[index] || "";
    } else {
        // Otherwise treat as full text answer
        cleanedAnswer = stripLeadingLetter(data.answer);

        const answerIndex = cleanedChoices.findIndex(choice =>
            choice.toLowerCase().trim() === cleanedAnswer.toLowerCase().trim()
        );

        correctLetter = answerIndex !== -1 ? letters[answerIndex] : "";
    }

    return (
        <div
            data-slot="multiple-choice-layout"
            className={cn(
                "flex w-full flex-col border-2 border-card-foreground rounded-lg gap-2 px-4 py-3 shadow-[6px_6px_0_#000000] transition-all hover:-translate-y-0.5",
                className
            )}
            {...props}
        >
            {/* Question */}
            <p className="font-medium text-lg">{index + 1}. {data.question}</p>

            {/* Choices */}
            <div className="flex flex-col gap-1 text-md text-foreground">
                {cleanedChoices.map((choice, idx) => {
                    const letter = letters[idx];
                    return (
                        <p key={idx}>
                            <span className="font-semibold">{letter}.</span> {choice}
                        </p>
                    );
                })}
            </div>

            {/* Answer */}
            <p className="text-md font-medium">
                Answer: <span className="font-semibold">{correctLetter}. {cleanedAnswer}</span>
            </p>
        </div>
    );
}
