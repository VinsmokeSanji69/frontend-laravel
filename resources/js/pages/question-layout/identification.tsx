import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { router } from "@inertiajs/react";
import Swal from "sweetalert2";

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

export function Identification({ data, className, index, onDelete, ...props }: IdentificationProps) {
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
            data-slot="identification-layout"
            className={cn(
                "flex w-full flex-col border-2 border-card-foreground rounded-lg gap-2 px-4 py-3 hover:bg-muted/40 shadow-[6px_6px_0_#000000] transition-all hover:-translate-y-0.5",
                className
            )}
            {...props}
        >
            <div className="flex justify-between items-start">
                <p className="font-medium text-lg">{index + 1}. {data.question}</p>
                <button onClick={handleDelete} className="text-red-600 hover:text-red-800">
                    <X size={18} />
                </button>
            </div>

            <p className="text-md font-medium">
                Answer: <span className="font-semibold">{data.answer}</span>
            </p>
        </div>
    );
}
