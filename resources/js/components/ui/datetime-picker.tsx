"use client"

import * as React from "react"
import { CalendarIcon, ClockIcon } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateTimePickerProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  className?: string
  hasError?: boolean
}

export function DateTimePicker({
  value,
  onValueChange,
  placeholder = "Pilih tanggal dan waktu",
  className,
  hasError = false
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState<Date>()
  const [timeValue, setTimeValue] = React.useState("08:00")

  // Parse initial value
  React.useEffect(() => {
    if (value) {
      const date = new Date(value)
      if (!isNaN(date.getTime())) {
        setSelectedDate(date)
        setTimeValue(format(date, "HH:mm"))
      }
    }
  }, [value])

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
      updateDateTime(date, timeValue)
    }
  }

  const handleTimeChange = (time: string) => {
    setTimeValue(time)
    if (selectedDate) {
      updateDateTime(selectedDate, time)
    }
  }

  const updateDateTime = (date: Date, time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    const newDateTime = new Date(date)
    newDateTime.setHours(hours, minutes, 0, 0)
    
    // Format as ISO string for form submission (YYYY-MM-DDTHH:mm)
    const formatted = format(newDateTime, "yyyy-MM-dd'T'HH:mm")
    onValueChange?.(formatted)
  }

  const displayValue = React.useMemo(() => {
    if (!selectedDate) return null
    
    const [hours, minutes] = timeValue.split(':').map(Number)
    const displayDateTime = new Date(selectedDate)
    displayDateTime.setHours(hours, minutes, 0, 0)
    
    return format(displayDateTime, "EEEE, dd MMMM yyyy 'pukul' HH:mm", { locale: id })
  }, [selectedDate, timeValue])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground",
            hasError && "border-red-500",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayValue || <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            initialFocus
            disabled={(date) => date < new Date()}
          />
          <div className="p-3 border-l">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <ClockIcon className="h-4 w-4" />
                Waktu
              </Label>
              <Input
                type="time"
                value={timeValue}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="w-full"
              />
              {selectedDate && (
                <div className="text-xs text-muted-foreground">
                  {format(selectedDate, "EEEE, dd MMMM yyyy", { locale: id })}
                </div>
              )}
            </div>
          </div>
        </div>
        {selectedDate && (
          <div className="p-3 border-t bg-gray-50">
            <Button
              onClick={() => setOpen(false)}
              className="w-full bg-[#2B5235] hover:bg-[#2B5235]/90"
            >
              Pilih Waktu
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}