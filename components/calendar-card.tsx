import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { User, PeriodResponse } from "@/types";
import { findPeriod } from "@/actions/calendar/findPeriod";

interface CalendarCardProps {
  onDateSelect?: (dateStr: string) => void;
  initialDate?: Date;
  workingDays?: Set<string>;
  selectedProfessional?: User | null;
}

export const CalendarCard: React.FC<CalendarCardProps> = ({
  onDateSelect,
  initialDate,
  workingDays = new Set(),
  selectedProfessional,
}) => {
  // Valida initialDate para evitar NaN/Invalid Date
  const validInitialDate =
    initialDate && !isNaN(initialDate.getTime()) ? initialDate : undefined;

  // Estado para fecha seleccionada y mes actual
  const [selectedDate, setSelectedDate] = useState<string>(
    validInitialDate ? validInitialDate.toISOString().split("T")[0] : ""
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(
    validInitialDate
      ? new Date(validInitialDate.getFullYear(), validInitialDate.getMonth(), 1)
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );

  const [nonWorkingDays, setNonWorkingDays] = useState<Set<string>>(new Set());
  const [isLoadingMonth, setIsLoadingMonth] = useState<boolean>(false);
  const [cachedMonths, setCachedMonths] = useState<Map<string, Set<string>>>(
    new Map()
  );

  // Sincroniza selectedDate y currentMonth si initialDate cambia
  useEffect(() => {
    if (validInitialDate) {
      const dateStr = validInitialDate.toISOString().split("T")[0];
      setSelectedDate(dateStr);
      setCurrentMonth(
        new Date(validInitialDate.getFullYear(), validInitialDate.getMonth(), 1)
      );
    }
  }, [validInitialDate]);

  // Si no hay profesional seleccionado, limpiar estados relevantes (evita que queden días del profesional anterior)
  useEffect(() => {
    if (!selectedProfessional) {
      setNonWorkingDays(new Set());
      setCachedMonths(new Map());
      return;
    }
    // No hacemos nada aquí si sí hay profesional: la carga del mes se maneja abajo.
  }, [selectedProfessional]);

  // Cargar datos del mes completo cuando cambian profesional o mes
  useEffect(() => {
    if (!selectedProfessional) return;

    const loadMonthData = async () => {
      const monthStr = currentMonth.toISOString().slice(0, 7);
      const profId = selectedProfessional.id?.toString() ?? "unknown";
      const monthKey = `${profId}:${monthStr}`;

      // Verificar si ya está en caché (ahora la clave incluye el profesional)
      if (cachedMonths.has(monthKey)) {
        setNonWorkingDays(cachedMonths.get(monthKey)!);
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

          // Procesar todos los días del mes
          const nonWorking = new Set<string>();

          if (monthSchedule.schedule && Array.isArray(monthSchedule.schedule)) {
            // Un día es NO laboral si workingHours es null o no tiene start/end
            monthSchedule.schedule.forEach((day: any) => {
              const hasWorkingHours =
                day.workingHours &&
                day.workingHours.start !== null &&
                day.workingHours.end !== null;

              if (!hasWorkingHours) {
                nonWorking.add(day.date);
              }
            });
          }

          setNonWorkingDays(nonWorking);
          // Guardar en caché usando la clave con profesional
          setCachedMonths((prev) => {
            const next = new Map(prev);
            next.set(monthKey, nonWorking);
            return next;
          });
        }
      } catch (error) {
        console.error("Error loading month data:", error);
        setNonWorkingDays(new Set());
      } finally {
        setIsLoadingMonth(false);
      }
    };

    loadMonthData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProfessional, currentMonth]);

  // Genera "slots" del mes actual (incluye celdas vacías hasta el primer día)
  const getCalendarSlots = (date: Date): (Date | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const totalDays = lastDayOfMonth.getDate();

    // JS getDay(): 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    // Queremos que la semana empiece en Lunes => calcular offset:
    const leadingBlanks = (firstDayOfMonth.getDay() + 6) % 7; // Monday -> 0, Sunday -> 6

    const slots: (Date | null)[] = [];

    // Agregar celdas vacías antes del 1º del mes
    for (let i = 0; i < leadingBlanks; i++) {
      slots.push(null);
    }

    // Agregar los días reales
    for (let day = 1; day <= totalDays; day++) {
      slots.push(new Date(year, month, day));
    }

    // Completar la última semana con celdas vacías si es necesario (opcional, para cuadrícula completa)
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
    const isDisabled =
      date.getTime() < today.getTime() || nonWorkingDays.has(dateStr);

    if (!isDisabled) {
      setSelectedDate(dateStr);
      // Asegurar que currentMonth se actualiza correctamente
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
                    // Celda vacía (antes o después del mes)
                    return <div key={slotIndex} className="p-2" />;
                  }

                  const date = slot;
                  if (isNaN(date.getTime())) return <div key={slotIndex} />;

                  const dateStr = date.toISOString().split("T")[0];
                  const isSelected = selectedDate === dateStr;
                  const isToday = dateStr === todayStr;
                  const isPast = date.getTime() < today.getTime();
                  const isNonWorking = nonWorkingDays.has(dateStr);
                  const isDisabled = isPast || isNonWorking;

                  return (
                    <button
                      key={slotIndex}
                      type="button"
                      disabled={isDisabled}
                      title={
                        isPast
                          ? "Fecha pasada"
                          : isNonWorking
                            ? "Día no laboral"
                            : undefined
                      }
                      className={`p-2 text-sm rounded-lg transition-colors ${
                        isDisabled
                          ? "text-gray-300 dark:text-gray-600 cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                          : isSelected
                            ? "bg-blue-500 text-white"
                            : isToday
                              ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                              : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                      onClick={() => handleDateSelect(date)}
                    >
                      {date.getDate()}
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

        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <span>Día no laboral / Pasado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-100 dark:bg-blue-900 rounded"></div>
            <span>Hoy</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
