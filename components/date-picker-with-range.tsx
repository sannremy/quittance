"use client"

import * as React from "react"
import { endOfMonth, format, setDefaultOptions, startOfMonth } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

setDefaultOptions({
  weekStartsOn: 1,
  locale: fr,
});

export function DatePickerWithRange({
  className,
  onValueChange,
}: {
  className?: string
  onValueChange: (value: DateRange | undefined) => void
}) {
  const now = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const quickRanges = [
    {
      date: {
        from: startOfMonth(now),
        to: endOfMonth(now),
      },
      label: "Ce mois-ci",
    },
    {
      date: {
        from: startOfMonth(nextMonth),
        to: endOfMonth(nextMonth),
      },
      label: "Le mois prochain",
    },
  ];

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: startOfMonth(now),
    to: endOfMonth(now),
  });

  React.useEffect(() => {
    onValueChange(date);
  }, [date])

  return (
    <div className={cn("grid gap-2 w-full", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "PPP")} -{" "}
                  {format(date.to, "PPP")}
                </>
              ) : (
                format(date.from, "PPP")
              )
            ) : (
              <span>Sélectionner une date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            locale={fr}
          />
        </PopoverContent>
      </Popover>
      <ul className="flex items-start justify-start space-x-2 text-xs">
        {quickRanges.map((range, index) => (
          <li key={index}>
            <Button
              variant="link"
              type="button"
              className="h-auto p-0 text-xs"
              onClick={() => setDate(range.date)}
            >{range.label}</Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
