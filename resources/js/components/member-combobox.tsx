"use client"

import * as React from "react"
import {CheckIcon, ChevronsUpDownIcon} from "lucide-react"

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export interface MemberComboboxProps {
    value: string
    onValueChange: (id: string) => void
    invalid?: boolean
}

export function MemberCombobox({ value, onValueChange, invalid }: MemberComboboxProps) {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState("") // current typed search
    const [members, setMembers] = React.useState<{ id: string; name: string }[]>([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        async function loadMembers() {
            try {
                const res = await fetch("/api/members")
                const data = await res.json()
                setMembers(data) // must be [{id, name}, ...]
            } catch (err) {
                console.error("Failed to load members", err)
            } finally {
                setLoading(false)
            }
        }

        loadMembers()
    }, [])

    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    data-invalid={invalid}
                    className={cn(
                        "w-full justify-between font-normal",
                        invalid && "border-destructive text-foreground"
                    )}
                >
                    {value
                        ? members.find((member) => String(member.id) === value)?.name
                        : "Select member"}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput
                        placeholder="Search member"
                        value={search}
                        onValueChange={(val) => setSearch(val)}
                    />
                    <CommandList>
                        {filteredMembers.length === 0 && <CommandEmpty>No member found.</CommandEmpty>}
                        <CommandGroup>
                            {filteredMembers.map((member) => (
                                <CommandItem
                                    key={member.id}
                                    value={member.name}
                                    onSelect={() => {
                                        onValueChange(String(member.id)) // store the id internally
                                        setOpen(false)
                                        setSearch("") // clear search if you want
                                    }}
                                >
                                    <CheckIcon
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === String(member.id) ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {member.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
