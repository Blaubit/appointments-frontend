import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScheduleFormProps, ScheduleSettings,TimezoneOption, WorkingDaySettings } from "@/types";




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
  isLoading = false
}: ScheduleFormProps) {
  const [scheduleSettings, setScheduleSettings] = useState<ScheduleSettings>(initialSettings);

  const handleSaveSchedule = async () => {
    try {
      await onSave(scheduleSettings);
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };

  const updateBasicSetting = (key: keyof Omit<ScheduleSettings, 'workingDays'>, value: string | number) => {
    setScheduleSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateWorkingDay = (day: keyof ScheduleSettings['workingDays'], updates: Partial<WorkingDaySettings>) => {
    setScheduleSettings(prev => ({
      ...prev,
      workingDays: {
        ...prev.workingDays,
        [day]: {
          ...prev.workingDays[day],
          ...updates
        }
      }
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración de Horarios</CardTitle>
        <CardDescription>
          Define tus horarios de trabajo y disponibilidad
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="timezone">Zona Horaria</Label>
              <Select
                value={scheduleSettings.timezone}
                onValueChange={(value) => updateBasicSetting('timezone', value)}
              >
                <SelectTrigger>
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
              <Label htmlFor="appointmentDuration">
                Duración por Defecto (minutos)
              </Label>
              <Input
                id="appointmentDuration"
                type="number"
                value={scheduleSettings.appointmentDuration}
                onChange={(e) =>
                  updateBasicSetting('appointmentDuration', parseInt(e.target.value))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bufferTime">
                Tiempo de Descanso (minutos)
              </Label>
              <Input
                id="bufferTime"
                type="number"
                value={scheduleSettings.bufferTime}
                onChange={(e) =>
                  updateBasicSetting('bufferTime', parseInt(e.target.value))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxAdvanceBooking">
                Reserva Máxima Anticipada (días)
              </Label>
              <Input
                id="maxAdvanceBooking"
                type="number"
                value={scheduleSettings.maxAdvanceBooking}
                onChange={(e) =>
                  updateBasicSetting('maxAdvanceBooking', parseInt(e.target.value))
                }
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Horarios de Trabajo</h4>
            <div className="space-y-4">
              {Object.entries(scheduleSettings.workingDays).map(
                ([day, settings]) => (
                  <div key={day} className="flex items-center space-x-4">
                    <div className="w-24">
                      <Switch
                        checked={settings.enabled}
                        onCheckedChange={(checked) =>
                          updateWorkingDay(day as keyof ScheduleSettings['workingDays'], { enabled: checked })
                        }
                      />
                    </div>
                    <div className="w-20 text-sm font-medium">
                      {dayNames[day as keyof typeof dayNames]}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="time"
                        value={settings.start}
                        onChange={(e) =>
                          updateWorkingDay(day as keyof ScheduleSettings['workingDays'], { start: e.target.value })
                        }
                        disabled={!settings.enabled}
                        className="w-32"
                      />
                      <span className="text-gray-500">a</span>
                      <Input
                        type="time"
                        value={settings.end}
                        onChange={(e) =>
                          updateWorkingDay(day as keyof ScheduleSettings['workingDays'], { end: e.target.value })
                        }
                        disabled={!settings.enabled}
                        className="w-32"
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveSchedule} disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}