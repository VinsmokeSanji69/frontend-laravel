import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                "bg-white file:text-foreground placeholder:text-muted-foreground selection:text-primary-foreground h-9 w-full min-w-0 border-2 border-card-foreground rounded-md px-3 py-4 text-base shadow-xs outline-none",
                className
            )}
            {...props}
        />
    );
}

export { Input };
