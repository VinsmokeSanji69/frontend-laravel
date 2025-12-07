import * as React from "react"
import { cn } from "@/lib/utils"
import {Check, Pencil, X} from "lucide-react";

interface ExamCardProps extends React.ComponentProps<"div"> {
    data? : any
    index : number
}

export function ExamCard({
                             data,
                             index,
                             className,
                             ...props
                         }: ExamCardProps) {

    function getColor(index: number) {
        const colors = [
            "bg-accent-blue",
            "bg-accent-green",
            "bg-accent-yellow",
            "bg-accent-red",
            "bg-accent-violet"
        ];

        // Use modulo to cycle through the colors
        const color = colors[index % colors.length];

        return color;
    }

    return (
        <div
            data-slot="exam-card"
            className={cn(
                "flex flex-col w-full border-2 border-card-foreground rounded-md gap-1 px-3 py-2",
                getColor(index),
                className
            )}
            {...props}
        >
            <div className="flex flex-row w-full gap-3 items-center">
                <h1 className="text-2xl font-medium">{data.title}</h1>
            </div>
            <div className="flex flex-col gap-1">
                <div className="flex flex-row w-fit space-x-1">
                    <p className="text-md font-medium text-foreground">{data.questionCount} Questions</p>
                </div>
                <div className="flex flex-row w-fit space-x-1 border-2 border-card-foreground bg-background rounded-sm px-2">
                    <p className="text-md font-medium text-foreground">{data.topic}</p>
                </div>
            </div>
        </div>
    )
}
