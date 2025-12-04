import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { cn } from "@/lib/utils"
import { toggleVariants } from "@/components/ui/toggle"
import { VariantProps } from "class-variance-authority"

const ToggleGroupContext = React.createContext<
    VariantProps<typeof toggleVariants>
>({
    variant: "default",
})

function ToggleGroup({
                         className,
                         variant,
                         children,
                         ...props
                     }: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleVariants>) {
    return (
        <ToggleGroupPrimitive.Root
            data-slot="toggle-group"
            data-variant={variant}
            className={cn(
                "group/toggle-group flex flex-wrap items-center rounded-md data-[variant=outline]:shadow-xs gap-2",
                className
            )}
            {...props}
        >
            <ToggleGroupContext.Provider value={{ variant }}>
                {children}
            </ToggleGroupContext.Provider>
        </ToggleGroupPrimitive.Root>
    )
}

function ToggleGroupItem({
                             className,
                             children,
                             color,
                             ...props
                         }: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants>) {

    return (
        <ToggleGroupPrimitive.Item
            data-slot="toggle-group-item"
            className={cn(
                "px-4 py-1.5 text-md rounded-md border-2 border-card-foreground transition cursor-pointer data-[state=off]:bg-transparent text-foreground",
                color === "blue" && "data-[state=on]:bg-accent-blue",
                color === "green" && "data-[state=on]:bg-accent-green",
                color === "red" && "data-[state=on]:bg-accent-red",
                color === "violet" && "data-[state=on]:bg-accent-violet",
                color === "yellow" && "data-[state=on]:bg-accent-yellow",
                className
            )}
            {...props}
        >
            {children}
        </ToggleGroupPrimitive.Item>
    )
}

export { ToggleGroup, ToggleGroupItem }
