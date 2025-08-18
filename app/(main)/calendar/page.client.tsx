"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MonthViewCalendar } from "@/components/calendar/monthViewCalendar";
import { WeekViewCalendar } from "@/components/calendar/weekViewCalendar";
import { DayViewCalendar } from "@/components/calendar/dayViewCalendar";
import { ScheduleResponse, OccupiedSlot, Service } from "@/types";
import { findPeriod } from "@/actions/calendar/findPeriod";

interface CalendarPageClientProps {
  userId: string;
  services: Service[];
}

type ViewMode = "month" | "week" | "day";

// Helpers para formato de fecha
const formatDateForPeriod = (date: Date, mode: ViewMode): string => {
  if (mode === "month") {
    // yyyy-mm
    return date.toISOString().slice(0, 7);
  }
  // yyyy-mm-dd
  return date.toISOString().slice(0, 10);
};

export default function CalendarPageClient({
  userId,
  services = [],
}: CalendarPageClientProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [schedule, setSchedule] = useState<ScheduleResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch schedule cada vez que cambian fecha/mode/userId
  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      const dateStr = formatDateForPeriod(currentDate, viewMode);
      const result = await findPeriod(userId, dateStr, viewMode);
      console.log(`result:${dateStr}`, result.data);
      setSchedule(result?.data || null);
      setLoading(false);
    };
    fetchSchedule();
  }, [userId, currentDate, viewMode]);

  // Navigation helpers igual que antes
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
    console.log("Clicked hour:", time, "on", currentDate);
  };
  const handleSlotClick = (slot: OccupiedSlot & { date: string }) => {
    console.log("Clicked slot:", slot);
  };

  // UI strings
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const dayNamesLong = [
    "Domingo", "Lunes", "Martes", "Miércoles",
    "Jueves", "Viernes", "Sábado"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Calendar Controls */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
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
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {viewMode === "month" &&
                    `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
                  {viewMode === "week" &&
                    `Semana del ${currentDate.getDate()} de ${monthNames[currentDate.getMonth()]}`}
                  {viewMode === "day" &&
                    `${dayNamesLong[currentDate.getDay()]}, ${currentDate.getDate()} de ${monthNames[currentDate.getMonth()]}`}
                </h2>
              </div>
            </div>
            <div className="flex items-center space-x-2">
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

      {/* Calendar Views - uses your new components */}
      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Cargando calendario...</div>
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
            <div className="text-center py-12 text-gray-500">No hay datos de calendario</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}