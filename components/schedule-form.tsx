import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  ScheduleFormProps,
  ScheduleSettings,
  TimezoneOption,
  WorkingDaySettings,
} from "@/types";

// Configuración por defecto
const defaultScheduleSettings: ScheduleSettings = {
  timezone: "America/Guatemala",
  appointmentDuration: 30,
  bufferTime: 15,
  maxAdvanceBooking: 30,
  workingDays: {
    monday: { enabled: true, start: "09:00", end: "17:00" },
    tuesday: { enabled: true, start: "09:00", end: "17:00" },
    wednesday: { enabled: true, start: "09:00", end: "17:00" },
    thursday: { enabled: true, start: "09:00", end: "17:00" },
    friday: { enabled: true, start: "09:00", end: "17:00" },
    saturday: { enabled: false, start: "09:00", end: "13:00" },
    sunday: { enabled: false, start: "09:00", end: "13:00" },
  },
};

// Opciones de zona horaria
const timezones: TimezoneOption[] = [
  { value: "America/Guatemala", label: "Guatemala (GMT-6)" },
  { value: "America/Mexico_City", label: "México (GMT-6)" },
  { value: "America/Costa_Rica", label: "Costa Rica (GMT-6)" },
  { value: "America/El_Salvador", label: "El Salvador (GMT-6)" },
  { value: "America/Honduras", label: "Honduras (GMT-6)" },
  { value: "America/Nicaragua", label: "Nicaragua (GMT-6)" },
  { value: "America/Panama", label: "Panamá (GMT-5)" },
  { value: "America/Bogota", label: "Colombia (GMT-5)" },
  { value: "America/Lima", label: "Perú (GMT-5)" },
  { value: "America/Santiago", label: "Chile (GMT-3)" },
  { value: "America/Argentina/Buenos_Aires", label: "Argentina (GMT-3)" },
  { value: "America/Sao_Paulo", label: "Brasil (GMT-3)" },
  { value: "America/New_York", label: "Nueva York (GMT-5)" },
  { value: "America/Los_Angeles", label: "Los Ángeles (GMT-8)" },
  { value: "Europe/Madrid", label: "Madrid (GMT+1)" },
  { value: "Europe/London", label: "Londres (GMT+0)" },
];

// Nombres de días en español
const dayNames = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
};

export function ScheduleForm({
  initialSettings = defaultScheduleSettings,
  onSave,
  isLoading = false,
}: ScheduleFormProps) {
  const [scheduleSettings, setScheduleSettings] =
    useState<ScheduleSettings>(initialSettings);

  const handleSaveSchedule = async () => {
    try {
      await onSave(scheduleSettings);
    } catch (error) {
      console.error("Error saving schedule:", error);
    }
  };

  const updateBasicSetting = (
    key: keyof Omit<ScheduleSettings, "workingDays">,
    value: string | number,
  ) => {
    setScheduleSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateWorkingDay = (
    day: keyof ScheduleSettings["workingDays"],
    updates: Partial<WorkingDaySettings>,
  ) => {
    setScheduleSettings((prev) => ({
      ...prev,
      workingDays: {
        ...prev.workingDays,
        [day]: {
          ...prev.workingDays[day],
          ...updates,
        },
      },
    }));
  };

  return (
    <Card className="w-full max-w-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg sm:text-xl">
          Configuración de Horarios
        </CardTitle>
        <CardDescription className="text-sm">
          Define tus horarios de trabajo y disponibilidad
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="space-y-6">
          {/* Configuración básica */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timezone" className="text-sm font-medium">
                Zona Horaria
              </Label>
              <Select
                value={scheduleSettings.timezone}
                onValueChange={(value) => updateBasicSetting("timezone", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="appointmentDuration"
                className="text-sm font-medium"
              >
                Duración por Defecto (min)
              </Label>
              <Input
                id="appointmentDuration"
                type="number"
                value={scheduleSettings.appointmentDuration}
                onChange={(e) =>
                  updateBasicSetting(
                    "appointmentDuration",
                    parseInt(e.target.value),
                  )
                }
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bufferTime" className="text-sm font-medium">
                Tiempo de Descanso (min)
              </Label>
              <Input
                id="bufferTime"
                type="number"
                value={scheduleSettings.bufferTime}
                onChange={(e) =>
                  updateBasicSetting("bufferTime", parseInt(e.target.value))
                }
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="maxAdvanceBooking"
                className="text-sm font-medium"
              >
                Reserva Máxima (días)
              </Label>
              <Input
                id="maxAdvanceBooking"
                type="number"
                value={scheduleSettings.maxAdvanceBooking}
                onChange={(e) =>
                  updateBasicSetting(
                    "maxAdvanceBooking",
                    parseInt(e.target.value),
                  )
                }
                className="w-full"
              />
            </div>
          </div>

          <Separator />

          {/* Horarios de trabajo */}
          <div className="space-y-4">
            <h4 className="font-medium text-base">Horarios de Trabajo</h4>
            <div className="space-y-3">
              {Object.entries(scheduleSettings.workingDays).map(
                ([day, settings]) => (
                  <div key={day} className="space-y-3 sm:space-y-0">
                    {/* Layout móvil: vertical */}
                    <div className="flex flex-col space-y-3 sm:hidden">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Switch
                            checked={settings.enabled}
                            onCheckedChange={(checked) =>
                              updateWorkingDay(
                                day as keyof ScheduleSettings["workingDays"],
                                { enabled: checked },
                              )
                            }
                          />
                          <span className="text-sm font-medium">
                            {dayNames[day as keyof typeof dayNames]}
                          </span>
                        </div>
                      </div>

                      {settings.enabled && (
                        <div className="flex items-center space-x-2 ml-8">
                          <Input
                            type="time"
                            value={settings.start}
                            onChange={(e) =>
                              updateWorkingDay(
                                day as keyof ScheduleSettings["workingDays"],
                                { start: e.target.value },
                              )
                            }
                            className="flex-1"
                          />
                          <span className="text-gray-500 text-sm">a</span>
                          <Input
                            type="time"
                            value={settings.end}
                            onChange={(e) =>
                              updateWorkingDay(
                                day as keyof ScheduleSettings["workingDays"],
                                { end: e.target.value },
                              )
                            }
                            className="flex-1"
                          />
                        </div>
                      )}
                    </div>

                    {/* Layout desktop: horizontal */}
                    <div className="hidden sm:flex sm:items-center sm:space-x-4">
                      <div className="w-16 flex-shrink-0">
                        <Switch
                          checked={settings.enabled}
                          onCheckedChange={(checked) =>
                            updateWorkingDay(
                              day as keyof ScheduleSettings["workingDays"],
                              { enabled: checked },
                            )
                          }
                        />
                      </div>
                      <div className="w-20 text-sm font-medium flex-shrink-0">
                        {dayNames[day as keyof typeof dayNames]}
                      </div>
                      <div className="flex items-center space-x-2 flex-1">
                        <Input
                          type="time"
                          value={settings.start}
                          onChange={(e) =>
                            updateWorkingDay(
                              day as keyof ScheduleSettings["workingDays"],
                              { start: e.target.value },
                            )
                          }
                          disabled={!settings.enabled}
                          className="w-32"
                        />
                        <span className="text-gray-500">a</span>
                        <Input
                          type="time"
                          value={settings.end}
                          onChange={(e) =>
                            updateWorkingDay(
                              day as keyof ScheduleSettings["workingDays"],
                              { end: e.target.value },
                            )
                          }
                          disabled={!settings.enabled}
                          className="w-32"
                        />
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Botón de guardar */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSaveSchedule}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
