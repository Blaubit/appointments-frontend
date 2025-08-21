import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarCardProps {
  onDateSelect?: (dateStr: string) => void;
  initialDate?: Date;
}

export const CalendarCard: React.FC<CalendarCardProps> = ({
  onDateSelect,
  initialDate,
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
      : new Date()
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

  // Genera la grilla de días del calendario (lunes como primer día)
  const getCalendarDays = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Lunes = 0
    const startDay = (firstDayOfMonth.getDay() + 6) % 7;
    const totalDays = lastDayOfMonth.getDate();
    const days: Date[] = [];

    // Días del mes anterior para rellenar la primera semana
    for (let i = startDay - 1; i >= 0; i--) {
      days.push(new Date(year, month, -i));
    }

    // Días del mes actual
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }

    // Rellenar hasta completar la grilla (6 semanas x 7 días = 42)
    while (days.length < 42) {
      const nextDate = new Date(
        year,
        month,
        totalDays + (days.length - startDay + 1),
      );
      days.push(nextDate);
    }

    return days;
  };

  const calendarDays = getCalendarDays(currentMonth);

  const changeMonth = (offset: number) => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1),
    );
  };

  const handleDateSelect = (date: Date) => {
    if (isNaN(date.getTime())) return;
    const dateStr = date.toISOString().split("T")[0];
    setSelectedDate(dateStr);
    if (onDateSelect) onDateSelect(dateStr);
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
          {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500 py-1"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((date, index) => {
            // Evita fechas inválidas
            if (isNaN(date.getTime())) return <div key={index}></div>;

            const dateStr = date.toISOString().split("T")[0];
            const isSelected = selectedDate === dateStr;
            const isToday = date.toDateString() === new Date().toDateString();
            const isCurrentMonth = date.getMonth() === currentMonth.getMonth();

            return (
              <button
                key={index}
                type="button"
                className={`p-2 text-sm rounded-lg transition-colors ${
                  isSelected
                    ? "bg-blue-500 text-white"
                    : isToday
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                } ${!isCurrentMonth ? "text-gray-400" : ""}`}
                onClick={() => handleDateSelect(date)}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};