"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarCard } from "@/components/calendar-card";
import { Clock, AlertCircle, CheckCircle } from "lucide-react";
import { findPeriod } from "@/actions/calendar/findPeriod";
import type { Service, User } from "@/types";

type Props = {
  selectedProfessional: User | null;
  selectedDate: string;
  initialTime?: string;
  onChange: (date: string, time: string) => void;
  selectedServices: string[];
  professionalServices: Service[];
  appointmentId?: string; // opcional: id de la cita que estamos editando
};

interface TimeSlotStatus {
  time: string;
  isAvailable: boolean;
  reason?: string;
}

interface CustomTimeValidation {
  isValid: boolean;
  reason?: string;
}

export function DateTimeSelectorCard({
  selectedProfessional,
  selectedDate,
  initialTime = "",
  onChange,
  selectedServices,
  professionalServices,
  appointmentId,
}: Props) {
  const [timeSlots, setTimeSlots] = useState<TimeSlotStatus[]>([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [customTime, setCustomTime] = useState("");
  const [customTimeError, setCustomTimeError] = useState<string | null>(null);
  const [customTimeValid, setCustomTimeValid] = useState(false);
  const [isLoadingHours, setIsLoadingHours] = useState(false);
  const [hoursError, setHoursError] = useState<string | null>(null);
  const [scheduleData, setScheduleData] = useState<any>(null);
  const [workingDays, setWorkingDays] = useState<Set<string>>(new Set());

  // Calcular duración total de los servicios seleccionados
  const getTotalDuration = (): number => {
    return selectedServices.reduce((sum, serviceId) => {
      const service = professionalServices.find(
        (s) => s.id.toString() === serviceId
      );
      return sum + (service?.durationMinutes || 0);
    }, 0);
  };

  // Formatear duración de forma legible
  const formatDuration = (totalMinutes: number): string => {
    if (totalMinutes === 0) return "0 min";

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) {
      return `${minutes}min`;
    } else if (minutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${minutes}min`;
    }
  };

  // Convertir tiempo a minutos desde medianoche
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // Verificar si un horario de inicio es válido (ocupados ya deben venir filtrados si se edita)
  const isTimeSlotValid = (
    startTime: string,
    totalDuration: number,
    occupiedSlots: any[],
    workingHours: any
  ): { isValid: boolean; reason?: string } => {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = startMinutes + totalDuration;

    // Verificar límite de horario laboral
    const workStart = timeToMinutes(workingHours.start.slice(0, 5));
    const workEnd = timeToMinutes(workingHours.end.slice(0, 5));

    if (endMinutes > workEnd) {
      return {
        isValid: false,
        reason: "La cita se extiende fuera del horario laboral",
      };
    }

    // Verificar solapamiento con citas ocupadas
    for (const slot of occupiedSlots) {
      const slotStart = timeToMinutes(slot.startTime.slice(0, 5));
      const slotEnd = timeToMinutes(slot.endTime.slice(0, 5));

      // Verificar si hay solapamiento (intersección de intervalos)
      if (startMinutes < slotEnd && endMinutes > slotStart) {
        return {
          isValid: false,
          reason: `Conflicto con cita de ${slot.clientName || "otro paciente"} (${slot.serviceName || "servicio"})`,
        };
      }
    }

    return { isValid: true };
  };

  // Validar tiempo personalizado
  const validateCustomTime = (
    time: string,
    schedule: any = null
  ): CustomTimeValidation => {
    if (!time) {
      return { isValid: false };
    }

    // Validar formato HH:MM
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
      return {
        isValid: false,
        reason: "Formato inválido (usa HH:MM)",
      };
    }

    const dataToUse = schedule || scheduleData;
    if (!dataToUse) {
      return {
        isValid: false,
        reason: "Datos de horario no disponibles",
      };
    }

    const totalDuration = getTotalDuration();
    if (totalDuration === 0) {
      return {
        isValid: false,
        reason: "Selecciona servicios primero",
      };
    }

    // Usar la validación con occupiedSlots ya filtrados (scheduleData contiene la versión filtrada)
    const validation = isTimeSlotValid(
      time,
      totalDuration,
      dataToUse.occupiedSlots,
      dataToUse.workingHours
    );

    return validation;
  };

  // Manejar cambio en input de tiempo personalizado
  const handleCustomTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    setCustomTime(time);

    if (!time) {
      setCustomTimeError(null);
      setCustomTimeValid(false);
      return;
    }

    const validation = validateCustomTime(time);
    setCustomTimeValid(validation.isValid);
    setCustomTimeError(validation.reason || null);

    // Auto-seleccionar si es válido
    if (validation.isValid) {
      setSelectedTime(time);
    } else {
      setSelectedTime("");
    }
  };

  // Utility: normalizar "HH:MM:SS" -> "HH:MM"
  const normalizeToHHMM = (t?: string) => {
    if (!t) return "";
    const parts = t.split(":");
    if (parts.length >= 2)
      return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
    return t;
  };

  // -----------------------
  // Optimistic pre-render:
  // Si tenemos initialTime + profesional + fecha, añadir inmediatamente un slot
  // optimista para que sea renderizado antes de que termine el fetch de findPeriod.
  // -----------------------
  useEffect(() => {
    if (!selectedProfessional || !selectedDate || !initialTime) return;

    const normalizedInitial = normalizeToHHMM(initialTime);
    if (!normalizedInitial) return;

    // Si ya existe en timeSlots, no hacemos nada
    setTimeSlots((prev) => {
      if (prev.some((s) => s.time === normalizedInitial)) return prev;
      // insertarlo al inicio (no ordenado aún); el fetch posterior reordenará
      const optimistic: TimeSlotStatus = {
        time: normalizedInitial,
        isAvailable: true,
      };
      // Si no hay selección de hora, preseleccionamos optimísticamente
      if (!selectedTime) {
        setSelectedTime(normalizedInitial);
        setCustomTime(normalizedInitial);
        setCustomTimeValid(true);
        setCustomTimeError(null);
      }
      return [optimistic, ...prev];
    });
    // Nota: el fetch que viene después reemplazará timeSlots con la lista definitiva.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProfessional?.id, selectedDate, initialTime]);

  // Cargar y filtrar horarios disponibles
  useEffect(() => {
    if (!selectedProfessional || !selectedDate) {
      setTimeSlots([]);
      setScheduleData(null);
      setHoursError(null);
      setSelectedTime("");
      setCustomTime("");
      return;
    }

    setIsLoadingHours(true);
    setHoursError(null);

    findPeriod(selectedProfessional.id.toString(), selectedDate, "day")
      .then((result: any) => {
        if ("data" in result && result.data) {
          const daySchedule = result.data.schedule.find(
            (day: any) => day.date === selectedDate
          );

          if (daySchedule && daySchedule.availableHours) {
            // FILTRAR occupiedSlots: eliminar la propia cita (si appointmentId fue pasado)
            const rawOccupied = Array.isArray(daySchedule.occupiedSlots)
              ? daySchedule.occupiedSlots
              : [];
            const filteredOccupied = appointmentId
              ? rawOccupied.filter(
                  (s: any) => String(s.appointmentId) !== String(appointmentId)
                )
              : rawOccupied.slice(); // clon

            // Creamos una copia del daySchedule que usaremos para validaciones (ocupado filtrado)
            const dayScheduleForValidation = {
              ...daySchedule,
              occupiedSlots: filteredOccupied,
            };

            // Normalizamos initialTime a HH:MM para posibles inserciones
            const normalizedInitial = initialTime
              ? normalizeToHHMM(initialTime)
              : "";

            // Construimos availableHours para render: añadimos normalizedInitial si no existe
            const baseAvailable = Array.isArray(daySchedule.availableHours)
              ? daySchedule.availableHours.map((h: string) =>
                  normalizeToHHMM(h)
                )
              : [];

            let availableHoursForRender = baseAvailable.slice();
            if (
              normalizedInitial &&
              !availableHoursForRender.includes(normalizedInitial)
            ) {
              availableHoursForRender.push(normalizedInitial);
            }

            // Deduplicate and sort ascending
            availableHoursForRender = Array.from(
              new Set(availableHoursForRender)
            ).sort((a: any, b: any) => timeToMinutes(a) - timeToMinutes(b));

            // Guardar datos de horario para validar tiempo personalizado (ya filtrados)
            setScheduleData(dayScheduleForValidation);
            // Registrar que este día es laboral (tiene horarios disponibles)
            setWorkingDays((prev) => new Set([...prev, selectedDate]));

            const totalDuration = getTotalDuration();

            // Si no hay servicios seleccionados, mostrar todos los horarios disponibles tal cual vienen (pero usando availableHoursForRender)
            if (totalDuration === 0) {
              const slots: TimeSlotStatus[] = availableHoursForRender.map(
                (hour: string) => ({
                  time: hour,
                  isAvailable: true,
                })
              );

              setTimeSlots(slots);
              setHoursError(null);
              return;
            }

            // Filtrar horarios válidos considerando la duración total, usando occupiedSlots filtrados
            const validSlots: TimeSlotStatus[] = availableHoursForRender.map(
              (hour: string) => {
                const validation = isTimeSlotValid(
                  hour,
                  totalDuration,
                  dayScheduleForValidation.occupiedSlots,
                  dayScheduleForValidation.workingHours
                );

                return {
                  time: hour,
                  isAvailable: validation.isValid,
                  reason: validation.reason,
                };
              }
            );

            // Ordenar por hora ascendente (aunque availableHoursForRender ya lo está)
            validSlots.sort(
              (a, b) => timeToMinutes(a.time) - timeToMinutes(b.time)
            );

            // Reemplazamos los slots (esto sobrescribe el optimistic slot si es necesario)
            setTimeSlots(validSlots);

            // Verificar si hay al menos un horario válido
            const hasValidSlots = validSlots.some((slot) => slot.isAvailable);
            if (!hasValidSlots) {
              setHoursError(
                `No hay horarios disponibles para una cita de ${formatDuration(totalDuration)}`
              );
            }
          } else {
            setTimeSlots([]);
            setScheduleData(null);
            setHoursError("No hay horarios disponibles para este día");
          }
        } else {
          setTimeSlots([]);
          setScheduleData(null);
          setHoursError("Error al cargar los horarios disponibles");
        }
      })
      .catch(() => {
        setTimeSlots([]);
        setScheduleData(null);
        setHoursError("Error al cargar los horarios disponibles");
      })
      .finally(() => {
        setIsLoadingHours(false);
      });
  }, [
    selectedProfessional,
    selectedDate,
    selectedServices,
    professionalServices,
    appointmentId,
    initialTime,
  ]);

  // Preselección automática de hora
  useEffect(() => {
    const normalizedInitial = initialTime ? normalizeToHHMM(initialTime) : "";
    if (
      normalizedInitial &&
      timeSlots.find(
        (slot) => slot.time === normalizedInitial && slot.isAvailable
      ) &&
      !selectedTime
    ) {
      setSelectedTime(normalizedInitial);
      setCustomTime(normalizedInitial);
      setCustomTimeValid(true);
      setCustomTimeError(null);
    } else if (normalizedInitial && !selectedTime && scheduleData) {
      // En caso el slot no esté en los timeSlots, intentamos validar manualmente usando scheduleData (filtrada)
      const totalDuration = getTotalDuration();
      const manualValidation = isTimeSlotValid(
        normalizedInitial,
        totalDuration,
        scheduleData.occupiedSlots,
        scheduleData.workingHours
      );
      if (manualValidation.isValid) {
        setSelectedTime(normalizedInitial);
        setCustomTime(normalizedInitial);
        setCustomTimeValid(true);
        setCustomTimeError(null);
      }
    }
  }, [timeSlots, initialTime, selectedTime, scheduleData]);

  // Notificar cambios al padre
  useEffect(() => {
    if (selectedDate && selectedTime) {
      onChange(selectedDate, selectedTime);
    } else {
      onChange(selectedDate || "", "");
    }
  }, [selectedDate, selectedTime, onChange]);

  // Cuando el usuario selecciona una fecha, limpiamos hora
  const handleDateSelect = (fecha: string) => {
    setSelectedTime("");
    setCustomTime("");
    setCustomTimeError(null);
    setCustomTimeValid(false);
    onChange(fecha, "");
  };

  // Cuando el usuario selecciona una hora del botón
  const handleTimeSelect = (time: string) => {
    const slot = timeSlots.find((s) => s.time === time);
    if (slot && slot.isAvailable) {
      setSelectedTime(time);
      setCustomTime(time);
      setCustomTimeValid(true);
      setCustomTimeError(null);
    }
  };

  const totalDuration = getTotalDuration();
  const durationText = formatDuration(totalDuration);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CalendarCard
          initialDate={
            selectedDate ? new Date(selectedDate + "T00:00:00") : new Date()
          }
          onDateSelect={handleDateSelect}
          workingDays={workingDays}
          selectedProfessional={selectedProfessional}
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
                : totalDuration === 0
                  ? "Selecciona servicios para ver horarios compatibles"
                  : `Selecciona una hora para la cita (duración: ${durationText})`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!selectedProfessional || !selectedDate ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>
                {!selectedProfessional
                  ? "Selecciona un profesional para ver horarios disponibles"
                  : "Selecciona una fecha para ver horarios disponibles"}
              </p>
            </div>
          ) : totalDuration === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>
                Selecciona al menos un servicio para ver horarios disponibles
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
          ) : timeSlots.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 mx-auto mb-2 text-gray-400 opacity-50" />
              <p className="text-gray-500">
                No hay horarios disponibles para esta fecha
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Selector personalizado */}
              <div className="space-y-2">
                <Label htmlFor="customTime" className="font-semibold">
                  Hora Personalizada
                </Label>
                <div className="relative">
                  <Input
                    id="customTime"
                    type="time"
                    value={customTime}
                    onChange={handleCustomTimeChange}
                    className={`${
                      customTime
                        ? customTimeValid
                          ? "border-green-500 focus:ring-green-500"
                          : "border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                  />
                  {customTime && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {customTimeValid ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {customTime && customTimeError && (
                  <p className="text-xs text-red-500">{customTimeError}</p>
                )}
                {customTime && customTimeValid && (
                  <p className="text-xs text-green-500">✓ Hora disponible</p>
                )}
              </div>

              {/* Separador */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">
                    O selecciona una opción rápida
                  </span>
                </div>
              </div>

              {/* Horarios predefinidos */}
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => {
                  const isSelected = selectedTime === slot.time;
                  return (
                    <div key={slot.time} className="relative group">
                      <button
                        type="button"
                        className={`w-full p-3 text-sm rounded-lg border transition-colors ${
                          slot.isAvailable
                            ? isSelected
                              ? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300 cursor-pointer"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 cursor-pointer"
                            : "border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-700 dark:bg-gray-800 cursor-not-allowed opacity-50"
                        }`}
                        onClick={() => handleTimeSelect(slot.time)}
                        disabled={!slot.isAvailable}
                      >
                        {slot.time}
                      </button>
                      {!slot.isAvailable && slot.reason && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-red-500 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                          {slot.reason}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Resumen de horarios válidos */}
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                <strong>Duración de la cita:</strong> {durationText}
                <br />
                <span className="text-xs">
                  Mostrando solo horarios que permiten agendar la cita completa.
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
