import React, { useState } from "react";
import { OccupiedSlot, PeriodResponse } from "@/types";
import { Ban } from "lucide-react";

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

  const sortedSlots = slots
    .map((slot) => ({
      start: timeToPosition(slot.startTime.slice(0, 5), visualStartHour),
      end: timeToPosition(slot.endTime.slice(0, 5), visualStartHour),
    }))
    .sort((a, b) => a.start - b.start);

  const freeAreas: { start: number; end: number }[] = [];
  let lastEnd = 0;

  for (const slot of sortedSlots) {
    if (slot.start > lastEnd + 30) {
      freeAreas.push({ start: lastEnd, end: slot.start });
    }
    lastEnd = Math.max(lastEnd, slot.end);
  }

  const totalEnd = timeToPosition(
    `${visualEndHour.toString().padStart(2, "0")}:00`,
    visualStartHour
  );

  if (lastEnd + 30 < totalEnd) {
    freeAreas.push({ start: lastEnd, end: totalEnd });
  }

  return freeAreas;
}

function positionToTime(position: number, visualStartHour: number): string {
  const pixelsPerMinute = 80 / 60;
  const totalMinutes = Math.round(position / pixelsPerMinute);
  const hours = Math.floor(totalMinutes / 60) + visualStartHour;
  const minutes = totalMinutes % 60;

  const roundedMinutes = Math.round(minutes / 15) * 15;
  const finalHours = roundedMinutes >= 60 ? hours + 1 : hours;
  const finalMinutes = roundedMinutes >= 60 ? 0 : roundedMinutes;

  return `${finalHours.toString().padStart(2, "0")}:${finalMinutes
    .toString()
    .padStart(2, "0")}`;
}

/**
 * computeSlotLayouts
 * - Agrupa las citas que se solapan (clusters).
 * - Dentro de cada cluster asigna columnas (colIndex) usando un algoritmo greedy.
 * - Devuelve para cada slot: top, height, colIndex y columnsCount para renderizar lado a lado.
 */
function computeSlotLayouts(
  slots: any[],
  visualStartHour: number
): Array<
  {
    appointmentId: string;
    startTime: string;
    endTime: string;
    clientName?: string;
    serviceName?: string;
    top: number;
    height: number;
    colIndex: number;
    columnsCount: number;
  } & any
