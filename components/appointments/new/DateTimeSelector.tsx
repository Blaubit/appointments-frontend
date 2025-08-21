import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { CalendarCard } from "@/components/calendar-card";

type Props = {
  calendarDays: Date[]; // Opcional si CalendarCard lo genera internamente
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  availableTimes: string[];
  selectedTime: string;
  setSelectedTime: (time: string) => void;
};

export const DateTimeSelector: React.FC<Props> = ({
  // calendarDays,
  selectedDate,
  setSelectedDate,
  availableTimes,
  selectedTime,
  setSelectedTime,
}) => {
  // Si CalendarCard requiere calendarDays, pásalo como prop

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Date Selection */}
      <Card>
        <CalendarCard onDateSelect={handleDateChange} />
      </Card>

      {/* Time Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Horario</CardTitle>
          <CardDescription>Selecciona la hora para la cita</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {availableTimes.map((time) => {
              const isSelected = selectedTime === time;
              return (
                <button
                  key={time}
                  type="button"
                  className={`p-3 text-sm rounded-lg border transition-colors ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
