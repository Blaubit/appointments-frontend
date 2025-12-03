import React, { useState } from "react";
import { CircleAlert, Ban, Clock } from "lucide-react";
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
          const isRestricted = daySchedule?.isRestricted || false;
          const restrictionType = daySchedule?.restrictionType || null;

          // Determinar el color de fondo y el cursor según el estado del día
          let bgClasses = "";
          let cursorStyle = "";

          if (!isCurrentMonth) {
            bgClasses = "bg-gray-50 dark:bg-gray-900 text-gray-400";
            cursorStyle = "default";
          } else if (!isWorking) {
            bgClasses =
              "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/50";
            cursorStyle = "default";
          } else if (isRestricted && restrictionType === "full-day") {
            bgClasses =
              "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800/50";
            cursorStyle = "not-allowed";
          } else if (isRestricted && restrictionType === "partial") {
            bgClasses =
              "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800/50 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 cursor-pointer";
            cursorStyle = "pointer";
          } else {
            bgClasses =
              "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer";
            cursorStyle = "pointer";
          }

          return (
            <div
              key={index}
              className={`min-h-[80px] sm:min-h-[120px] p-1 sm:p-2 border rounded-lg transition-colors relative ${bgClasses} ${
                isToday ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => {
                // Solo permitir click si es día laboral y no está completamente restringido
                if (
                  isWorking &&
                  !(isRestricted && restrictionType === "full-day") &&
                  onDayClick
                ) {
                  onDayClick(date);
                }
              }}
              style={{ cursor: cursorStyle }}
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

              {/* Patrón de líneas diagonales para días con restricción total */}
              {isCurrentMonth &&
                isRestricted &&
                restrictionType === "full-day" && (
                  <div
                    className="absolute inset-0 rounded-lg pointer-events-none"
                    style={{
                      background:
                        "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(249, 115, 22, 0.1) 8px, rgba(249, 115, 22, 0.1) 16px)",
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
                        : isRestricted && restrictionType === "full-day"
                          ? "text-orange-600 dark:text-orange-400"
                          : isRestricted && restrictionType === "partial"
                            ? "text-yellow-700 dark:text-yellow-400"
                            : ""
                  }`}
                >
                  <span>{date.getDate()}</span>
                  {isCurrentMonth && !isWorking && (
                    <CircleAlert className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 dark:text-red-400" />
                  )}
                  {isCurrentMonth &&
                    isRestricted &&
                    restrictionType === "full-day" && (
                      <Ban className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500 dark:text-orange-400" />
                    )}
                  {isCurrentMonth &&
                    isRestricted &&
                    restrictionType === "partial" && (
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600 dark:text-yellow-400" />
                    )}
                </div>

                {/* Mostrar contenido según el tipo de día */}
                {isCurrentMonth && !isWorking ? (
                  // Día no laboral
                  <div className="space-y-1 hidden sm:block">
                    <div className="text-xs text-red-600 dark:text-red-400 font-medium text-center">
                      Cerrado
                    </div>
                    <div className="text-xs text-red-500 dark:text-red-400 text-center">
                      Día no laboral
                    </div>
                  </div>
                ) : isCurrentMonth &&
                  isRestricted &&
                  restrictionType === "full-day" ? (
                  // Día con restricción completa
                  <div className="space-y-1 hidden sm:block">
                    <div className="text-xs text-orange-600 dark:text-orange-400 font-medium text-center">
                      Bloqueado
                    </div>
                    <div className="text-xs text-orange-500 dark:text-orange-400 text-center">
                      Día no disponible
                    </div>
                    {daySchedule?.restrictions?.[0]?.reason && (
                      <div className="text-xs text-orange-500 dark:text-orange-400 text-center italic">
                        {daySchedule.restrictions[0].reason}
                      </div>
                    )}
                  </div>
                ) : (
                  // Día laboral (normal o con restricción parcial)
                  <div className="space-y-1">
                    {/* Horarios de trabajo */}
                    {isCurrentMonth &&
                      isWorking &&
                      daySchedule?.workingHours?.start &&
                      daySchedule?.workingHours?.end && (
                        <div className="text-xs text-gray-600 dark:text-white font-medium mb-1 hidden sm:block">
                          {formatTime(daySchedule.workingHours.start)} -{" "}
                          {formatTime(daySchedule.workingHours.end)}
                        </div>
                      )}

                    {/* Restricción parcial */}
                    {isCurrentMonth &&
                      isRestricted &&
                      restrictionType === "partial" &&
                      daySchedule?.restrictions && (
                        <div className="mb-2 hidden sm:block">
                          {daySchedule.restrictions.map((restriction, idx) => (
                            <div
                              key={idx}
                              className="text-xs bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 p-1 rounded mb-1"
                            >
                              <div className="font-semibold">🔒 Bloqueado:</div>
                              <div>
                                {formatTime(restriction.startTime || "")} -{" "}
                                {formatTime(restriction.endTime || "")}
                              </div>
                              {restriction.reason && (
                                <div className="italic text-yellow-700 dark:text-yellow-300">
                                  {restriction.reason}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                    {/* Citas programadas */}
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
