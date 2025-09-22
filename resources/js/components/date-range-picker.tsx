"use client"

import * as React from "react"
import { type DateRange } from "react-day-picker"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps {
  dateRange: DateRange | undefined
  onDateRangeChange: (dateRange: DateRange | undefined) => void
  placeholder?: string
  className?: string
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  placeholder = "Pilih rentang tanggal",
  className
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "dd LLL y", { locale: id })} -{" "}
                  {format(dateRange.to, "dd LLL y", { locale: id })}
                </>
              ) : (
                format(dateRange.from, "dd LLL y", { locale: id })
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={onDateRangeChange}
            numberOfMonths={2}
            className="rounded-lg border shadow-sm"
          />
          <div className="p-3 border-t border-border">
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  onDateRangeChange(undefined)
                  setOpen(false)
                }}
              >
                Reset
              </Button>
              <Button
                className="flex-1"
                onClick={() => setOpen(false)}
                disabled={!dateRange?.from}
              >
                Terapkan
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}