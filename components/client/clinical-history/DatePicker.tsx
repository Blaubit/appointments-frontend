"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerNewProps {
  date?: Date;
  onDateChange: (date: Date | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
  yearRange?: { start: number; end: number };
}

const MONTHS_ES = [
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

const DAYS_IN_MONTH = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const formatDateDisplay = (date: Date): string => {
  const day = date.getDate();
  const month = MONTHS_ES[date.getMonth()];
  const year = date.getFullYear();
  return `${day} de ${month} de ${year}`;
};

export function DatePicker({
  date,
  onDateChange,
  disabled = false,
  placeholder = "Seleccione una fecha",
  yearRange = { start: 1900, end: 2100 },
}: DatePickerNewProps) {
  // Estado local para el mes/año visible en el calendario
  const [displayMonth, setDisplayMonth] = React.useState<number>(
    date?.getMonth() ?? new Date().getMonth()
  );
  const [displayYear, setDisplayYear] = React.useState<number>(
    date?.getFullYear() ?? new Date().getFullYear()
  );
  const [open, setOpen] = React.useState(false);

  const years = Array.from(
    { length: yearRange.end - yearRange.start + 1 },
    (_, i) => yearRange.start + i
  );

  const daysInCurrentMonth = DAYS_IN_MONTH(displayYear, displayMonth);
  const firstDayOfMonth = new Date(displayYear, displayMonth, 1).getDay();
  const days = Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const handleSelectYear = (year: string) => {
    setDisplayYear(parseInt(year));
  };

  const handleSelectMonth = (month: string) => {
    setDisplayMonth(parseInt(month));
  };

  const handleSelectDay = (day: number) => {
    // Crear fecha en zona horaria local (sin UTC) y agregar 1 día
    const selectedDate = new Date(displayYear, displayMonth, day);
    selectedDate.setDate(selectedDate.getDate() + 1);
    onDateChange(selectedDate);
    setOpen(false);
  };

  const handlePreviousMonth = () => {
    if (displayMonth === 0) {
      setDisplayMonth(11);
      setDisplayYear(displayYear - 1);
    } else {
      setDisplayMonth(displayMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (displayMonth === 11) {
      setDisplayMonth(0);
      setDisplayYear(displayYear + 1);
    } else {
      setDisplayMonth(displayMonth + 1);
    }
  };

  const isDateSelected = (day: number) => {
    if (!date) return false;
    return (
      date.getDate() === day &&
      date.getMonth() === displayMonth &&
      date.getFullYear() === displayYear
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          {date ? formatDateDisplay(date) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="space-y-4">
          {/* Selectores de Año y Mes */}
          <div className="flex gap-2">
            <Select
              value={displayYear.toString()}
              onValueChange={handleSelectYear}
              disabled={disabled}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={displayMonth.toString()}
              onValueChange={handleSelectMonth}
              disabled={disabled}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS_ES.map((month, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Navegación de Mes */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={handlePreviousMonth}
              disabled={disabled}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {MONTHS_ES[displayMonth]} {displayYear}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={handleNextMonth}
              disabled={disabled}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Calendario */}
          <div className="space-y-2">
            {/* Encabezado de días de la semana */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold text-gray-500 h-8 flex items-center justify-center"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Días del mes */}
            <div className="grid grid-cols-7 gap-2">
              {/* Espacios vacíos al inicio del mes */}
              {emptyDays.map((_, index) => (
                <div key={`empty-${index}`} className="h-8" />
              ))}

              {/* Días del mes */}
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => handleSelectDay(day)}
                  disabled={disabled}
                  className={cn(
                    "h-8 w-8 rounded text-sm font-medium transition-colors",
                    isDateSelected(day)
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800",
                    disabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Botón para limpiar */}
          {date && (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                onDateChange(undefined);
                setOpen(false);
              }}
              disabled={disabled}
            >
              Limpiar fecha
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
