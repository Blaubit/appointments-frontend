"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { MonthViewCalendar } from "@/components/calendar/monthViewCalendar";
import { WeekViewCalendar } from "@/components/calendar/weekViewCalendar";
import { DayViewCalendar } from "@/components/calendar/dayViewCalendar";
import { OccupiedSlot, Service, User, PeriodResponse } from "@/types";
import { findPeriod } from "@/actions/calendar/findPeriod";
import { AppointmentDetailsDialog } from "@/components/appointment-details-dialog";
import ProfessionalSelectorCard from "@/components/professional-selector";
import { redirect } from "next/navigation";

interface CalendarPageClientProps {
  userId: string;
  services: Service[];
  professionals: User[];
  userSession?: User;
}

type ViewMode = "month" | "week" | "day";

// Helpers para formato de fecha
const formatDateForPeriod = (date: Date, mode: ViewMode): string => {
  if (mode === "month") {
    return date.toISOString().slice(0, 7);
  }
  return date.toISOString().slice(0, 10);
};

export default function CalendarPageClient({
  userId,
  services = [],
  professionals = [],
  userSession,
}: CalendarPageClientProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [schedule, setSchedule] = useState<PeriodResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | undefined
  >(undefined);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);

  // Estado para el profesional seleccionado
  const [selectedProfessional, setSelectedProfessional] = useState<User | null>(
    professionals.find((p) => p.id === userId) || null
  );

  // ID del profesional actual para usar en las consultas
  const currentProfessionalId = selectedProfessional?.id || userId;

  // Determinar si el selector debe estar bloqueado
  const isProfessionalLocked =
    selectedProfessional?.role?.name === "profesional" &&
    selectedProfessional.id === userId;

  // Fetch schedule cada vez que cambian fecha/mode/profesional
  useEffect(() => {
    if (!selectedProfessional) return;
    const fetchSchedule = async () => {
      setLoading(true);
      const dateStr = formatDateForPeriod(currentDate, viewMode);
      const result = await findPeriod(currentProfessionalId, dateStr, viewMode);
      console.log("Fetched schedule:", result.data);
      setSchedule(result?.data || null);
      setLoading(false);
    };
    fetchSchedule();
  }, [currentProfessionalId, currentDate, viewMode]);

  // Navigation helpers
  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    direction === "prev"
      ? newDate.setMonth(newDate.getMonth() - 1)
      : newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };
  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    direction === "prev"
      ? newDate.setDate(newDate.getDate() - 7)
      : newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };
  const navigateDay = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    direction === "prev"
      ? newDate.setDate(newDate.getDate() - 1)
      : newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };
  const goToToday = () => setCurrentDate(new Date());

  // Handler para el selector de fecha
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setCurrentDate(selectedDate);
      setIsDatePickerOpen(false);
    }
  };

  // Callbacks for calendar components
  const handleDayClick = (date: Date) => {
    setCurrentDate(date);
    setViewMode("week");
  };
  const handleHourClickWeek = (date: Date) => {
    setCurrentDate(date);
    setViewMode("day");
  };
  const handleHourClickDay = (time: string) => {
    redirect(
      `appointments/new?fechaHora=${currentDate.toISOString().split("T")[0]}T${time}&professionalId=${currentProfessionalId}`
    );
  };
  const handleSlotClick = (slot: OccupiedSlot & { date: string }) => {
    setSelectedAppointmentId(slot.appointmentId);
  };

  // UI strings
  const monthNames = [
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
  const dayNamesLong = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Professional Selector */}
      {professionals.length >= 1 && (
        <ProfessionalSelectorCard
          professionals={professionals}
          selectedProfessional={selectedProfessional}
          onSelectionChange={setSelectedProfessional}
          title="Filtrar por Profesional"
          description="Selecciona el profesional para ver su calendario"
          className="mb-6"
          isLocked={isProfessionalLocked}
        />
      )}
      {/* Calendar Controls */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            {/* Controls Section - Responsive */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Navigation Controls */}
              <div className="flex items-center space-x-2 justify-center sm:justify-start">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (viewMode === "month") navigateMonth("prev");
                    else if (viewMode === "week") navigateWeek("prev");
                    else if (viewMode === "day") navigateDay("prev");
                  }}
                >
                  &lt;
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (viewMode === "month") navigateMonth("next");
                    else if (viewMode === "week") navigateWeek("next");
                    else if (viewMode === "day") navigateDay("next");
                  }}
                >
                  &gt;
                </Button>
                <Button variant="outline" size="sm" onClick={goToToday}>
                  Hoy
                </Button>

                {/* Date Picker - Solo visible en vista de día */}
                {viewMode === "day" && (
                  <Popover
                    open={isDatePickerOpen}
                    onOpenChange={setIsDatePickerOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "justify-start text-left font-normal",
                          !currentDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">
                          {currentDate
                            ? format(currentDate, "dd/MM/yyyy", { locale: es })
                            : "Seleccionar fecha"}
                        </span>
                        <span className="sm:hidden">
                          {currentDate
                            ? format(currentDate, "dd/MM", { locale: es })
                            : "Fecha"}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={currentDate}
                        onSelect={handleDateSelect}
                        locale={es}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              </div>

              {/* Date Display - Responsive */}
              <div className="text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white break-words">
                  {viewMode === "month" &&
                    `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
                  {viewMode === "week" &&
                    `Semana del ${currentDate.getDate()} de ${monthNames[currentDate.getMonth()]}`}
                  {viewMode === "day" &&
                    `${dayNamesLong[(currentDate.getDay() + 6) % 7]}, ${currentDate.getDate()} de ${monthNames[currentDate.getMonth()]}`}
                </h2>
                {/* Mostrar nombre del profesional actual */}
                {selectedProfessional && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 break-words">
                    Calendario de {selectedProfessional.fullName}
                  </p>
                )}
              </div>
            </div>

            {/* View Mode Buttons */}
            <div className="flex items-center space-x-2 justify-center lg:justify-end">
              <Button
                variant={viewMode === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("month")}
              >
                Mes
              </Button>
              <Button
                variant={viewMode === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("week")}
              >
                Semana
              </Button>
              <Button
                variant={viewMode === "day" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("day")}
              >
                Día
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar Views */}
      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              Cargando calendario...
            </div>
          ) : schedule ? (
            <>
              {viewMode === "month" && (
                <MonthViewCalendar
                  schedule={schedule}
                  currentDate={currentDate}
                  onDayClick={handleDayClick}
                  onSlotClick={handleSlotClick}
                />
              )}
              {viewMode === "week" && (
                <WeekViewCalendar
                  schedule={schedule}
                  weekDate={currentDate}
                  onSlotClick={handleSlotClick}
                  onDayColumnClick={handleHourClickWeek}
                />
              )}
              {viewMode === "day" && (
                <DayViewCalendar
                  schedule={schedule}
                  date={currentDate}
                  onHourClick={handleHourClickDay}
                  onSlotClick={handleSlotClick}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No hay datos de calendario para este profesional
            </div>
          )}
        </CardContent>
      </Card>
      {/* Appointment Details Dialog */}
      <AppointmentDetailsDialog
        appointmentId={selectedAppointmentId}
        isOpen={!!selectedAppointmentId}
        onClose={() => setSelectedAppointmentId(undefined)}
        onCancel={() => {}}
        onDelete={() => {}}
        onCall={() => {}}
        onEmail={() => {}}
      />
    </div>
  );
}
