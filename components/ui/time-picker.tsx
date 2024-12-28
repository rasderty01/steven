// components/ui/time-picker.tsx
"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock } from "lucide-react";
import * as React from "react";

interface TimePickerProps {
  date: Date;
  setDate: (date: Date) => void;
}

export function TimePicker({ date, setDate }: TimePickerProps) {
  const minutesList = React.useMemo(() => {
    const minutes = [];
    for (let i = 0; i < 60; i += 15) {
      minutes.push(i);
    }
    return minutes;
  }, []);

  const hoursList = React.useMemo(() => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(i);
    }
    return hours;
  }, []);

  return (
    <div className="flex items-end gap-2">
      <div className="grid gap-1.5">
        <Label htmlFor="hours">Hours</Label>
        <Select
          value={date.getHours().toString()}
          onValueChange={(value) => {
            const newDate = new Date(date);
            newDate.setHours(parseInt(value));
            setDate(newDate);
          }}
        >
          <SelectTrigger id="hours" className="w-[110px]">
            <SelectValue placeholder="Hours" />
          </SelectTrigger>
          <SelectContent>
            {hoursList.map((hour) => (
              <SelectItem key={hour} value={hour.toString()}>
                {hour.toString().padStart(2, "0")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="minutes">Minutes</Label>
        <Select
          value={date.getMinutes().toString()}
          onValueChange={(value) => {
            const newDate = new Date(date);
            newDate.setMinutes(parseInt(value));
            setDate(newDate);
          }}
        >
          <SelectTrigger id="minutes" className="w-[110px]">
            <SelectValue placeholder="Minutes" />
          </SelectTrigger>
          <SelectContent>
            {minutesList.map((minute) => (
              <SelectItem key={minute} value={minute.toString()}>
                {minute.toString().padStart(2, "0")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Clock className="h-4 w-4 text-muted-foreground" />
    </div>
  );
}
