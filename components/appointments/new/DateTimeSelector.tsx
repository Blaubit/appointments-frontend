import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CalendarCard } from "@/components/calendar-card";
import { Clock, AlertCircle } from "lucide-react";
import { findPeriod } from "@/actions/calendar/findPeriod";

// Props solo para saber el profesional y notificar selección
type Props = {
  selectedProfessional: any;
  initialDate?: string;
  onChange: (date: string, time: string) => void;
};

export function DateTimeSelectorCard({
  selectedProfessional,
  initialDate = "",
  onChange,
}: Props) {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [availableHours, setAvailableHours] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [isLoadingHours, setIsLoadingHours] = useState(false);
  const [hoursError, setHoursError] = useState<string | null>(null);

  // Cuando cambia fecha/profesional, cargar horarios
  useEffect(() => {
    if (!selectedProfessional || !selectedDate) {
      setAvailableHours([]);
      setHoursError(null);
      setSelectedTime("");
      return;
    }
    setIsLoadingHours(true);
    setHoursError(null);
    findPeriod(selectedProfessional.id.toString(), selectedDate, "day")
      .then((result: any) => {
        if ("data" in result && result.data) {
          const daySchedule = result.data.schedule.find(
            (day: any) => day.date === selectedDate,
          );
          if (daySchedule && daySchedule.availableHours) {
            setAvailableHours(daySchedule.availableHours);
          } else {
            setAvailableHours([]);
            setHoursError("No hay horarios disponibles para este día");
          }
        } else {
          setAvailableHours([]);
          setHoursError("Error al cargar los horarios disponibles");
        }
      })
      .catch(() => {
        setAvailableHours([]);
        setHoursError("Error al cargar los horarios disponibles");
      })
      .finally(() => {
        setIsLoadingHours(false);
      });
  }, [selectedProfessional, selectedDate]);

  // Notificar al padre cuando ambos estén listos
  useEffect(() => {
    if (selectedDate && selectedTime) {
      onChange(selectedDate, selectedTime);
    } else {
      onChange("", "");
    }
  }, [selectedDate, selectedTime, onChange]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CalendarCard
          initialDate={selectedDate ? new Date(selectedDate) : new Date()}
          onDateSelect={(fecha: string) => {
            setSelectedDate(fecha);
            setSelectedTime(""); // Limpiar hora si cambia fecha
          }}
        />
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Horario</CardTitle>
          <CardDescription>
            {!selectedProfessional
              ? "Primero selecciona un profesional"
              : !selectedDate
                ? "Selecciona una fecha para ver los horarios disponibles"
                : "Selecciona la hora para la cita"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!selectedProfessional || !selectedDate ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>
                {!selectedProfessional
                  ? "Selecciona un profesional para ver horarios disponibles"
                  : "Selecciona una fecha para ver horarios disponibles"}
              </p>
            </div>
          ) : isLoadingHours ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-gray-500">Cargando horarios...</p>
            </div>
          ) : hoursError ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 mx-auto mb-2 text-red-500 opacity-50" />
              <p className="text-red-500">{hoursError}</p>
            </div>
          ) : availableHours.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 mx-auto mb-2 text-gray-400 opacity-50" />
              <p className="text-gray-500">
                No hay horarios disponibles para esta fecha
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {availableHours.map((time) => {
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}