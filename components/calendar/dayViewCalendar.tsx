import React from "react";
import { ScheduleResponse, OccupiedSlot } from "@/types";

type SlotWithDate = OccupiedSlot & { date: string };

interface DayViewCalendarProps {
  schedule: ScheduleResponse;
  date: Date;
  onHourClick?: (time: string) => void;
  onSlotClick?: (slot: SlotWithDate) => void;
}

// Genera líneas de hora para referencia visual
function generateHourLines(start = 9, end = 17, stepMinutes = 30) {
  const lines = [];
  for (let h = start; h < end; h++) {
    for (let m = 0; m < 60; m += stepMinutes) {
      // que altura tiene cada linea de pixeles
      
      lines.push(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
    }
  }
  console.log("Hour lines generated:", lines);
  return lines;
}

// Calcula la posición vertical en función de la hora (para slots)
function timeToPosition(time: string, visualStartHour = 9) {
  console.log("Calculating position for time:", time);
  const [h, m] = time.split(":").map(Number);
  const totalMinutes = (h - visualStartHour) * 60 + m+15;
  console.log(totalMinutes, "total minutes");
  const slotHeight = 80; // px por hora
  const pixelsPerMinute = slotHeight / 60;
  console.log(`hour height:${time}`,totalMinutes * pixelsPerMinute );
  return totalMinutes * pixelsPerMinute;
}

export const DayViewCalendar: React.FC<DayViewCalendarProps> = ({
  schedule,
  date,
  onHourClick,
  onSlotClick,
}) => {
  const dateStr = date.toISOString().split("T")[0];
  const daySchedule = schedule.schedule.find((d) => d.date === dateStr);

  // Calcular el primer horario visualizado según la grilla
  // Si quieres que siempre arranque a las 08:00, déjalo en 8
  // Si quieres que arranque basado en tus líneas visuales, usa el primer valor
  const visualStartHour = 9; // Cambia este valor para que coincida con la grilla (en tu imagen empieza en 09:00)
  const visualEndHour = 18;  // Puedes ajustar el final también

  // Horas de trabajo reales (para slots)
  const startHour = daySchedule?.workingHours?.start
    ? parseInt(daySchedule.workingHours.start.split(":")[0])
    : visualStartHour;
  const endHour = daySchedule?.workingHours?.end
    ? parseInt(daySchedule.workingHours.end.split(":")[0])
    : visualEndHour;

  const hourLines = generateHourLines(visualStartHour, visualEndHour, 30);

  const slots = daySchedule
    ? daySchedule.occupiedSlots.map((slot) => ({ ...slot, date: daySchedule.date }))
    : [];

  return (
    <div className="overflow-x-auto">
      <div
        className="relative rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm mx-auto"
        style={{ height: `${hourLines.length * 40}px`, minHeight: "600px",  }}
      >
        {/* Líneas de hora */}
        <div className="absolute left-0 w-full z-0 pointer-events-none">
          {hourLines.map((hour, i) => (
            <div
              key={hour}
              style={{
                position: "absolute",
                top: `${i * 40}px`,
                width: "100%",
                height: "40px",
                left: 0,
                display: "flex",
                alignItems: "center"
              }}
            >
              <div className="flex items-center w-full">
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
            </div>
          ))}
        </div>
        {/* Slots ocupados */}
        <div className="relative w-full h-full z-10">
          {slots.map((slot) => {
            const top = timeToPosition(slot.startTime.slice(0, 5), visualStartHour); // Usa visualStartHour aquí
            const end = slot.endTime ? slot.endTime.slice(0, 5) : slot.startTime.slice(0, 5);
            const durationMinutes =
              (parseInt(end.split(":")[0]) * 60 + parseInt(end.split(":")[1])) -
              (parseInt(slot.startTime.split(":")[0]) * 60 + parseInt(slot.startTime.split(":")[1]));
            const slotHeight = Math.max((durationMinutes / 60) * 80, 40);

            return (
              <div
                key={slot.appointmentId}
                style={{
                  position: "absolute",
                  left: "70px",
                  top: `${top}px`,
                  width: "calc(100% - 80px)",
                  height: `${slotHeight}px`,
                  zIndex: 2,
                  overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.15)"
                }}
                className={`
                  transition
                  bg-blue-500 dark:bg-blue-700
                  border-l-4 border-blue-600 dark:border-blue-400
                  rounded-xl
                  px-4 py-3
                  mb-2
                  cursor-pointer
                  flex flex-row items-center justify-between
                  hover:scale-105
                  hover:bg-blue-600 dark:hover:bg-blue-800
                  text-white
                `}
                onClick={() => onSlotClick && onSlotClick(slot)}
                tabIndex={0}
              >
                <div className="flex flex-col text-left w-2/3">
                  <div className="font-bold text-lg truncate">{slot.clientName}</div>
                  <div className="truncate text-base font-medium">{slot.serviceName}</div>
                </div>
                <div className="text-right w-1/3 pl-4">
                  <div className="text-base font-semibold">
                    {slot.startTime.slice(0,5)} - {slot.endTime.slice(0,5)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* Click en fondo para crear cita */}
        <div
          className="absolute left-[70px] top-0 w-[calc(100%-80px)] h-full z-0"
          onClick={e => {
            const rect = (e.target as HTMLDivElement).getBoundingClientRect();
            const y = e.clientY - rect.top;
            const minutes = y / (64 / 60);
            const hour = Math.floor(minutes / 60) + visualStartHour;
            const min = Math.floor(minutes % 60 / 5) * 5;
            const timeStr = `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
            if (onHourClick) onHourClick(timeStr);
          }}
          style={{ cursor: onHourClick ? "pointer" : "default" }}
        />
      </div>
    </div>
  );
};