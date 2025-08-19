import React, { useState } from "react";
import { ScheduleResponse, OccupiedSlot } from "@/types";

type SlotWithDate = OccupiedSlot & { date: string };

interface WeekViewCalendarProps {
  schedule: ScheduleResponse;
  weekDate: Date;
  onHourClick?: (date: Date) => void;
  onSlotClick?: (slot: SlotWithDate) => void;
  onDayColumnClick?: (date: Date) => void; // Callback para cambio de vista
}

const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

function getWeekDays(weekDate: Date) {
  const startOfWeek = new Date(weekDate);
  startOfWeek.setDate(weekDate.getDate() - weekDate.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });
}

function generateHourLines(start = 8, end = 19, stepMinutes = 30) {
  const lines = [];
  for (let h = start; h < end; h++) {
    for (let m = 0; m < 60; m += stepMinutes) {
      lines.push(
        `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`,
      );
    }
  }
  return lines;
}

function timeToPosition(time: string, startHour = 8, endHour = 19) {
  const [h, m] = time.split(":").map(Number);
  const totalMinutes = (h - startHour) * 60 + m;
  const slotHeight = 64;
  const pixelsPerMinute = slotHeight / 60;
  return totalMinutes * pixelsPerMinute;
}

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

  let columns: SlotWithTimes[][] = [];
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
    if (!placed) {
      columns.push([slot]);
    }
  });
  const slotColumns: { [id: string]: number } = {};
  columns.forEach((col, idx) => {
    col.forEach((slot) => {
      slotColumns[slot.appointmentId] = idx;
    });
  });
  return { slotColumns, totalColumns: columns.length };
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
  const hourLines = generateHourLines(8, 19, 30);

  function getSlotsForDate(date: Date): SlotWithDate[] {
    const dateStr = date.toISOString().split("T")[0];
    const day = schedule.schedule.find((d) => d.date === dateStr);
    if (!day) return [];
    return day.occupiedSlots.map((slot) => ({
      ...slot,
      date: day.date,
    }));
  }

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-8 gap-2 mb-4">
        <div className="py-2"></div>
        {days.map((date, index) => {
          const isToday = date.toDateString() === new Date().toDateString();
          return (
            <div
              key={index}
              className={`text-center py-2 ${
                isToday
                  ? "text-blue-600 dark:text-blue-400 font-bold"
                  : "text-gray-700 dark:text-gray-200"
              }`}
            >
              <div className="text-base font-semibold">
                {dayNames[date.getDay()]}
              </div>
              <div className="text-xl">{date.getDate()}</div>
            </div>
          );
        })}
      </div>

      <div
        className="relative rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm"
        style={{ height: `${hourLines.length * 40}px`, minHeight: "600px" }}
      >
        {/* Líneas de hora */}
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
              <span
                className="pl-2 pr-2 text-base text-gray-400 dark:text-gray-500"
                style={{ width: 56 }}
              >
                {hour}
              </span>
              <div
                className="flex-1 border-t border-dashed border-gray-200 dark:border-gray-700"
                style={{ marginLeft: 4 }}
              />
            </div>
          ))}
        </div>
        {/* Celdas de días con columnas */}
        <div className="grid grid-cols-8 gap-2 w-full h-full relative z-10">
          <div className="h-full"></div>
          {days.map((date, dayIdx) => {
            const slots = getSlotsForDate(date);
            const { slotColumns, totalColumns } = assignColumns(slots);

            return (
              <div
                key={dayIdx}
                className="relative h-full border-l border-gray-200 dark:border-gray-700"
                style={{ background: "transparent", cursor: "pointer" }}
                onClick={(e) => {
                  if (onDayColumnClick) onDayColumnClick(date);
                }}
              >
                {slots.map((slot) => {
                  const top = timeToPosition(slot.startTime.slice(0, 5), 8, 19);
                  const end = slot.endTime
                    ? slot.endTime.slice(0, 5)
                    : slot.startTime.slice(0, 5);
                  const durationMinutes =
                    parseInt(end.split(":")[0]) * 60 +
                    parseInt(end.split(":")[1]) -
                    (parseInt(slot.startTime.split(":")[0]) * 60 +
                      parseInt(slot.startTime.split(":")[1]));
                  const slotHeight = Math.max((durationMinutes / 60) * 64, 40);

                  const colIdx = slotColumns[slot.appointmentId];
                  const colWidth = 100 / (totalColumns || 1);

                  return (
                    <div
                      key={slot.appointmentId}
                      style={{
                        position: "absolute",
                        left: `calc(${colIdx * colWidth}% + 4px)`,
                        top: `${top}px`,
                        width: `calc(${colWidth}% - 8px)`,
                        height: `${slotHeight}px`,
                        zIndex: 2,
                        overflow: "visible",
                        fontSize: "1.1rem",
                      }}
                      className={`
                        shadow-lg
                        transition
                        bg-blue-600 dark:bg-blue-700
                        border-l-4 border-blue-500 dark:border-blue-400
                        rounded-xl
                        px-2 py-2
                        mb-1
                        cursor-pointer
                        flex flex-col justify-center items-center
                        hover:scale-105
                        hover:bg-blue-700 dark:hover:bg-blue-800
                        relative
                        text-white dark:text-blue-100
                      `}
                      onMouseEnter={() => setHoveredSlotId(slot.appointmentId)}
                      onMouseLeave={() => setHoveredSlotId(null)}
                      onClick={(e) => {
                        e.stopPropagation(); // Evita que el click en el slot cambie de vista
                        if (onSlotClick) onSlotClick(slot);
                      }}
                      tabIndex={0}
                    >
                      <div className="font-bold text-lg truncate text-center w-full">
                        {slot.clientName}
                      </div>
                      {hoveredSlotId === slot.appointmentId && (
                        <div
                          className="
                            absolute left-1/2 bottom-full z-50 w-[240px] -translate-x-1/2 mb-3 px-4 py-3 rounded-lg shadow-xl
                            bg-gray-900 dark:bg-gray-800 text-gray-100 dark:text-gray-200
                            border border-gray-700 dark:border-gray-600 text-base
                            pointer-events-none
                            animate-fadeIn
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
                            {slot.endTime.slice(0, 5)}
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
