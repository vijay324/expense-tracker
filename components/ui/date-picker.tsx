"use client";

import * as React from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
} from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date: Date | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function DatePicker({
  date,
  onChange,
  placeholder = "Pick a date",
  className,
}: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    date || new Date()
  );

  // Get days in the current month
  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  // Get day of week for the first day (0 = Sunday, 1 = Monday, etc.)
  const startDay = firstDayOfMonth.getDay();

  // Create array for day names
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Handle date selection
  const handleDateSelect = (day: Date) => {
    onChange(day);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3">
          {/* Calendar header with month navigation */}
          <div className="flex items-center justify-between mb-2">
            <Button variant="ghost" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="font-medium">
              {format(currentMonth, "MMMM yyyy")}
            </div>
            <Button variant="ghost" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-muted-foreground h-8 flex items-center justify-center"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before the first day of month */}
            {Array.from({ length: startDay }).map((_, index) => (
              <div key={`empty-start-${index}`} className="h-8 w-8" />
            ))}

            {/* Days of the month */}
            {daysInMonth.map((day) => {
              const isSelected = date ? isSameDay(day, date) : false;
              const isTodayDate = isToday(day);

              return (
                <Button
                  key={day.toString()}
                  variant={
                    isSelected ? "default" : isTodayDate ? "outline" : "ghost"
                  }
                  className={cn(
                    "h-8 w-8 p-0 font-normal",
                    isSelected &&
                      "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                    isTodayDate &&
                      !isSelected &&
                      "border border-primary text-primary"
                  )}
                  onClick={() => handleDateSelect(day)}
                >
                  {day.getDate()}
                </Button>
              );
            })}
          </div>

          {/* Today button */}
          <div className="mt-3 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date();
                setCurrentMonth(today);
                onChange(today);
              }}
            >
              Today
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
