"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";


export type Option = {
    id: number;
    label: string;
};

export type Options = Option[];

type FilterSelectProps = {
    options: Option[];
    selected: Number,
    required: Boolean;
    handleSelect: (id: Number) => void;
};

export function FilterSelect({ options, handleSelect, selected, required }: FilterSelectProps) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(selected || 0);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-100 justify-between rounded shadow-sm"
                >
                    {value
                        ? options.find((o) => o.id === value)?.label
                        : "Sélectionner..."}

                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-100 p-0">
                <Command>
                    <CommandInput placeholder="Rechercher..." />

                    <CommandList>
                        <CommandEmpty>Aucun résultat.</CommandEmpty>

                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.id}
                                    value={option.label}
                                    onSelect={() => {
                                        handleSelect(option.id)
                                        setValue(option.id);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === option.id
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />

                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}