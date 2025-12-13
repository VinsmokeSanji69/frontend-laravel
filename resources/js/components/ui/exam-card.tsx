import * as React from "react"
import { cn } from "@/lib/utils"
import { MoreVertical, Copy, Trash } from "lucide-react"

interface ExamCardProps extends React.ComponentProps<"div"> {
    data?: any
    index: number
    onDuplicate?: () => void
    onDelete?: () => void
}

export function ExamCard({
                             data,
                             index,
                             className,
                             onDuplicate,
                             onDelete,
                             ...props
                         }: ExamCardProps) {
    const [open, setOpen] = React.useState(false)

    function getColor(index: number) {
        const colors = [
            "bg-accent-blue",
            "bg-accent-green",
            "bg-accent-yellow",
            "bg-accent-red",
            "bg-accent-violet",
        ]
        return colors[index % colors.length]
    }

    return (
        <div
            data-slot="exam-card"
            onMouseLeave={() => setOpen(false)}
            className={cn(
                "group relative flex flex-col w-full border-2 border-card-foreground rounded-md gap-1 px-3 py-2 shadow-[6px_6px_0_#000000] transition-all hover:-translate-y-0.5",
                getColor(index),
                className
            )}
            {...props}
        >
            {/* Header */}
            <div className="flex flex-row w-full gap-3 items-center">
                <h1 className="text-2xl font-medium overflow-hidden whitespace-nowrap text-ellipsis w-full">
                    {data.title}
                </h1>

                {/* 3-dot button (appears on hover) */}
                <button
                    type="button"
                    // Add data attribute to allow event stopping in parent
                    data-action="card-action"
                    onClick={(e) => {
                        e.stopPropagation()
                        setOpen((v) => !v)
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md border-2 border-card-foreground bg-background shadow-[3px_3px_0_#000000]"
                >
                    <MoreVertical className="h-4 w-4" />
                </button>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1">
                <p className="text-md font-medium text-foreground">
                    {data.questionCount} Questions
                </p>

                <div className="flex w-fit border-2 border-card-foreground bg-background rounded-sm px-2">
                    <p className="text-md font-medium text-foreground">{data.topic}</p>
                </div>
            </div>

            {/* Dropdown */}
            {open && (
                <div
                    className="absolute right-2 top-11 z-10 w-36 border-2 border-card-foreground bg-background rounded-md shadow-[4px_4px_0_#000000]"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        // Add data attribute
                        data-action="card-action"
                        className="flex w-full items-center gap-2 px-3 py-2 text-md font-medium hover:bg-muted rounded-t-md"
                        onClick={() => {
                            setOpen(false)
                            onDuplicate?.()
                        }}
                    >
                        <Copy className="h-4 w-4" />
                        Duplicate
                    </button>

                    <button
                        // Add data attribute
                        data-action="card-action"
                        className="flex w-full items-center gap-2 px-3 py-2 text-md font-medium hover:bg-red-100 text-red-600 rounded-b-md"
                        onClick={() => {
                            setOpen(false)
                            onDelete?.()
                        }}
                    >
                        <Trash className="h-4 w-4" />
                        Delete
                    </button>
                </div>
            )}
        </div>
    )
}
