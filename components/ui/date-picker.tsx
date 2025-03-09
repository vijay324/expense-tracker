"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

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
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-7 gap-2">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
              <div
                key={i}
                className="text-center text-xs font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
            {Array.from({ length: 31 }, (_, i) => {
              const day = i + 1;
              const currentDate = date || new Date();
              const isSelected = date && day === date.getDate();

              return (
                <Button
                  key={day}
                  variant={isSelected ? "default" : "ghost"}
                  className={cn(
                    "h-8 w-8 p-0 font-normal",
                    isSelected && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => {
                    const newDate = new Date(currentDate);
                    newDate.setDate(day);
                    onChange(newDate);
                  }}
                >
                  {day}
                </Button>
              );
            })}
          </div>
          <div className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (date) {
                  const newDate = new Date(date);
                  newDate.setMonth(date.getMonth() - 1);
                  onChange(newDate);
                }
              }}
            >
              Previous Month
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (date) {
                  const newDate = new Date(date);
                  newDate.setMonth(date.getMonth() + 1);
                  onChange(newDate);
                }
              }}
            >
              Next Month
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
