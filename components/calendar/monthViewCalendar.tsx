import React, { useState } from "react";
import { ScheduleResponse, OccupiedSlot } from "@/types";

type SlotWithDate = OccupiedSlot & { date: string };

interface MonthViewCalendarProps {
  schedule: ScheduleResponse;
  currentDate: Date;
  onDayClick?: (date: Date) => void;
  onSlotClick?: (slot: SlotWithDate) => void;
}

const monthNames = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

function dateToStr(date: Date): string {
  return date.toISOString().split("T")[0];
}

function formatTime(timeStr: string): string {
  if (!timeStr) return "";
  const parts = timeStr.split(":");
  return `${parts[0]}:${parts[1]}`;
}

export const MonthViewCalendar: React.FC<MonthViewCalendarProps> = ({
  schedule,
  currentDate,
  onDayClick,
  onSlotClick,
}) => {
  // Generate days for month grid
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const days: Date[] = [];
  const currentDateObj = new Date(startDate);
  for (let i = 0; i < 42; i++) {
    days.push(new Date(currentDateObj));
    currentDateObj.setDate(currentDateObj.getDate() + 1);
  }

  // Helper to get slots for a date
  function getSlotsForDate(date: Date): SlotWithDate[] {
    const dateStr = dateToStr(date);
    const day = schedule.schedule.find((d) => d.date === dateStr);
    if (!day) return [];
    return day.occupiedSlots.map((slot) => ({ ...slot, date: day.date }));
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
      </div>
      <div className="grid grid-cols-7 gap-2 mb-4">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          const isToday = date.toDateString() === new Date().toDateString();
          const slots = getSlotsForDate(date);
          return (
            <div
              key={index}
              className={`min-h-[120px] p-2 border rounded-lg cursor-pointer transition-colors ${
                isCurrentMonth
                  ? "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  : "bg-gray-50 dark:bg-gray-900 text-gray-400"
              } ${isToday ? "ring-2 ring-blue-500" : ""}`}
              onClick={() => onDayClick && onDayClick(date)}
            >
              <div
                className={`text-sm font-medium mb-2 ${isToday ? "text-blue-600" : ""}`}
              >
                {date.getDate()}
              </div>
              <div className="space-y-1">
                {slots.slice(0, 3).map((slot) => (
                  <div
                    key={slot.appointmentId}
                    className="text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 bg-blue-100 text-blue-800 border-l-2 border-blue-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSlotClick && onSlotClick(slot);
                    }}
                  >
                    {formatTime(slot.startTime)} - {slot.clientName}
                  </div>
                ))}
                {slots.length > 3 && (
                  <div className="text-xs text-gray-500">
                    +{slots.length - 3} más
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
