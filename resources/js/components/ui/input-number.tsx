import { useState } from "react";
import { Input } from "@/components/ui/input";

interface InputNumberProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export default function InputNumber({ label, ...props }: InputNumberProps) {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(0); // current number

    return (
        <div className="flex flex-col w-full gap-1">
            {!editing ? (
                <div
                    className="shadow-[4px_4px_0_#000000] font-medium bg-white text-foreground h-9 w-full border-2 border-card-foreground rounded-md px-3 flex items-center cursor-pointer"
                    onClick={() => setEditing(true)}
                >
                    <p className="my-auto"> {label}{value !== 0 ? ` (${value})` : ""}</p>
                </div>
            ) : (
                <Input
                    type="number"
                    value={value}
                    autoFocus
                    min={0}
                    max={10}
                    className="shadow-[4px_4px_0_#000000]"
                    onChange={(e) => setValue(Number(e.target.value))}
                    onBlur={() => setEditing(false)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") setEditing(false);
                    }}
                    {...props}
                />
            )}
        </div>
    );
}
