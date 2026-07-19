"use client";

import React, { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO
} from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  color?: string; // Optional tailwind class for background/text color
};

interface CustomCalendarProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
}

export function CustomCalendar({ events, onEventClick }: CustomCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday as start of week
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const dateFormat = "MMMM yyyy";
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="w-full flex flex-col bg-surface border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-outline-variant bg-surface-container-lowest">
        <h2 className="text-xl font-bold text-on-surface">
          {format(currentMonth, dateFormat)}
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday} className="h-9 px-4">
            Today
          </Button>
          <div className="flex items-center gap-1 border border-outline-variant rounded-md overflow-hidden bg-surface-container-lowest">
            <Button variant="ghost" size="icon" onClick={prevMonth} className="h-9 w-9 rounded-none border-r border-outline-variant">
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={nextMonth} className="h-9 w-9 rounded-none">
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 border-b border-outline-variant bg-surface-container-lowest">
        {weekDays.map((day) => (
          <div key={day} className="py-3 text-center text-sm font-semibold text-on-surface-variant">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 auto-rows-fr bg-outline-variant gap-[1px]">
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, monthStart);
          const dayEvents = events.filter((e) => {
             try {
                return isSameDay(parseISO(e.date), day);
             } catch(err) {
                return false;
             }
          });
          
          return (
            <div
              key={day.toString()}
              className={cn(
                "min-h-[120px] p-2 bg-surface flex flex-col transition-colors hover:bg-surface-container-lowest/50",
                !isCurrentMonth && "bg-surface-container-lowest text-on-surface-variant/50"
              )}
            >
              <div className="flex justify-end mb-1">
                <span
                  className={cn(
                    "flex items-center justify-center w-7 h-7 text-sm rounded-full font-medium",
                    isToday(day)
                      ? "bg-primary text-on-primary"
                      : "text-on-surface",
                      !isCurrentMonth && "text-on-surface-variant/50"
                  )}
                >
                  {format(day, "d")}
                </span>
              </div>
              
              {/* Events inside the day */}
              <div className="flex flex-col gap-1 overflow-y-auto max-h-[80px] custom-scrollbar pr-1">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => onEventClick?.(event)}
                    className={cn(
                      "px-2 py-1 text-xs rounded border cursor-pointer truncate font-medium transition-colors hover:brightness-95",
                      event.color ? event.color : "bg-primary/10 text-primary border-primary/20"
                    )}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