> {
  if (!slots || slots.length === 0) return [];

  const normalized = slots
    .map((s) => {
      const start = s.startTime.slice(0, 5);
      const end = s.endTime ? s.endTime.slice(0, 5) : s.startTime.slice(0, 5);
      const startMin = timeStringToMinutes(start);
      const endMin = timeStringToMinutes(end);
      return { ...s, start, end, startMin, endMin };
    })
    .sort((a, b) => a.startMin - b.startMin || a.endMin - b.endMin);

  const groups: any[][] = [];
  let currentGroup: any[] = [];
  let currentGroupEnd = -Infinity;

  for (const slot of normalized) {
    if (currentGroup.length === 0) {
      currentGroup.push(slot);
      currentGroupEnd = slot.endMin;
    } else {
      if (slot.startMin < currentGroupEnd) {
        currentGroup.push(slot);
        currentGroupEnd = Math.max(currentGroupEnd, slot.endMin);
      } else {
        groups.push(currentGroup);
        currentGroup = [slot];
        currentGroupEnd = slot.endMin;
      }
    }
  }
  if (currentGroup.length > 0) groups.push(currentGroup);

  const layouts: any[] = [];

  for (const group of groups) {
    const columnsEndTimes: number[] = [];

    for (const slot of group) {
      let assignedCol = -1;
      for (let ci = 0; ci < columnsEndTimes.length; ci++) {
        if (columnsEndTimes[ci] <= slot.startMin) {
          assignedCol = ci;
          break;
        }
      }
      if (assignedCol === -1) {
        columnsEndTimes.push(slot.endMin);
        assignedCol = columnsEndTimes.length - 1;
      } else {
        columnsEndTimes[assignedCol] = slot.endMin;
      }

      const top = timeToPosition(slot.start, visualStartHour);
      const durationMinutes = slot.endMin - slot.startMin;
      const height = Math.max((durationMinutes / 60) * 80, 40);

      layouts.push({
        ...slot,
        top,
        height,
        colIndex: assignedCol,
        columnsCount: columnsEndTimes.length,
      });
    }

    const maxCols = Math.max(
      ...layouts
        .filter((l) => group.some((g) => g.appointmentId === l.appointmentId))
        .map((l) => l.columnsCount)
    );
    for (const l of layouts) {
      if (group.some((g) => g.appointmentId === l.appointmentId)) {
        l.columnsCount = maxCols;
      }
    }
  }

  return layouts;
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

  const isRestricted = daySchedule?.isRestricted || false;
  const restrictionType = daySchedule?.restrictionType || null;

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

  const slotLayouts = computeSlotLayouts(slots, visualStartHour);

  const freeAreas = getFreeAreas(slots, visualStartHour, visualEndHour);

  function handleMouseMoveCalendar(e: React.MouseEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement;
    const slotElement = target.closest('[data-slot="true"]');
    if (slotElement) {
      setHoverHour(null);
      return;
    }

    const calendarRect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - calendarRect.top;

    const currentArea = freeAreas.find(
      (area) => y >= area.start && y <= area.end
    );
    if (!currentArea) {
      setHoverHour(null);
      return;
    }

    const timeAtPosition = positionToTime(y, visualStartHour);

    if (filteredAvailableHours.length > 0) {
      let closestHour = filteredAvailableHours[0];
      let minDiff = Infinity;

      for (const availableHour of filteredAvailableHours) {
        const availablePosition = timeToPosition(
          availableHour,
          visualStartHour
        );
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
    const target = e.target as HTMLElement;
    const slotElement = target.closest('[data-slot="true"]');
    if (slotElement) {
      return;
    }

    // No permitir click si el día está bloqueado completamente
    if (isRestricted && restrictionType === "full-day") {
      return;
    }

    if (hoverHour && onHourClick) {
      onHourClick(hoverHour);
    }
  }

  // Mostrar overlay cuando día está bloqueado completamente
  if (isRestricted && restrictionType === "full-day") {
    return (
      <div className="overflow-hidden">
        <div
          className="relative rounded-xl border-2 border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-950/30 shadow-sm mx-auto"
          style={{ height: `${Math.max(hourLines.length * 40, 600)}px` }}
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
                    className="flex-1 border-t border-dashed border-orange-200 dark:border-orange-800"
                    style={{ marginLeft: 4 }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Patrón de líneas diagonales */}
          <div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              background:
                "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(249, 115, 22, 0.1) 10px, rgba(249, 115, 22, 0.1) 20px)",
            }}
          />

          {/* Mensaje superpuesto */}
          <div className="absolute inset-0 flex items-center justify-center z-30 bg-orange-50/90 dark:bg-orange-950/80 backdrop-blur-sm">
            <div className="text-center p-8">
              <div className="flex justify-center mb-4">
                <Ban className="w-16 h-16 text-orange-500 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-orange-700 dark:text-orange-400 mb-2">
                Día Bloqueado
              </h3>
              <p className="text-base text-orange-600 dark:text-orange-500">
                Este día no está disponible para agendar citas
              </p>
              {daySchedule?.restrictions?.[0]?.reason && (
                <p className="text-sm text-orange-600 dark:text-orange-400 mt-3 italic">
                  Motivo: {daySchedule.restrictions[0].reason}
                </p>
              )}
              {daySchedule?.workingHours?.start &&
                daySchedule?.workingHours?.end && (
                  <p className="text-xs text-orange-500 dark:text-orange-500 mt-4">
                    Horario laboral habitual:{" "}
                    {daySchedule.workingHours.start.slice(0, 5)} -{" "}
                    {daySchedule.workingHours.end.slice(0, 5)}
                  </p>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar overlay cuando no hay horarios disponibles y tampoco hay citas
  if (filteredAvailableHours.length === 0 && slots.length === 0) {
    return (
      <div className="overflow-hidden">
        <div
          className="relative rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm mx-auto"
          style={{ height: `${Math.max(hourLines.length * 40, 600)}px` }}
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

          {/* Mensaje superpuesto cuando no hay horas disponibles y tampoco hay citas */}
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

  // Renderizado normal cuando hay horas disponibles o cuando hay citas ocupadas
  return (
    <div className="overflow-hidden">
      <div
        className="relative rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm mx-auto cursor-pointer"
        style={{ height: `${Math.max(hourLines.length * 40, 600)}px` }}
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

        {/* Restricciones parciales - Renderizadas DEBAJO de las citas */}
        {isRestricted &&
          restrictionType === "partial" &&
          daySchedule?.restrictions && (
            <div className="relative w-full h-full z-15">
              <div
                style={{
                  position: "absolute",
                  left: "70px",
                  width: "calc(100% - 80px)",
                  height: "100%",
                  top: 0,
                }}
              >
                {daySchedule.restrictions.map((restriction, idx) => {
                  if (!restriction.startTime || !restriction.endTime)
                    return null;

                  const top = timeToPosition(
                    restriction.startTime.slice(0, 5),
                    visualStartHour
                  );
                  const endTime = restriction.endTime.slice(0, 5);
                  const startTime = restriction.startTime.slice(0, 5);
                  const durationMinutes =
                    parseInt(endTime.split(":")[0]) * 60 +
                    parseInt(endTime.split(":")[1]) -
                    (parseInt(startTime.split(":")[0]) * 60 +
                      parseInt(startTime.split(":")[1]));
                  const height = Math.max((durationMinutes / 60) * 80, 60);

                  return (
                    <div
                      key={idx}
                      style={{
                        position: "absolute",
                        top: `${top}px`,
                        left: 0,
                        width: "100%",
                        height: `${height}px`,
                        zIndex: 15,
                      }}
                      className="bg-yellow-100/80 dark:bg-yellow-900/40 border-2 border-yellow-500 dark:border-yellow-600 rounded-xl px-4 py-3 flex flex-col items-center justify-center pointer-events-none"
                    >
                      <Ban className="w-8 h-8 text-yellow-700 dark:text-yellow-400 mb-2" />
                      <div className="font-bold text-lg text-yellow-800 dark:text-yellow-300">
                        Horario Bloqueado
                      </div>
                      <div className="text-base font-semibold text-yellow-700 dark:text-yellow-400 mt-1">
                        {startTime} - {endTime}
                      </div>
                      {restriction.reason && (
                        <div className="text-sm italic text-yellow-700 dark:text-yellow-400 mt-2 text-center">
                          {restriction.reason}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        {/* Slots ocupados - Renderizados ENCIMA de las restricciones */}
        <div className="relative w-full h-full z-20">
          <div
            style={{
              position: "absolute",
              left: "70px",
              width: "calc(100% - 80px)",
              height: "100%",
              top: 0,
            }}
          >
            {slotLayouts.map((slot) => {
              const leftPercent =
                (slot.colIndex / Math.max(1, slot.columnsCount)) * 100;
              const widthPercent = 100 / Math.max(1, slot.columnsCount);
              const isHovered = hoverSlotId === slot.appointmentId;

              return (
                <div
                  key={slot.appointmentId}
                  data-slot="true"
                  style={{
                    position: "absolute",
                    top: `${slot.top}px`,
                    left: `${leftPercent}%`,
                    width: `calc(${widthPercent}% - 8px)`,
                    height: `${slot.height}px`,
                    zIndex: isHovered ? 40 : 25,
                    overflow: "hidden",
                    boxShadow: isHovered
                      ? "0 4px 24px rgba(0,0,128,0.30)"
                      : "0 2px 12px rgba(0,0,0,0.15)",
                    transform: isHovered ? "scale(1.02)" : "scale(1)",
                    transition: "all 0.12s ease",
                    cursor: "pointer",
                    marginRight: 8,
                  }}
                  className={`
                    bg-blue-500 dark:bg-blue-700
                    border-l-4 border-blue-600 dark:border-blue-400
                    rounded-xl
                    px-4 py-3
                    mb-2
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
                  <div className="flex flex-col text-left w-full">
                    <div className="font-bold text-lg truncate">
                      {slot.clientName}
                    </div>
                    <div className="truncate text-base font-medium">
                      {slot.serviceName}
                    </div>
                    <div className="text-right mt-2 text-sm font-semibold">
                      {slot.start.slice(0, 5)} - {slot.end.slice(0, 5)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Indicador flotante azul - Solo si NO hay restricción full-day */}
        {hoverHour &&
          filteredAvailableHours.length > 0 &&
          !(isRestricted && restrictionType === "full-day") && (
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
