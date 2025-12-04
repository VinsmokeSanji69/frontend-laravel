import {useState, useEffect} from "react";

type Option = {
    id: string;
    label: string;
    color?: "blue" | "green" | "red" | "violet" | "yellow";
};

interface ToggleRadioGroupProps {
    options: Option[];
    value?: string;
    onValueChange?: (value: string) => void;
}

interface RadioButtonProps {
    option: {
        id: string;
        label: string;
        color?: string;
    },
    isSelected: boolean,
    onSelect: (id: string) => void,
    className?: string,
}

function RadioButton({option, isSelected, onSelect, className}: RadioButtonProps) {
    const baseClasses =
        "px-4 py-1.5 text-md rounded-md border-2 border-card-foreground text-foreground transition-colors";

    const colorClass = option.color === "blue"
        ? "bg-accent-blue hover:bg-accent-blue"
        : option.color === "green"
            ? "bg-accent-green hover:bg-accent-green"
            : option.color === "red"
                ? "bg-accent-red hover:bg-accent-red"
                : option.color === "violet"
                    ? "bg-accent-violet hover:bg-accent-violet"
                    : option.color === "yellow"
                        ? "bg-accent-yellow hover:bg-accent-yellow"
                        : "";

    const unselectedClasses = "bg-transparent hover:bg-gray-100";

    return (
        <button
            type="button"
            onClick={() => onSelect(option.id)}
            className={[
                baseClasses,
                isSelected ? colorClass : unselectedClasses,
                className
            ].join(" ")}
        >
            {option.label}
        </button>
    );
}

export default function ToggleRadioGroup({
                                             options,
                                             value,
                                             onValueChange
                                         }: ToggleRadioGroupProps) {

    // Default selected = first option
    const getInitial = () => value || options[0]?.id || "";

    const [selected, setSelected] = useState<string>(getInitial());

    // sync with external changes
    useEffect(() => {
        if (value !== undefined) {
            setSelected(value);
        }
    }, [value]);

    const handleSelect = (id: string) => {
        setSelected(id);
        onValueChange?.(id);
    };

    return (
        <div className="flex gap-2">
            {options.map((option) => (
                <RadioButton
                    key={option.id}
                    option={option}
                    isSelected={selected === option.id}
                    onSelect={handleSelect}
                />
            ))}
        </div>
    );
}

export {RadioButton, ToggleRadioGroup};
