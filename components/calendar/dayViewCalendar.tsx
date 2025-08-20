import React, { useState } from "react";
import { ScheduleResponse, OccupiedSlot } from "@/types";

type SlotWithDate = OccupiedSlot & { date: string };

interface DayViewCalendarProps {
  schedule: ScheduleResponse;
  date: Date;
  onHourClick?: (time: string) => void;
  onSlotClick?: (slot: SlotWithDate) => void;
}

// Genera líneas de hora para referencia visual
function generateHourLines(start: number, end: number, stepMinutes = 30) {
  const lines = [];
  for (let h = start; h < end; h++) {
    for (let m = 0; m < 60; m += stepMinutes) {
      lines.push(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
    }
  }
  
  return lines;
}

// Función para convertir tiempo string a minutos desde medianoche
function timeStringToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

// Función para convertir minutos a hora string
function minutesToTimeString(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

// Función para verificar si una hora está dentro del horario laboral
function isTimeWithinWorkingHours(time: string, workingStart: string, workingEnd: string): boolean {
  const timeMinutes = timeStringToMinutes(time + ":00");
  const startMinutes = timeStringToMinutes(workingStart);
  const endMinutes = timeStringToMinutes(workingEnd);
  
  return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
}

// Calcula la posición vertical en función de la hora (para slots)
function timeToPosition(time: string, visualStartHour: number) {
  const [h, m] = time.split(":").map(Number);
  const totalMinutes = (h - visualStartHour) * 60 + m + 15;
  const slotHeight = 80; // px por hora
  const pixelsPerMinute = slotHeight / 60;
  return totalMinutes * pixelsPerMinute;
}

export const DayViewCalendar: React.FC<DayViewCalendarProps> = ({
  schedule,
  date,
  onHourClick,
  onSlotClick,
}) => {
  // --- Indicador flotante de hora disponible ---
  const [hoverHour, setHoverHour] = useState<string | null>(null);
  const [hoverY, setHoverY] = useState<number | null>(null);
  const [isHoveringSlot, setIsHoveringSlot] = useState<boolean>(false);

  // Para slot hover visual
  const [hoverSlotId, setHoverSlotId] = useState<string | null>(null);

  // Obtén el día actual del schedule
  const dateStr = date.toISOString().split("T")[0];
  const daySchedule = schedule.schedule.find((d) => d.date === dateStr);

  // Verificar si hay horarios de trabajo configurados
  const hasWorkingHours = daySchedule?.workingHours?.start && daySchedule?.workingHours?.end;

  // Calcular horas visuales basadas en workingHours o usar valores por defecto
  let visualStartHour = 9;
  let visualEndHour = 18;

  if (hasWorkingHours && daySchedule?.workingHours?.start && daySchedule?.workingHours?.end) {
    const startMinutes = timeStringToMinutes(daySchedule.workingHours.start);
    const endMinutes = timeStringToMinutes(daySchedule.workingHours.end);
    visualStartHour = Math.floor(startMinutes / 60);
    visualEndHour = Math.ceil(endMinutes / 60);
    // Agregar un poco de padding visual (1 hora antes y después)
    visualStartHour = Math.max(0, visualStartHour);
    visualEndHour = Math.min(24, visualEndHour+1);
  }

  const hourLines = generateHourLines(visualStartHour, visualEndHour, 30);

  // Filtrar horas disponibles para que solo incluyan las que están dentro del horario laboral
  let filteredAvailableHours: string[] = [];
  if (hasWorkingHours && daySchedule?.workingHours?.start && daySchedule?.workingHours?.end) {
    filteredAvailableHours = (daySchedule?.availableHours || []).filter(hour => 
      isTimeWithinWorkingHours(hour, daySchedule.workingHours!.start!, daySchedule.workingHours!.end!)
    );
  } else {
    // Si no hay horarios laborales, usar todas las horas disponibles
    filteredAvailableHours = daySchedule?.availableHours || [];
  }

  const slots = daySchedule
    ? daySchedule.occupiedSlots.map((slot) => ({
        ...slot,
        date: daySchedule.date,
      }))
    : [];

  // Handler para mouse move solo si no está sobre slot
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Si no hay horas disponibles filtradas, no mostrar hover
    if (!filteredAvailableHours.length) {
      setHoverHour(null);
      setHoverY(null);
      return;
    }

    // Verifica si el mouse está sobre un slot ocupado
    const elements = document.elementsFromPoint(e.clientX, e.clientY);
    const isSlot = elements.some(el => (el as HTMLElement).dataset?.slot === "true");
    setIsHoveringSlot(isSlot);

    if (!isSlot) {
      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
      const y = e.clientY - rect.top;
      setHoverY(y);

      // Encuentra la hora disponible más cercana a la posición del mouse (solo de las filtradas)
      if (filteredAvailableHours.length > 0) {
        let closest = filteredAvailableHours[0];
        let minDist = Math.abs(y - timeToPosition(closest, visualStartHour));
        for (const hour of filteredAvailableHours) {
          const dist = Math.abs(y - timeToPosition(hour, visualStartHour));
          if (dist < minDist) {
            closest = hour;
            minDist = dist;
          }
        }
        setHoverHour(closest);
      }
    } else {
      setHoverHour(null);
      setHoverY(null);
    }
  };

  const handleMouseLeave = () => {
    setHoverHour(null);
    setHoverY(null);
    setIsHoveringSlot(false);
  };

  // Renderizar mensaje cuando no hay horarios de trabajo
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

  // Calcular altura exacta del contenedor
  const containerHeight = Math.max((hourLines.length - 1) * 40, 600);

  // Renderizar mensaje cuando no hay horas disponibles pero sí hay horarios de trabajo
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
          <div className="relative w-full h-full z-10">
            {slots.map((slot) => {
              const top = timeToPosition(
                slot.startTime.slice(0, 5),
                visualStartHour,
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

              // Hover visual para slot
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
                    zIndex: 2,
                    overflow: "hidden",
                    boxShadow: isHovered
                      ? "0 4px 24px rgba(0,0,128,0.30)"
                      : "0 2px 12px rgba(0,0,0,0.15)",
                    transform: isHovered ? "scale(1.04)" : "scale(1)",
                    transition: "all 0.18s cubic-bezier(.4,2,.3,1)",
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
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <div className="text-center p-8">
              <div className="text-gray-400 dark:text-gray-500 text-lg mb-2">
                ⏰
              </div>
              <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                No hay horarios disponibles
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Todos los horarios están ocupados para este día
                {daySchedule?.workingHours?.start && daySchedule?.workingHours?.end && (
                  <>
                    <br />
                    <span className="text-xs">
                      Horario laboral: {daySchedule.workingHours.start.slice(0, 5)} - {daySchedule.workingHours.end.slice(0, 5)}
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
        <div className="relative w-full h-full z-10">
          {slots.map((slot) => {
            const top = timeToPosition(
              slot.startTime.slice(0, 5),
              visualStartHour,
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

            // Hover visual para slot
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
                  zIndex: 2,
                  overflow: "hidden",
                  boxShadow: isHovered
                    ? "0 4px 24px rgba(0,0,128,0.30)"
                    : "0 2px 12px rgba(0,0,0,0.15)",
                  transform: isHovered ? "scale(1.04)" : "scale(1)",
                  transition: "all 0.18s cubic-bezier(.4,2,.3,1)",
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

        {/* Indicador flotante de hora solo si NO está sobre slot y HAY horas disponibles filtradas */}
        {hoverHour && hoverY !== null && !isHoveringSlot && filteredAvailableHours.length > 0 && (
          <div
            className="absolute left-[70px] w-[calc(100%-80px)] z-30 pointer-events-none"
            style={{
              top: `${timeToPosition(hoverHour, visualStartHour) - 18}px`,
              height: "36px",
            }}
          >
            <div
              className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded px-2 py-1 text-xs font-bold shadow border border-blue-300 dark:border-blue-700"
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                pointerEvents: "none",
                transform: "translateY(0)",
              }}
            >
              {hoverHour}
            </div>
            <div
              className="w-full border-t-2 border-dashed border-blue-300"
              style={{ position: "absolute", top: "50%", left: 0 }}
            />
          </div>
        )}

        {/* Área clickeable para crear cita y mostrar hora con hover */}
        <div
          className="absolute left-[70px] top-0 w-[calc(100%-80px)] h-full z-10"
          onClick={(e) => {
            if (!isHoveringSlot && hoverHour && filteredAvailableHours.length > 0) {
              if (onHourClick) onHourClick(hoverHour);
            }
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ cursor: onHourClick && filteredAvailableHours.length > 0 ? "pointer" : "default" }}
        />
      </div>
    </div>
  );
};