"use client"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export function DatePickerRange({ date, setDate }) {

    return (
        <Field className="mx-auto w-100 text-center bg-light p-3 rounded">
            <FieldLabel htmlFor="date-picker-range" className="text-lg">Filtre par période d'insersion</FieldLabel>
            <Popover>
                <PopoverTrigger asChild className="text-center w-100">
                    <Button
                        variant="outline"
                        id="date-picker-range"
                        className="justify-center text-bold px-2.5 font-normal border-md shadow-sm rounded"
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    Du  {format(date.from, "dd LLL y", { locale: fr })}   au   {" "}
                                    {format(date.to, "dd LLL y", { locale: fr })}
                                </>
                            ) : (
                                format(date.from, "dd LLL y", { locale: fr })
                            )
                        ) : (
                            <span>Choisir une date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                    <Calendar
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </Field>
    )
}
