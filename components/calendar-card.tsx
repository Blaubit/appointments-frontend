import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Ban, Clock } from "lucide-react";
import type { User, PeriodResponse } from "@/types";
import { findPeriod } from "@/actions/calendar/findPeriod";

interface CalendarCardProps {
  onDateSelect?: (dateStr: string) => void;
  initialDate?: Date;
  workingDays?: Set<string>;
  selectedProfessional?: User | null;
}

type DayStatus =
  | "working"
  | "non-working"
  | "restricted-full"
  | "restricted-partial";

interface DayInfo {
  status: DayStatus;
  reason?: string;
}

export const CalendarCard: React.FC<CalendarCardProps> = ({
  onDateSelect,
  initialDate,
  workingDays = new Set(),
  selectedProfessional,
}) => {
  const validInitialDate =
    initialDate && !isNaN(initialDate.getTime()) ? initialDate : undefined;

  const [selectedDate, setSelectedDate] = useState<string>(
    validInitialDate ? validInitialDate.toISOString().split("T")[0] : ""
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(
    validInitialDate
      ? new Date(validInitialDate.getFullYear(), validInitialDate.getMonth(), 1)
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );

  // NUEVO: Estado más completo que incluye restricciones
  const [daysInfo, setDaysInfo] = useState<Map<string, DayInfo>>(new Map());
  const [isLoadingMonth, setIsLoadingMonth] = useState<boolean>(false);
  const [cachedMonths, setCachedMonths] = useState<
    Map<string, Map<string, DayInfo>>
  >(new Map());

  useEffect(() => {
    if (validInitialDate) {
      const dateStr = validInitialDate.toISOString().split("T")[0];
      setSelectedDate(dateStr);
      setCurrentMonth(
        new Date(validInitialDate.getFullYear(), validInitialDate.getMonth(), 1)
      );
    }
  }, [validInitialDate]);

  useEffect(() => {
    if (!selectedProfessional) {
      setDaysInfo(new Map());
      setCachedMonths(new Map());
      return;
    }
  }, [selectedProfessional]);

  // Cargar datos del mes completo incluyendo restricciones
  useEffect(() => {
    if (!selectedProfessional) return;

    const loadMonthData = async () => {
      const monthStr = currentMonth.toISOString().slice(0, 7);
      const profId = selectedProfessional.id?.toString() ?? "unknown";
      const monthKey = `${profId}:${monthStr}`;

      if (cachedMonths.has(monthKey)) {
        setDaysInfo(cachedMonths.get(monthKey)!);
        return;
      }

      setIsLoadingMonth(true);
      try {
        const result = await findPeriod(
          selectedProfessional.id.toString(),
          monthStr,
          "month"
        );

        if (result && "data" in result && result.data) {
          const monthSchedule = result.data as PeriodResponse;
          const newDaysInfo = new Map<string, DayInfo>();

          if (monthSchedule.schedule && Array.isArray(monthSchedule.schedule)) {
            monthSchedule.schedule.forEach((day: any) => {
              const hasWorkingHours =
                day.workingHours &&
                day.workingHours.start !== null &&
                day.workingHours.end !== null;

              if (!hasWorkingHours) {
                // Día no laboral
                newDaysInfo.set(day.date, {
                  status: "non-working",
                });
              } else if (
                day.isRestricted &&
                day.restrictionType === "full-day"
              ) {
                // Día con restricción completa
                const reason = day.restrictions?.[0]?.reason || "Día bloqueado";
                newDaysInfo.set(day.date, {
                  status: "restricted-full",
                  reason,
                });
              } else if (
                day.isRestricted &&
                day.restrictionType === "partial"
              ) {
                // Día con restricción parcial
                const restrictionCount = day.restrictions?.length || 0;
                const reason = `${restrictionCount} horario${restrictionCount > 1 ? "s" : ""} bloqueado${restrictionCount > 1 ? "s" : ""}`;
                newDaysInfo.set(day.date, {
                  status: "restricted-partial",
                  reason,
                });
              } else {
                // Día laboral normal
                newDaysInfo.set(day.date, {
                  status: "working",
                });
              }
            });
          }

          setDaysInfo(newDaysInfo);
          setCachedMonths((prev) => {
            const next = new Map(prev);
            next.set(monthKey, newDaysInfo);
            return next;
          });
        }
      } catch (error) {
        console.error("Error loading month data:", error);
        setDaysInfo(new Map());
      } finally {
        setIsLoadingMonth(false);
      }
    };

    loadMonthData();
  }, [selectedProfessional, currentMonth]);

  const getCalendarSlots = (date: Date): (Date | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const totalDays = lastDayOfMonth.getDate();

    const leadingBlanks = (firstDayOfMonth.getDay() + 6) % 7;
    const slots: (Date | null)[] = [];

    for (let i = 0; i < leadingBlanks; i++) {
      slots.push(null);
    }

    for (let day = 1; day <= totalDays; day++) {
      slots.push(new Date(year, month, day));
    }

    while (slots.length % 7 !== 0) {
      slots.push(null);
    }

    return slots;
  };

  const calendarSlots = getCalendarSlots(currentMonth);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split("T")[0];

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentMonth(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
  };

  const handleDateSelect = (date: Date) => {
    if (isNaN(date.getTime())) return;

    const dateStr = date.toISOString().split("T")[0];
    const dayInfo = daysInfo.get(dateStr);
    const isPast = date.getTime() < today.getTime();

    // Solo permitir selección si no es pasado, no es no-laboral y no está completamente restringido
    const isDisabled =
      isPast ||
      dayInfo?.status === "non-working" ||
      dayInfo?.status === "restricted-full";

    if (!isDisabled) {
      setSelectedDate(dateStr);
      const newCurrentMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      setCurrentMonth(newCurrentMonth);
      if (onDateSelect) onDateSelect(dateStr);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fecha</CardTitle>
        <CardDescription>Selecciona la fecha para la cita</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => changeMonth(-1)}
            className="hover:text-blue-600"
            type="button"
          >
            <ChevronLeft />
          </button>
          <span className="font-semibold text-lg capitalize">
            {currentMonth.toLocaleString("es-ES", {
              month: "long",
              year: "numeric",
            })}
          </span>
          <button
            onClick={() => changeMonth(1)}
            className="hover:text-blue-600"
            type="button"
          >
            <ChevronRight />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500 py-1"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {Array.from({
            length: Math.ceil(calendarSlots.length / 7),
          }).map((_, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-2">
              {calendarSlots
                .slice(weekIndex * 7, (weekIndex + 1) * 7)
                .map((slot, slotIndex) => {
                  if (!slot) {
                    return <div key={slotIndex} className="p-2" />;
                  }

                  const date = slot;
                  if (isNaN(date.getTime())) return <div key={slotIndex} />;

                  const dateStr = date.toISOString().split("T")[0];
                  const isSelected = selectedDate === dateStr;
                  const isToday = dateStr === todayStr;
                  const isPast = date.getTime() < today.getTime();
                  const dayInfo = daysInfo.get(dateStr);

                  let buttonClasses =
                    "p-2 text-sm rounded-lg transition-colors relative group";
                  let isDisabled = false;
                  let tooltipText = "";
                  let icon: React.ReactNode = null;

                  if (isPast) {
                    buttonClasses +=
                      " text-gray-300 dark:text-gray-600 cursor-not-allowed bg-gray-100 dark:bg-gray-800";
                    isDisabled = true;
                    tooltipText = "Fecha pasada";
                  } else if (dayInfo?.status === "non-working") {
                    buttonClasses +=
                      " text-red-400 dark:text-red-500 cursor-not-allowed bg-red-50 dark:bg-red-950/30 line-through";
                    isDisabled = true;
                    tooltipText = "Día no laboral";
                  } else if (dayInfo?.status === "restricted-full") {
                    buttonClasses +=
                      " text-orange-500 dark:text-orange-400 cursor-not-allowed bg-orange-50 dark:bg-orange-950/30";
                    isDisabled = true;
                    tooltipText =
                      dayInfo.reason || "Día bloqueado completamente";
                    icon = (
                      <Ban className="w-3 h-3 absolute top-0. 5 right-0.5 text-orange-500" />
                    );
                  } else if (dayInfo?.status === "restricted-partial") {
                    if (isSelected) {
                      buttonClasses +=
                        " bg-yellow-500 text-white ring-2 ring-yellow-600";
                    } else {
                      buttonClasses +=
                        " bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/40";
                    }
                    tooltipText = dayInfo.reason || "Restricciones parciales";
                    icon = (
                      <Clock className="w-3 h-3 absolute top-0.5 right-0. 5 text-yellow-600 dark:text-yellow-500" />
                    );
                  } else {
                    // Día laboral normal
                    if (isSelected) {
                      buttonClasses += " bg-blue-500 text-white";
                    } else if (isToday) {
                      buttonClasses +=
                        " bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 ring-2 ring-blue-400";
                    } else {
                      buttonClasses +=
                        " hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100";
                    }
                  }

                  return (
                    <button
                      key={slotIndex}
                      type="button"
                      disabled={isDisabled}
                      className={buttonClasses}
                      onClick={() => handleDateSelect(date)}
                    >
                      {date.getDate()}
                      {icon}

                      {/* Tooltip */}
                      {tooltipText && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                          {tooltipText}
                        </div>
                      )}
                    </button>
                  );
                })}
            </div>
          ))}
        </div>

        {isLoadingMonth && (
          <div className="mt-2 text-xs text-gray-400 text-center">
            Cargando disponibilidad...
          </div>
        )}

        {/* Leyenda actualizada */}
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 space-y-1. 5">
          <div className="font-semibold mb-2">Leyenda:</div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded flex items-center justify-center">
              <span className="text-[8px]">✕</span>
            </div>
            <span>Día no laboral / Pasado</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-50 dark:bg-orange-950/30 rounded flex items-center justify-center border border-orange-300">
              <Ban className="w-2. 5 h-2.5 text-orange-500" />
            </div>
            <span>Día bloqueado (sin disponibilidad)</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-50 dark:bg-yellow-950/30 rounded flex items-center justify-center border border-yellow-300">
              <Clock className="w-2.5 h-2.5 text-yellow-600" />
            </div>
            <span>Restricciones parciales (disponibilidad limitada)</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900 rounded ring-2 ring-blue-400"></div>
            <span>Hoy</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Fecha seleccionada</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
