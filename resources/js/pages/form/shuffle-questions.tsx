import { Button } from "@/components/ui/button"
import {
    FieldGroup,
    FieldHeader,
    FieldFooter, FieldLegend, FieldTitle, FieldLabel, FieldDescription,
} from "@/components/ui/field"
import { X } from "lucide-react";


export default function ShuffleQuestions() {

    return (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card w-full sm:max-w-lg max-w-md max-h-[90vh] border-2 border-card-foreground rounded-3xl z-10 flex flex-col overflow-hidden">
            {/* Header */}
            <FieldHeader className="shrink-0 px-4 py-3 border-b-2 flex items-center justify-between">
                <FieldLegend>Shuffle Exam Questions</FieldLegend>
                <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    // onClick={}
                    className="hover:border-card-foreground bg-card border-2 border-transparent"
                >
                    <X />
                </Button>
            </FieldHeader>

            {/* Scrollable Content */}
            <FieldGroup className="flex-1 overflow-y-auto px-4 py-4">
                <FieldLabel className="text-lg">Randomize Order</FieldLabel>
                <FieldDescription className="text-md">
                    Randomizes the order of all questions in this exam. This helps reduce pattern bias and improve exam integrity.
                </FieldDescription>
            </FieldGroup>

            {/* Footer */}
            <FieldFooter className="shrink-0 border-t-2 p-4">
                <Button
                    variant="fit"
                    size="xs"
                    type="button"
                    // onClick={}
                    className="transition-all hover:-translate-y-0.5 shadow-[4px_4px_0_#000000] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Confirm
                </Button>
            </FieldFooter>
        </div>
    );
}
