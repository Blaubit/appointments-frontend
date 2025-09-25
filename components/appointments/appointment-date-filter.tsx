"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";

interface AppointmentDateFilterProps {
  className?: string;
}

export function AppointmentDateFilter({
  className = "",
}: AppointmentDateFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  // Obtener la fecha actual del parámetro URL
  const currentDateParam = searchParams.get("appointmentDate");
  // Crear la fecha en la zona horaria local para evitar desfases
  const currentDate = currentDateParam
    ? new Date(currentDateParam + "T00:00:00")
    : null;

  const handleDateSelect = (date: Date | undefined) => {
    const params = new URLSearchParams(searchParams);

    if (!date) {
      params.delete("appointmentDate");
    } else {
      // Usar los valores locales de la fecha para evitar problemas de timezone
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      params.set("appointmentDate", formattedDate);
    }

    // Reset page when changing date
    params.delete("page");

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl);
    setIsOpen(false);
  };

  const clearDate = () => {
    handleDateSelect(undefined);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`w-[240px] justify-start text-left font-normal ${
              !currentDate ? "text-muted-foreground" : ""
            }`}
          >
            <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="truncate">
              {currentDate
                ? format(currentDate, "PPP", { locale: es })
                : "Seleccionar fecha"}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={currentDate || undefined}
            onSelect={handleDateSelect}
            initialFocus
            locale={es}
          />
        </PopoverContent>
      </Popover>

      {currentDate && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearDate}
          className="h-8 w-8 p-0 flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
