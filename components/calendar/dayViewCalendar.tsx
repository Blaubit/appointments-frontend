import React, { useState } from "react";
import { ScheduleResponse, OccupiedSlot, PeriodResponse } from "@/types";

type SlotWithDate = OccupiedSlot & { date: string };

interface DayViewCalendarProps {
  schedule: PeriodResponse;
  date: Date;
  onHourClick?: (time: string) => void;
  onSlotClick?: (slot: SlotWithDate) => void;
}

function generateHourLines(start: number, end: number, stepMinutes = 30) {
  const lines = [];
  for (let h = start; h < end; h++) {
    for (let m = 0; m < 60; m += stepMinutes) {
      lines.push(
        `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
      );
    }
  }
  return lines;
}

function timeStringToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTimeString(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

function isTimeWithinWorkingHours(
  time: string,
  workingStart: string,
  workingEnd: string
): boolean {
  const timeMinutes = timeStringToMinutes(time + ":00");
  const startMinutes = timeStringToMinutes(workingStart);
  const endMinutes = timeStringToMinutes(workingEnd);
  return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
}

function timeToPosition(time: string, visualStartHour: number) {
  const [h, m] = time.split(":").map(Number);
  const totalMinutes = (h - visualStartHour) * 60 + m + 15;
  const slotHeight = 80; // px por hora
  const pixelsPerMinute = slotHeight / 60;
  return totalMinutes * pixelsPerMinute;
}

function getFreeAreas(
  slots: any[],
  visualStartHour: number,
  visualEndHour: number
) {
  if (!slots.length) {
    const totalEnd = timeToPosition(
      `${visualEndHour.toString().padStart(2, "0")}:00`,
      visualStartHour
    );
    return [{ start: 0, end: totalEnd }];
  }

  // Ordenar slots por hora de inicio
  const sortedSlots = slots
    .map((slot) => ({
      start: timeToPosition(slot.startTime.slice(0, 5), visualStartHour),
      end: timeToPosition(slot.endTime.slice(0, 5), visualStartHour),
    }))
    .sort((a, b) => a.start - b.start);

  const freeAreas: { start: number; end: number }[] = [];
  let lastEnd = 0;

  for (const slot of sortedSlots) {
    // Solo agregar área libre si hay espacio significativo (más de 30px = ~23 minutos)
    if (slot.start > lastEnd + 30) {
      freeAreas.push({ start: lastEnd, end: slot.start });
    }
    lastEnd = Math.max(lastEnd, slot.end);
  }

  const totalEnd = timeToPosition(
    `${visualEndHour.toString().padStart(2, "0")}:00`,
    visualStartHour
  );

  // Agregar área libre al final si hay espacio significativo
  if (lastEnd + 30 < totalEnd) {
    freeAreas.push({ start: lastEnd, end: totalEnd });
  }

  return freeAreas;
}

function positionToTime(position: number, visualStartHour: number): string {
  const pixelsPerMinute = 80 / 60; // 80px por hora
  const totalMinutes = Math.round(position / pixelsPerMinute);
  const hours = Math.floor(totalMinutes / 60) + visualStartHour;
  const minutes = totalMinutes % 60;

  // Redondear a intervalos de 15 minutos
  const roundedMinutes = Math.round(minutes / 15) * 15;
  const finalHours = roundedMinutes >= 60 ? hours + 1 : hours;
  const finalMinutes = roundedMinutes >= 60 ? 0 : roundedMinutes;

  return `${finalHours.toString().padStart(2, "0")}:${finalMinutes.toString().padStart(2, "0")}`;
}

export const DayViewCalendar: React.FC<DayViewCalendarProps> = ({
  schedule,
  date,
  onHourClick,
  onSlotClick,
}) => {
  const [hoverHour, setHoverHour] = useState<string | null>(null);
  const [hoverSlotId, setHoverSlotId] = useState<string | null>(null);

  const dateStr = date.toISOString().split("T")[0];
  const daySchedule = schedule.schedule.find((d) => d.date === dateStr);

  const hasWorkingHours =
    daySchedule?.workingHours?.start && daySchedule?.workingHours?.end;

  let visualStartHour = 9;
  let visualEndHour = 18;

  if (
    hasWorkingHours &&
    daySchedule?.workingHours?.start &&
    daySchedule?.workingHours?.end
  ) {
    const startMinutes = timeStringToMinutes(daySchedule.workingHours.start);
    const endMinutes = timeStringToMinutes(daySchedule.workingHours.end);
    visualStartHour = Math.floor(startMinutes / 60);
    visualEndHour = Math.ceil(endMinutes / 60);
    visualStartHour = Math.max(0, visualStartHour);
    visualEndHour = Math.min(24, visualEndHour + 1);
  }

  const hourLines = generateHourLines(visualStartHour, visualEndHour, 30);

  let filteredAvailableHours: string[] = [];
  if (
    hasWorkingHours &&
    daySchedule?.workingHours?.start &&
    daySchedule?.workingHours?.end
  ) {
    filteredAvailableHours = (daySchedule?.availableHours || []).filter(
      (hour: any) =>
        isTimeWithinWorkingHours(
          hour,
          daySchedule.workingHours!.start!,
          daySchedule.workingHours!.end!
        )
    );
  } else {
    filteredAvailableHours = daySchedule?.availableHours || [];
  }

  const slots = daySchedule
    ? daySchedule.occupiedSlots.map((slot: any) => ({
        ...slot,
        date: daySchedule.date,
      }))
    : [];

  const freeAreas = getFreeAreas(slots, visualStartHour, visualEndHour);

  function handleMouseMoveCalendar(e: React.MouseEvent<HTMLDivElement>) {
    // Verificar que no estamos sobre un slot ocupado
    const target = e.target as HTMLElement;
    const slotElement = target.closest('[data-slot="true"]');
    if (slotElement) {
      setHoverHour(null);
      return;
    }

    // Obtener la posición Y relativa al contenedor del calendario
    const calendarRect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - calendarRect.top;

    // Verificar si estamos en un área libre
    const currentArea = freeAreas.find(
      (area) => y >= area.start && y <= area.end
    );
    if (!currentArea) {
      setHoverHour(null);
      return;
    }

    // Convertir posición Y a hora
    const timeAtPosition = positionToTime(y, visualStartHour);

    // Buscar la hora disponible más cercana
    if (filteredAvailableHours.length > 0) {
      let closestHour = filteredAvailableHours[0];
      let minDiff = Infinity;

      for (const availableHour of filteredAvailableHours) {
        const availablePosition = timeToPosition(
          availableHour,
          visualStartHour
        );
        // Solo considerar horas que están dentro del área libre actual
        if (
          availablePosition >= currentArea.start &&
          availablePosition <= currentArea.end
        ) {
          const diff = Math.abs(availablePosition - y);
          if (diff < minDiff) {
            minDiff = diff;
            closestHour = availableHour;
          }
        }
      }

      // Solo mostrar hover si encontramos una hora válida en esta área (dentro de 40px)
      if (minDiff < 40) {
        setHoverHour(closestHour);
      } else {
        setHoverHour(null);
      }
    } else {
      setHoverHour(null);
    }
  }

  function handleMouseLeaveCalendar() {
    setHoverHour(null);
  }

  function handleCalendarClick(e: React.MouseEvent<HTMLDivElement>) {
    // Verificar que no estamos clickeando sobre un slot
    const target = e.target as HTMLElement;
    const slotElement = target.closest('[data-slot="true"]');
    if (slotElement) {
      return; // Dejar que el slot maneje su propio click
    }

    if (hoverHour && onHourClick) {
      onHourClick(hoverHour);
    }
  }

  if (!daySchedule || !hasWorkingHours) {
    return (
      <div className="overflow-hidden">
        <div className="relative rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm mx-auto min-h-[600px] flex items-center justify-center">
          <div className="text-center p-8">
            <div className="text-gray-400 dark:text-gray-500 text-lg mb-2">
              📅
            </div>
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
              No hay horarios laborales configurados
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Este día no tiene horarios de trabajo establecidos
            </p>
          </div>
        </div>
      </div>
    );
  }

  const containerHeight = Math.max(hourLines.length * 40, 600);

  if (filteredAvailableHours.length === 0) {
    return (
      <div className="overflow-hidden">
        <div
          className="relative rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm mx-auto"
          style={{ height: `${containerHeight}px` }}
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
                  alignItems: "center",
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
          <div className="relative w-full h-full z-20">
            {slots.map((slot: any) => {
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
              const slotHeight = Math.max((durationMinutes / 60) * 80, 40);
              const isHovered = hoverSlotId === slot.appointmentId;

              return (
                <div
                  key={slot.appointmentId}
                  data-slot="true"
                  style={{
                    position: "absolute",
                    left: "70px",
                    top: `${top}px`,
                    width: "calc(100% - 80px)",
                    height: `${slotHeight}px`,
                    zIndex: 15,
                    overflow: "hidden",
                    boxShadow: isHovered
                      ? "0 4px 24px rgba(0,0,128,0.30)"
                      : "0 2px 12px rgba(0,0,0,0.15)",
                    transform: isHovered ? "scale(1.04)" : "scale(1)",
                    transition: "all 0.18s cubic-bezier(.4,2,.3,1)",
                    pointerEvents: "auto",
                  }}
                  className={`
                    bg-blue-500 dark:bg-blue-700
                    border-l-4 border-blue-600 dark:border-blue-400
                    rounded-xl
                    px-4 py-3
                    mb-2
                    cursor-pointer
                    flex flex-row items-center justify-between
                    hover:bg-blue-600 dark:hover:bg-blue-800
                    text-white
                  `}
                  onClick={() => onSlotClick && onSlotClick(slot)}
                  tabIndex={0}
                  onMouseEnter={() => setHoverSlotId(slot.appointmentId)}
                  onMouseLeave={() => setHoverSlotId(null)}
                >
                  <div className="flex flex-col text-left w-2/3">
                    <div className="font-bold text-lg truncate">
                      {slot.clientName}
                    </div>
                    <div className="truncate text-base font-medium">
                      {slot.serviceName}
                    </div>
                  </div>
                  <div className="text-right w-1/3 pl-4">
                    <div className="text-base font-semibold">
                      {slot.startTime.slice(0, 5)} - {slot.endTime.slice(0, 5)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mensaje superpuesto cuando no hay horas disponibles */}
          <div className="absolute inset-0 flex items-center justify-center z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <div className="text-center p-8">
              <div className="text-gray-400 dark:text-gray-500 text-lg mb-2">
                ⏰
              </div>
              <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                No hay horarios disponibles
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Todos los horarios están ocupados para este día
                {daySchedule?.workingHours?.start &&
                  daySchedule?.workingHours?.end && (
                    <>
                      <br />
                      <span className="text-xs">
                        Horario laboral:{" "}
                        {daySchedule.workingHours.start.slice(0, 5)} -{" "}
                        {daySchedule.workingHours.end.slice(0, 5)}
                      </span>
                    </>
                  )}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Renderizado normal cuando hay horas disponibles
  return (
    <div className="overflow-hidden">
      <div
        className="relative rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm mx-auto cursor-pointer"
        style={{ height: `${containerHeight}px` }}
        onMouseMove={handleMouseMoveCalendar}
        onMouseLeave={handleMouseLeaveCalendar}
        onClick={handleCalendarClick}
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
                alignItems: "center",
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
        <div className="relative w-full h-full z-20">
          {slots.map((slot: any) => {
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
            const slotHeight = Math.max((durationMinutes / 60) * 80, 40);
            const isHovered = hoverSlotId === slot.appointmentId;

            return (
              <div
                key={slot.appointmentId}
                data-slot="true"
                style={{
                  position: "absolute",
                  left: "70px",
                  top: `${top}px`,
                  width: "calc(100% - 80px)",
                  height: `${slotHeight}px`,
                  zIndex: 25, // Mayor z-index para que esté sobre las áreas libres
                  overflow: "hidden",
                  boxShadow: isHovered
                    ? "0 4px 24px rgba(0,0,128,0.30)"
                    : "0 2px 12px rgba(0,0,0,0.15)",
                  transform: isHovered ? "scale(1.04)" : "scale(1)",
                  transition: "all 0.18s cubic-bezier(.4,2,.3,1)",
                  pointerEvents: "auto",
                }}
                className={`
                  bg-blue-500 dark:bg-blue-700
                  border-l-4 border-blue-600 dark:border-blue-400
                  rounded-xl
                  px-4 py-3
                  mb-2
                  cursor-pointer
                  flex flex-row items-center justify-between
                  hover:bg-blue-600 dark:hover:bg-blue-800
                  text-white
                `}
                onClick={(e) => {
                  e.stopPropagation();
                  onSlotClick && onSlotClick(slot);
                }}
                tabIndex={0}
                onMouseEnter={() => setHoverSlotId(slot.appointmentId)}
                onMouseLeave={() => setHoverSlotId(null)}
              >
                <div className="flex flex-col text-left w-2/3">
                  <div className="font-bold text-lg truncate">
                    {slot.clientName}
                  </div>
                  <div className="truncate text-base font-medium">
                    {slot.serviceName}
                  </div>
                </div>
                <div className="text-right w-1/3 pl-4">
                  <div className="text-base font-semibold">
                    {slot.startTime.slice(0, 5)} - {slot.endTime.slice(0, 5)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Indicador flotante azul */}
        {hoverHour && filteredAvailableHours.length > 0 && (
          <div
            className="absolute left-[70px] w-[calc(100%-80px)] z-30 pointer-events-none"
            style={{
              top: `${timeToPosition(hoverHour, visualStartHour) - 18}px`,
              height: "36px",
            }}
          >
            <div
              className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded px-3 py-1 text-sm font-bold shadow-lg border border-blue-300 dark:border-blue-700"
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                transform: "translateY(0)",
              }}
            >
              {hoverHour}
            </div>
            <div
              className="w-full border-t-2 border-dashed border-blue-400 dark:border-blue-500"
              style={{
                position: "absolute",
                top: "18px",
                left: 0,
                opacity: 0.7,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
