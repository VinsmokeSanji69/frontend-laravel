import * as React from "react";
import { cn } from "@/lib/utils";
import { Trash } from "lucide-react";
import { router } from "@inertiajs/react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import GenerateExamForm from "@/pages/form/generate-exam-form";
import {useState} from "react";
import DeleteQuestion from "@/pages/form/delete-question";
import {createPortal} from "react-dom";

interface IdentificationData {
    id: number;
    question: string;
    answer: string;
}
interface IdentificationProps extends React.ComponentProps<"div"> {
    data: IdentificationData;
    index: number;
    onDelete?: () => void;
}

export function Identification({
                                   data,
                                   className,
                                   index,
                                   onDelete,
                                   ...props
                               }: IdentificationProps) {
    const [showForm, setShowForm] = useState(false);

    const handleDelete = () => {
        setShowForm(true);
    };

    return (
        <div
            className={cn(
                "group flex w-full flex-col border-2 border-card-foreground rounded-lg gap-2 px-4 py-3 shadow-[6px_6px_0_#000000] transition-all hover:-translate-y-0.5 hover:bg-muted/40",
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

            <p className="text-md font-medium">
                Answer: <span className="font-semibold">{data.answer}</span>
            </p>
        </div>
    );
}
