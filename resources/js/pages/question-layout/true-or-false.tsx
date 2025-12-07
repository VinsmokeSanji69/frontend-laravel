import * as React from "react"
import { cn } from "@/lib/utils"

interface TrueOrFalseData {
    question: string
    answer: string
}

interface TrueOrFalseProps extends React.ComponentProps<"div"> {
    data: TrueOrFalseData
    index: number
}

export function TrueOrFalse({ data, className, index, ...props }: TrueOrFalseProps) {

    return (
        <div
            data-slot="true-or-false-layout"
            className={cn(
                "flex w-full flex-col border-2 border-card-foreground rounded-lg gap-2 px-4 py-3 hover:bg-muted/40 shadow-[6px_6px_0_#000000] transition-all hover:-translate-y-0.5",
                className
            )}
            {...props}
        >
            {/* Question */}
            <p className="font-medium text-lg">{index+1}. {data.question}</p>

            {/* Answer */}
            <p className="text-md font-medium">
                Answer: <span className="font-semibold">{data.answer}</span>
            </p>
        </div>
    )
}
