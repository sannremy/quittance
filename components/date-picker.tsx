"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePicker({
  className,
  onValueChange,
}: {
  className?: string
  onValueChange: (value: Date | undefined) => void
}) {
  const [date, setDate] = React.useState<Date>();

  React.useEffect(() => {
    onValueChange(date);
  }, [date]);

  const now = new Date();

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const nextMonth = new Date();
  nextMonth.setDate(5);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const quickRanges = [
    {
      date: yesterday,
      label: "Hier",
    },
    {
      date: now,
      label: "Aujourd'hui",
    },
    {
      date: nextMonth,
      label: "Le 5 du mois prochain",
    }
  ];

  return (
    <div className={cn("grid gap-2 w-full", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {date ? format(date, "PPP") : <span>Sélectionner une date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
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
