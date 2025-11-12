import React, { useState } from "react";
import { OccupiedSlot, PeriodResponse } from "@/types";
import { CircleAlert } from "lucide-react";

type SlotWithDate = OccupiedSlot & { date: string };

interface WeekViewCalendarProps {
  schedule: PeriodResponse;
  weekDate: Date;
  onHourClick?: (date: Date) => void;
  onSlotClick?: (slot: SlotWithDate) => void;
  onDayColumnClick?: (date: Date) => void;
}

const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

/* 
  getWeekDays:
  - Calcula los 7 días de la semana empezando en LUNES.
  - Normaliza cada Date a las 00:00 (hora local) para evitar desajustes por zonas horarias.
*/
function getWeekDays(weekDate: Date) {
  const startOfWeek = new Date(weekDate);
  const day = (weekDate.getDay() + 6) % 7; // transforma getDay(): 0..6 -> 6..5 para restar y obtener lunes
  startOfWeek.setDate(weekDate.getDate() - day);
  startOfWeek.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    d.setHours(0, 0, 0, 0);
    return d;
  });
}

/* Convierte "HH:MM(:SS)?" a minutos desde medianoche */
function timeStringToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + (minutes || 0);
}

/* Genera líneas de hora con paso (p.ej. 30 minutos) */
function generateHourLines(start: number, end: number, stepMinutes = 30) {
  const lines: string[] = [];
  for (let h = start; h < end; h++) {
    for (let m = 0; m < 60; m += stepMinutes) {
      lines.push(
        `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
      );
    }
  }
  lines.push(`${end.toString().padStart(2, "0")}:00`);
  return lines;
}

/* Calcula posición vertical (px) relativa a startHour */
function timeToPosition(time: string, startHour: number) {
  const [h, m] = time.split(":").map(Number);
  console.log(
    "Calculando posición para tiempo:",
    time,
    "con startHour:",
    startHour
  );
  const totalMinutes = (h - startHour) * 60 + m - 5; // ajuste visual de 5 minutos por el padding superior
  const slotHeight = 80;
  const pixelsPerMinute = slotHeight / 60;
  return totalMinutes * pixelsPerMinute;
}

/* Asigna columnas a slots solapados para evitar superposición visual */
function assignColumns(slots: SlotWithDate[]) {
  type SlotWithTimes = SlotWithDate & { start: number; end: number };
  const sorted: SlotWithTimes[] = slots
    .map((s) => ({
      ...s,
      start:
        parseInt(s.startTime.split(":")[0]) * 60 +
        parseInt(s.startTime.split(":")[1]),
      end:
        parseInt(s.endTime.split(":")[0]) * 60 +
        parseInt(s.endTime.split(":")[1]),
    }))
    .sort((a, b) => a.start - b.start);

  const columns: SlotWithTimes[][] = [];
  sorted.forEach((slot) => {
    let placed = false;
    for (let col = 0; col < columns.length; col++) {
      if (
        columns[col].length === 0 ||
        columns[col][columns[col].length - 1].end <= slot.start
      ) {
        columns[col].push(slot);
        placed = true;
        break;
      }
    }
    if (!placed) columns.push([slot]);
  });

  const slotColumns: { [id: string]: number } = {};
  columns.forEach((col, idx) => {
    col.forEach((slot) => {
      slotColumns[slot.appointmentId] = idx;
    });
  });

  return { slotColumns, totalColumns: columns.length };
}

/* Formatea Date a 'YYYY-MM-DD' en zona local para buscar en schedule.schedule */
function formatLocalDate(date: Date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export const WeekViewCalendar: React.FC<WeekViewCalendarProps> = ({
  schedule,
  weekDate,
  onHourClick,
  onSlotClick,
  onDayColumnClick,
}) => {
  const [hoveredSlotId, setHoveredSlotId] = useState<string | null>(null);
  const days = getWeekDays(weekDate);

  /* Calcula rango de horas (start/end) recorriendo workingHours de cada día */
  function getWeekHourRange() {
    let earliestStart = 24;
    let latestEnd = 0;
    let hasAnyWorkingHours = false;

    days.forEach((date) => {
      const dateStr = formatLocalDate(date);
      const daySchedule = schedule.schedule.find((d) => d.date === dateStr);

      if (daySchedule?.workingHours?.start && daySchedule?.workingHours?.end) {
        hasAnyWorkingHours = true;
        const startMinutes = timeStringToMinutes(
          daySchedule.workingHours.start
        );
        const endMinutes = timeStringToMinutes(daySchedule.workingHours.end);

        const startHour = Math.floor(startMinutes / 60);
        const endHour = Math.ceil(endMinutes / 60);

        earliestStart = Math.min(earliestStart, startHour);
        latestEnd = Math.max(latestEnd, endHour);
      }
    });

    if (!hasAnyWorkingHours) {
      earliestStart = 8;
      latestEnd = 19;
    }

    return { start: earliestStart, end: latestEnd };
  }

  const { start: visualStartHour, end: visualEndHour } = getWeekHourRange();
  const hourLines = generateHourLines(visualStartHour, visualEndHour, 30);
  const containerHeight = Math.max((hourLines.length - 1) * 40, 600);

  /* Devuelve occupiedSlots del día dado (usa formato local para búsqueda) */
  function getSlotsForDate(date: Date): SlotWithDate[] {
    const dateStr = formatLocalDate(date);
    const day = schedule.schedule.find((d) => d.date === dateStr);
    if (!day) return [];
    return day.occupiedSlots.map((slot) => ({ ...slot, date: day.date }));
  }

  /* Devuelve el objeto schedule del día dado */
  function getDaySchedule(date: Date) {
    const dateStr = formatLocalDate(date);
    return schedule.schedule.find((d) => d.date === dateStr);
  }

  /* Determina si el día tiene workingHours definidos */
  function isWorkingDay(date: Date): boolean {
    const daySchedule = getDaySchedule(date);
    return !!(
      daySchedule?.workingHours?.start && daySchedule?.workingHours?.end
    );
  }

  return (
    <div className="overflow-hidden -mx-4 sm:mx-0">
      <div className="flex mb-4 px-4 sm:px-0">
        <div className="w-10 sm:w-14 py-2"></div>
        <div className="flex-1 grid grid-cols-7 gap-0.5 sm:gap-2">
          {days.map((date, index) => {
            const isToday = date.toDateString() === new Date().toDateString();
            const isWorking = isWorkingDay(date);
            return (
              <div
                key={index}
                className={`text-center py-2 ${
                  isToday
                    ? "text-blue-600 dark:text-blue-400 font-bold"
                    : isWorking
                      ? "text-gray-700 dark:text-gray-200"
                      : "text-gray-400 dark:text-gray-500"
                }`}
              >
                <div className="text-xs sm:text-base font-semibold">
                  {dayNames[date.getDay()]}
                </div>
                <div className="text-sm sm:text-xl">{date.getDate()}</div>
                {!isWorking && (
                  <div className="text-xs text-red-500 dark:text-red-400 mt-1 hidden sm:block">
                    Cerrado
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="relative rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm flex mx-4 sm:mx-0"
        style={{ height: `${containerHeight}px` }}
      >
        <div className="absolute left-0 w-full z-0 pointer-events-none">
          {hourLines.map((hour, i) => (
            <div
              key={hour + i}
              style={{
                position: "absolute",
                top: `${i * 40}px`,
                width: "100%",
                height: "40px",
                left: 0,
                display: "flex",
                alignItems: "center",
              }}
            >
              <span className="pl-1 sm:pl-2 pr-1 sm:pr-2 text-xs sm:text-base text-gray-400 dark:text-gray-500 w-10 sm:w-14">
                {hour}
              </span>
              <div
                className="flex-1 border-t border-dashed border-gray-200 dark:border-gray-700"
                style={{ marginLeft: 2 }}
              />
            </div>
          ))}
        </div>

        <div className="w-10 sm:w-14 flex-shrink-0"></div>

        <div className="flex-1 grid grid-cols-7 gap-0.5 sm:gap-2 relative z-10">
          {days.map((date, dayIdx) => {
            const isWorking = isWorkingDay(date);
            const slots = getSlotsForDate(date);
            const { slotColumns, totalColumns } = assignColumns(slots);
            const daySchedule = getDaySchedule(date);

            return (
              <div
                key={dayIdx}
                className={`relative h-full border-l border-gray-200 dark:border-gray-700 ${
                  isWorking ? "cursor-pointer" : ""
                }`}
                style={{
                  background: isWorking
                    ? "transparent"
                    : "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,0,0,0.05) 10px, rgba(255,0,0,0.05) 20px)",
                }}
                onClick={(e) => {
                  if (isWorking && onDayColumnClick) onDayColumnClick(date);
                }}
              >
                {!isWorking && (
                  <div className="absolute inset-0 bg-gray-100/80 dark:bg-gray-800/80 flex items-center justify-center z-50">
                    <div className="text-center p-2 sm:p-4">
                      <div className="flex justify-center">
                        <CircleAlert className="bg-red-500 text-white rounded-full p-1 my-2 sm:my-5 w-6 h-6 sm:w-8 sm:h-8" />
                      </div>
                      <div className="hidden sm:block">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Día no laboral
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          Clínica cerrada
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {isWorking &&
                  daySchedule?.workingHours?.start &&
                  daySchedule?.workingHours?.end && (
                    <div className="absolute top-2 left-0.5 right-0.5 sm:left-1 sm:right-1 z-20 pointer-events-none hidden sm:block">
                      <div className="text-xs text-center bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 px-1 py-0.5 rounded border border-gray-300 dark:border-gray-600 shadow-sm">
                        {daySchedule.workingHours.start.slice(0, 5)} -{" "}
                        {daySchedule.workingHours.end.slice(0, 5)}
                      </div>
                    </div>
                  )}

                {isWorking &&
                  slots.map((slot) => {
                    const top = timeToPosition(
                      slot.startTime.slice(0, 5),
                      visualStartHour
                    );
                    const end = slot.endTime
                      ? slot.endTime.slice(0, 5)
                      : slot.startTime.slice(0, 5);
                    const durationMinutes =
                      parseInt(end.split(":")[0]) * 60 +
                      parseInt(end.split(":")[1]) -
                      (parseInt(slot.startTime.split(":")[0]) * 60 +
                        parseInt(slot.startTime.split(":")[1]));
                    const slotHeight = Math.max(
                      (durationMinutes / 60) * 64,
                      40
                    );

                    const colIdx = slotColumns[slot.appointmentId];
                    const colWidth = 100 / (totalColumns || 1);

                    return (
                      <div
                        key={slot.appointmentId}
                        style={{
                          position: "absolute",
                          left: `calc(${colIdx * colWidth}% + 2px)`,
                          top: `${top + (window.innerWidth >= 640 ? 30 : 10)}px`,
                          width: `calc(${colWidth}% - 4px)`,
                          height: `${slotHeight}px`,
                          zIndex: 30,
                          overflow: "visible",
                          fontSize:
                            window.innerWidth >= 640 ? "1.1rem" : "0.75rem",
                        }}
                        className={`
                        shadow-lg
                        transition
                        bg-blue-600 dark:bg-blue-700
                        border-l-4 border-blue-500 dark:border-blue-400
                        rounded-xl
                        px-1 sm:px-2 py-1 sm:py-2
                        mb-1
                        cursor-pointer
                        flex flex-col justify-center items-center
                        hover:scale-105
                        hover:bg-blue-700 dark:hover:bg-blue-800
                        relative
                        text-white dark:text-blue-100
                      `}
                        onMouseEnter={() =>
                          setHoveredSlotId(slot.appointmentId)
                        }
                        onMouseLeave={() => setHoveredSlotId(null)}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSlotClick) onSlotClick(slot);
                        }}
                        tabIndex={0}
                      >
                        <div className="font-bold text-xs sm:text-lg truncate text-center w-full">
                          <span className="sm:hidden">
                            {slot.startTime.slice(0, 5)}
                          </span>
                          <span className="hidden sm:inline">
                            {slot.clientName}
                          </span>
                        </div>

                        {hoveredSlotId === slot.appointmentId &&
                          window.innerWidth >= 640 && (
                            <div
                              className="
                            absolute left-1/2 bottom-full z-[100] w-[240px] -translate-x-1/2 mb-3 px-4 py-3 rounded-lg shadow-xl
                            bg-gray-900 dark:bg-gray-800 text-gray-100 dark:text-gray-200
                            border border-gray-700 dark:border-gray-600 text-base
                            pointer-events-none
                            animate-fadeIn
                            hidden sm:block
                          "
                            >
                              <div className="mb-1">
                                <b>Paciente:</b> {slot.clientName}
                              </div>
                              <div className="mb-1">
                                <b>Servicio:</b> {slot.serviceName}
                              </div>
                              <div className="mb-1">
                                <b>Horario:</b> {slot.startTime.slice(0, 5)} -{" "}
                                {slot.endTime?.slice(0, 5)}
                              </div>
                            </div>
                          )}
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
