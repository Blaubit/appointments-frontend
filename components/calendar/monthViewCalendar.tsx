import React, { useState } from "react";
import { CircleAlert } from "lucide-react";
import { OccupiedSlot, PeriodResponse } from "@/types";

type SlotWithDate = OccupiedSlot & { date: string };

interface MonthViewCalendarProps {
  schedule: PeriodResponse;
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

  // Helper to check if a day has working hours configured
  function isWorkingDay(date: Date): boolean {
    const dateStr = dateToStr(date);
    const day = schedule.schedule.find((d) => d.date === dateStr);
    return !!(day?.workingHours?.start && day?.workingHours?.end);
  }

  // Helper to get day schedule
  function getDaySchedule(date: Date) {
    const dateStr = dateToStr(date);
    return schedule.schedule.find((d) => d.date === dateStr);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-4">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs sm:text-sm font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {days.map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          const isToday = date.toDateString() === new Date().toDateString();
          const slots = getSlotsForDate(date);
          const isWorking = isWorkingDay(date);
          const daySchedule = getDaySchedule(date);

          return (
            <div
              key={index}
              className={`min-h-[80px] sm:min-h-[120px] p-1 sm:p-2 border rounded-lg transition-colors relative ${
                isCurrentMonth
                  ? isWorking
                    ? "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/50"
                  : "bg-gray-50 dark:bg-gray-900 text-gray-400"
              } ${isToday ? "ring-2 ring-blue-500" : ""}`}
              onClick={() => {
                if (isWorking && onDayClick) {
                  onDayClick(date);
                }
              }}
              style={{
                cursor: isWorking && isCurrentMonth ? "pointer" : "default",
              }}
            >
              {/* Patrón de líneas diagonales para días no laborables */}
              {isCurrentMonth && !isWorking && (
                <div
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  style={{
                    background:
                      "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(239, 68, 68, 0.1) 8px, rgba(239, 68, 68, 0.1) 16px)",
                  }}
                />
              )}

              <div className="relative z-10">
                <div
                  className={`text-xs sm:text-sm font-medium mb-1 sm:mb-2 flex items-center justify-between ${
                    isToday
                      ? "text-blue-600"
                      : !isWorking && isCurrentMonth
                        ? "text-red-600 dark:text-red-400"
                        : ""
                  }`}
                >
                  <span>{date.getDate()}</span>
                  {isCurrentMonth && !isWorking && (
                    <CircleAlert className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 dark:text-red-400" />
                  )}
                </div>

                {/* Mostrar contenido según el tipo de día */}
                {isCurrentMonth && !isWorking ? (
                  // Día no laboral - Solo mostrar en desktop
                  <div className="space-y-1 hidden sm:block">
                    <div className="text-xs text-red-600 dark:text-red-400 font-medium text-center">
                      Cerrado
                    </div>
                    <div className="text-xs text-red-500 dark:text-red-400 text-center">
                      Día no laboral
                    </div>
                  </div>
                ) : (
                  // Día laboral o fuera del mes actual
                  <div className="space-y-1">
                    {/* Horarios de trabajo - Solo mostrar en desktop */}
                    {isCurrentMonth &&
                      isWorking &&
                      daySchedule?.workingHours?.start &&
                      daySchedule?.workingHours?.end && (
                        <div className="text-xs text-gray-600 dark:text-white font-medium mb-1 hidden sm:block">
                          {formatTime(daySchedule.workingHours.start)} -{" "}
                          {formatTime(daySchedule.workingHours.end)}
                        </div>
                      )}

                    {/* Citas programadas - Optimizado para móvil */}
                    {slots
                      .slice(0, window.innerWidth < 640 ? 2 : 3)
                      .map((slot) => (
                        <div
                          key={slot.appointmentId}
                          className="text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 bg-blue-100 text-blue-800 border-l-2 border-blue-500 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSlotClick && onSlotClick(slot);
                          }}
                        >
                          {/* En móvil solo mostrar hora, en desktop mostrar hora y paciente */}
                          <span className="sm:hidden">
                            {formatTime(slot.startTime)}
                          </span>
                          <span className="hidden sm:inline">
                            {formatTime(slot.startTime)} - {slot.clientName}
                          </span>
                        </div>
                      ))}
                    {slots.length > (window.innerWidth < 640 ? 2 : 3) && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        +{slots.length - (window.innerWidth < 640 ? 2 : 3)} más
                      </div>
                    )}
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
