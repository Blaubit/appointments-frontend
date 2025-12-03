"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  createRestriction,
  RestrictionPreviewFormData,
} from "@/actions/user/restriction/previewRestriction";
import { findPeriod } from "@/actions/calendar/findPeriod";
import { User, PeriodResponse } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  User as UserIcon,
  AlertTriangle,
  Eye,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { AppointmentDetailsDialog } from "@/components/appointment-details-dialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type RestrictionPreviewModalProps = {
  professionals: User[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type AffectedAppointment = {
  id: string;
  clientName: string;
  date: string;
  startTime: string;
  endTime: string;
};

type PreviewResponse = {
  affectedCount: number;
  appointments: AffectedAppointment[];
};

export default function RestrictionPreviewModal({
  professionals,
  open,
  onOpenChange,
}: RestrictionPreviewModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<RestrictionPreviewFormData>({
    professionalId: "",
    restrictionDate: [],
    startTime: "",
    endTime: "",
  });

  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );

  const [nonWorkingDays, setNonWorkingDays] = useState<Set<string>>(new Set());
  const [isLoadingMonth, setIsLoadingMonth] = useState<boolean>(false);
  const [cachedMonths, setCachedMonths] = useState<Map<string, Set<string>>>(
    new Map()
  );

  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<PreviewResponse | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Estado para el dialog de detalles
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  // Convertir Date a string YYYY-MM-DD
  const dateToString = useCallback((date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  // Genera "slots" del mes actual
  const getCalendarSlots = useCallback((date: Date): (Date | null)[] => {
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
  }, []);

  // Cargar datos del mes completo cuando cambian profesional o mes
  useEffect(() => {
    if (!formData.professionalId) {
      setNonWorkingDays(new Set());
      return;
    }

    const loadMonthData = async () => {
      const monthStr = currentMonth.toISOString().slice(0, 7);
      const monthKey = `${formData.professionalId}:${monthStr}`;

      // Verificar caché sin incluirlo en dependencias
      if (cachedMonths.has(monthKey)) {
        const cached = cachedMonths.get(monthKey)!;
        setNonWorkingDays(cached);
        return;
      }

      setIsLoadingMonth(true);
      try {
        const result = await findPeriod(
          formData.professionalId,
          monthStr,
          "month"
        );

        if (result && "data" in result && result.data) {
          const monthSchedule = result.data as PeriodResponse;
          const nonWorking = new Set<string>();

          if (monthSchedule.schedule && Array.isArray(monthSchedule.schedule)) {
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

          // Actualizar caché
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
    // Eliminamos cachedMonths de las dependencias para evitar el loop
  }, [formData.professionalId, currentMonth]);

  // Manejar selección/deselección de fechas
  const handleDateToggle = useCallback(
    (date: Date) => {
      if (isNaN(date.getTime())) return;

      const dateStr = dateToString(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const isPast = date.getTime() < today.getTime();

      setSelectedDates((prevDates) => {
        const isNonWorking = nonWorkingDays.has(dateStr);

        if (isPast || isNonWorking) return prevDates;

        const isAlreadySelected = prevDates.some(
          (d) => dateToString(d) === dateStr
        );

        let newDates: Date[];
        if (isAlreadySelected) {
          newDates = prevDates.filter((d) => dateToString(d) !== dateStr);
        } else {
          newDates = [...prevDates, date];
        }

        // Ordenar fechas
        const sortedDates = newDates.sort((a, b) => a.getTime() - b.getTime());

        // Actualizar formData
        setFormData((prev) => ({
          ...prev,
          restrictionDate: sortedDates.map(dateToString),
        }));

        return sortedDates;
      });
    },
    [dateToString, nonWorkingDays]
  );

  const handleRemoveDate = useCallback(
    (dateToRemove: Date) => {
      setSelectedDates((prevDates) => {
        const newDates = prevDates.filter(
          (date) => date.getTime() !== dateToRemove.getTime()
        );

        setFormData((prev) => ({
          ...prev,
          restrictionDate: newDates.map(dateToString),
        }));

        return newDates;
      });
    },
    [dateToString]
  );

  const handleClearAllDates = useCallback(() => {
    setSelectedDates([]);
    setFormData((prev) => ({ ...prev, restrictionDate: [] }));
  }, []);

  const changeMonth = useCallback((offset: number) => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + offset);
      return new Date(newDate.getFullYear(), newDate.getMonth(), 1);
    });
  }, []);

  const handlePreview = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingPreview(true);
    setError(null);
    setPreviewData(null);
    setSuccessMessage(null);

    try {
      const result = await createRestriction({
        professionalId: formData.professionalId,
        restrictionDate: formData.restrictionDate,
        startTime: formData.startTime || undefined,
        endTime: formData.endTime || undefined,
        mode: "preview",
      });

      if ("data" in result) {
        setPreviewData(result.data as PreviewResponse);
      } else {
        setError(result.message || "An error occurred");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleCreate = async () => {
    setLoadingCreate(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await createRestriction({
        professionalId: formData.professionalId,
        restrictionDate: formData.restrictionDate,
        startTime: formData.startTime || undefined,
        endTime: formData.endTime || undefined,
        mode: "create",
      });

      if ("data" in result) {
        const data = result.data as PreviewResponse;
        setSuccessMessage(
          `✅ Restricción creada exitosamente. ${data.affectedCount} cita${data.affectedCount !== 1 ? "s" : ""} afectada${data.affectedCount !== 1 ? "s" : ""}. `
        );
        setPreviewData(data);

        setTimeout(() => {
          handleClose();
          router.refresh();
        }, 2000);
      } else {
        setError(result.message || "An error occurred");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleReset = useCallback(() => {
    setFormData({
      professionalId: "",
      restrictionDate: [],
      startTime: "",
      endTime: "",
    });
    setSelectedDates([]);
    setError(null);
    setPreviewData(null);
    setSuccessMessage(null);
    setNonWorkingDays(new Set());
    setCachedMonths(new Map());
  }, []);

  const handleClose = useCallback(() => {
    handleReset();
    onOpenChange(false);
  }, [handleReset, onOpenChange]);

  const handleAppointmentClick = useCallback((appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setIsDetailsDialogOpen(true);
  }, []);

  const formatTime = useCallback((time: string) => {
    return time.substring(0, 5);
  }, []);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, []);

  const formatShortDate = useCallback((date: Date) => {
    return format(date, "dd/MM/yyyy", { locale: es });
  }, []);

  const calendarSlots = useMemo(
    () => getCalendarSlots(currentMonth),
    [currentMonth, getCalendarSlots]
  );

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const todayStr = useMemo(() => dateToString(today), [today, dateToString]);

  const isFormValid = formData.professionalId && selectedDates.length > 0;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <CalendarIcon className="h-6 w-6 text-blue-500" />
              Crear Restricción de Disponibilidad
            </DialogTitle>
            <DialogDescription>
              Selecciona un profesional y las fechas para crear una restricción.
              Puedes previsualizarla antes de confirmar.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePreview} className="space-y-6 mt-4">
            {/* Professional Selection */}
            <div className="space-y-2">
              <Label htmlFor="professional">
                Profesional <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.professionalId}
                onValueChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    professionalId: value,
                    restrictionDate: [],
                  }));
                  setSelectedDates([]);
                  setNonWorkingDays(new Set());
                }}
                disabled={loadingPreview || loadingCreate}
              >
                <SelectTrigger id="professional">
                  <SelectValue placeholder="Selecciona un profesional" />
                </SelectTrigger>
                <SelectContent>
                  {professionals?.map((prof) => (
                    <SelectItem key={prof.id} value={prof.id}>
                      {prof.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Calendar Selection */}
            {formData.professionalId && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>
                    Fechas de Restricción{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  {selectedDates.length > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleClearAllDates}
                      disabled={loadingPreview || loadingCreate}
                      className="h-8 text-xs"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Limpiar todo
                    </Button>
                  )}
                </div>

                {/* Calendar */}
                <Card>
                  <CardContent className="pt-6">
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between mb-4">
                      <button
                        type="button"
                        onClick={() => changeMonth(-1)}
                        className="hover:text-blue-600 p-2"
                        disabled={loadingPreview || loadingCreate}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <span className="font-semibold text-lg capitalize">
                        {currentMonth.toLocaleString("es-ES", {
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      <button
                        type="button"
                        onClick={() => changeMonth(1)}
                        className="hover:text-blue-600 p-2"
                        disabled={loadingPreview || loadingCreate}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 gap-2 mb-2">
                      {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(
                        (day) => (
                          <div
                            key={day}
                            className="text-center text-sm font-medium text-gray-500 py-1"
                          >
                            {day}
                          </div>
                        )
                      )}
                    </div>

                    {/* Calendar Grid */}
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
                              if (isNaN(date.getTime()))
                                return <div key={slotIndex} />;

                              const dateStr = dateToString(date);
                              const isSelected = selectedDates.some(
                                (d) => dateToString(d) === dateStr
                              );
                              const isToday = dateStr === todayStr;
                              const isPast = date.getTime() < today.getTime();
                              const isNonWorking = nonWorkingDays.has(dateStr);
                              const isDisabled = isPast || isNonWorking;

                              return (
                                <button
                                  key={slotIndex}
                                  type="button"
                                  disabled={
                                    isDisabled ||
                                    loadingPreview ||
                                    loadingCreate
                                  }
                                  title={
                                    isPast
                                      ? "Fecha pasada"
                                      : isNonWorking
                                        ? "Día no laboral"
                                        : isSelected
                                          ? "Click para deseleccionar"
                                          : "Click para seleccionar"
                                  }
                                  className={`p-2 text-sm rounded-lg transition-colors relative ${
                                    isDisabled
                                      ? "text-gray-300 dark:text-gray-600 cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                                      : isSelected
                                        ? "bg-blue-500 text-white font-semibold ring-2 ring-blue-300"
                                        : isToday
                                          ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                  }`}
                                  onClick={() => handleDateToggle(date)}
                                >
                                  {date.getDate()}
                                  {isSelected && (
                                    <span className="absolute top-0 right-0 flex h-2 w-2">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                    </span>
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

                    {/* Legend */}
                    <div className="mt-4 pt-4 border-t text-xs text-gray-500 dark:text-gray-400 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                        <span>Día no laboral / Pasado</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-100 dark:bg-blue-900 rounded"></div>
                        <span>Hoy</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span>Seleccionado</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Selected Dates Display */}
                {selectedDates.length > 0 && (
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-2">
                      {selectedDates.map((date) => (
                        <span
                          key={date.toISOString()}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                        >
                          <CalendarIcon className="h-3 w-3" />
                          {formatShortDate(date)}
                          <button
                            type="button"
                            onClick={() => handleRemoveDate(date)}
                            className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                            disabled={loadingPreview || loadingCreate}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {selectedDates.length} fecha
                      {selectedDates.length !== 1 ? "s" : ""} seleccionada
                      {selectedDates.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Time Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime" className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Hora Inicio (Opcional)
                </Label>
                <Input
                  type="time"
                  id="startTime"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      startTime: e.target.value,
                    }))
                  }
                  disabled={loadingPreview || loadingCreate}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime" className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Hora Fin (Opcional)
                </Label>
                <Input
                  type="time"
                  id="endTime"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      endTime: e.target.value,
                    }))
                  }
                  disabled={loadingPreview || loadingCreate}
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                <Check className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  {successMessage}
                </AlertDescription>
              </Alert>
            )}

            {previewData && !successMessage && (
              <div className="space-y-4">
                <Alert
                  className={`${
                    previewData.affectedCount > 0
                      ? "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800"
                      : "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                  }`}
                >
                  <AlertTriangle
                    className={`h-4 w-4 ${
                      previewData.affectedCount > 0
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-semibold ${
                          previewData.affectedCount > 0
                            ? "text-yellow-800 dark:text-yellow-200"
                            : "text-green-800 dark:text-green-200"
                        }`}
                      >
                        {previewData.affectedCount > 0
                          ? `⚠️ ${previewData.affectedCount} cita${previewData.affectedCount !== 1 ? "s" : ""} será${previewData.affectedCount !== 1 ? "n" : ""} afectada${previewData.affectedCount !== 1 ? "s" : ""}`
                          : "✓ No hay citas afectadas"}
                      </span>
                    </div>
                  </AlertDescription>
                </Alert>

                {previewData.appointments &&
                  previewData.appointments.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                        Citas que serán afectadas:
                      </h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                        {previewData.appointments.map((appointment) => (
                          <Card
                            key={appointment.id}
                            className="border-l-4 border-l-orange-500 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() =>
                              handleAppointmentClick(appointment.id)
                            }
                          >
                            <CardContent className="p-4">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div className="flex items-start gap-3 flex-1">
                                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                                    <UserIcon className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-semibold text-gray-900 dark:text-white truncate">
                                      {appointment.clientName}
                                    </h5>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1 text-sm text-gray-600 dark:text-gray-400">
                                      <div className="flex items-center gap-1">
                                        <CalendarIcon className="h-3 w-3" />
                                        <span>
                                          {formatDate(appointment.date)}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        <span className="font-medium">
                                          {formatTime(appointment.startTime)} -{" "}
                                          {formatTime(appointment.endTime)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 text-xs font-medium rounded-full">
                                    Conflicto
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
              <Button
                type="submit"
                disabled={!isFormValid || loadingPreview || loadingCreate}
                variant="outline"
                className="flex-1"
              >
                {loadingPreview ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Previsualizando...
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Vista Previa
                  </>
                )}
              </Button>

              <Button
                type="button"
                onClick={handleCreate}
                disabled={
                  !previewData ||
                  loadingPreview ||
                  loadingCreate ||
                  !!successMessage
                }
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                {loadingCreate ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Creando...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Confirmar Restricción
                  </>
                )}
              </Button>

              <Button
                type="button"
                onClick={handleReset}
                variant="ghost"
                disabled={loadingPreview || loadingCreate}
                className="sm:w-auto"
              >
                Limpiar
              </Button>

              <Button
                type="button"
                onClick={handleClose}
                variant="ghost"
                disabled={loadingCreate}
                className="sm:w-auto"
              >
                Cerrar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de detalles de la cita */}
      {selectedAppointmentId && (
        <AppointmentDetailsDialog
          appointmentId={selectedAppointmentId}
          isOpen={isDetailsDialogOpen}
          onClose={() => {
            setIsDetailsDialogOpen(false);
            setSelectedAppointmentId(null);
          }}
          onCancel={() => {}}
          onDelete={() => {}}
          onCall={() => {}}
          onEmail={() => {}}
        />
      )}
    </>
  );
}
