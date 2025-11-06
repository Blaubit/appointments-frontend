import { useState, useEffect } from "react";
import ProfessionalSelectorCard from "@/components/professional-selector";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { updateSchedule } from "@/actions/user/updateSchedule";
import findAvailabilities from "@/actions/user/findAvailabilities";
import type { ScheduleSettings, WorkingDaySettings, User } from "@/types";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { useToast } from "@/hooks/use-toast";

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

const dayNames = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
};

interface ScheduleFormProps {
  professionals: User[];
  initialSettings?: ScheduleSettings;
  userSession?: User;
}

// Helper para adaptar availabilities del backend a la UI
function formatHour(hour: string | null | undefined, fallback: string): string {
  if (!hour) return fallback;
  return hour.slice(0, 5);
}

// Mapea los nombres reales de las propiedades
function mapAvailabilitiesToScheduleSettings(avail: any): ScheduleSettings {
  const getDaySettings = (
    day: string,
    defaultStart: string,
    defaultEnd: string
  ): WorkingDaySettings => {
    const start = avail[`${day}Start`];
    const end = avail[`${day}End`];
    return {
      enabled: !!(start && end),
      start: formatHour(start, defaultStart),
      end: formatHour(end, defaultEnd),
    };
  };

  return {
    timezone: avail.timezone || defaultScheduleSettings.timezone,
    appointmentDuration:
      avail.appointmentDuration || defaultScheduleSettings.appointmentDuration,
    bufferTime: avail.bufferTime || defaultScheduleSettings.bufferTime,
    maxAdvanceBooking:
      avail.maxAdvanceBooking || defaultScheduleSettings.maxAdvanceBooking,
    workingDays: {
      monday: getDaySettings("monday", "09:00", "17:00"),
      tuesday: getDaySettings("tuesday", "09:00", "17:00"),
      wednesday: getDaySettings("wednesday", "09:00", "17:00"),
      thursday: getDaySettings("thursday", "09:00", "17:00"),
      friday: getDaySettings("friday", "09:00", "17:00"),
      saturday: getDaySettings("saturday", "09:00", "13:00"),
      sunday: getDaySettings("sunday", "09:00", "13:00"),
    },
  };
}

export function ScheduleForm({
  professionals,
  initialSettings = defaultScheduleSettings,
  userSession,
}: ScheduleFormProps) {
  const [scheduleSettings, setScheduleSettings] =
    useState<ScheduleSettings>(initialSettings);
  const [selectedProfessional, setSelectedProfessional] = useState<User | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Estado para el dialog
  const [dialogOpen, setDialogOpen] = useState(false);

  const { toast } = useToast();

  // Cierra el diálogo automáticamente después de 1 segundo
  useEffect(() => {
    if (dialogOpen) {
      const timer = setTimeout(() => {
        setDialogOpen(false);
        setIsEditing(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [dialogOpen]);

  // Preselecciona profesional si el usuario es profesional
  useEffect(() => {
    if (!userSession) return;

    // Si la lista de professionals está vacía (p. ej. 403), pero el usuario actual es profesional,
    // lo seleccionamos directamente para que pueda editar sus propios horarios.
    if (
      userSession.role?.name === "profesional" &&
      (!professionals || professionals.length === 0)
    ) {
      setSelectedProfessional(userSession);
      return;
    }

    if (userSession.role?.name === "profesional") {
      const professional = professionals.find(
        (p) =>
          p.id === userSession.id ||
          p.id.toString() === userSession.id.toString()
      );
      if (professional) setSelectedProfessional(professional);
      else {
        // Si no está en la lista pero la lista existe (por ejemplo limitado),
        // podemos optar por seleccionar al propio userSession para permitir edición de su horario.
        if (professionals && professionals.length > 0) {
          // no hacemos nada; se mantiene null
        }
      }
    }
  }, [userSession, professionals]);

  // Cuando seleccionas un profesional, busca sus horarios y preselecciona
  useEffect(() => {
    const fetchAvailabilities = async () => {
      if (!selectedProfessional) return;
      setIsLoading(true);
      try {
        const result = await findAvailabilities(selectedProfessional.id);

        if ("data" in result) {
          setScheduleSettings(mapAvailabilitiesToScheduleSettings(result.data));
        } else {
          // Si la respuesta no contiene data, dejamos el default y avisamos
          setScheduleSettings(defaultScheduleSettings);
          toast({
            title: "No hay horarios",
            description:
              "No se encontraron horarios para este profesional. Se usarán valores por defecto.",
            variant: "default",
          });
        }
      } catch (error: any) {
        console.error("Error obteniendo disponibilidades:", error);
        toast({
          title: "Error",
          description:
            error?.message ||
            "No se pudieron cargar las disponibilidades. Puede que no tengas permisos.",
          variant: "destructive",
        });
        setScheduleSettings(defaultScheduleSettings);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailabilities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProfessional]);

  const updateWorkingDay = (
    day: keyof ScheduleSettings["workingDays"],
    updates: Partial<WorkingDaySettings>
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

  function mapToDto(settings: ScheduleSettings, professionalId: string) {
    return {
      professionalId,
      mondayStart: settings.workingDays.monday.enabled
        ? settings.workingDays.monday.start
        : null,
      mondayEnd: settings.workingDays.monday.enabled
        ? settings.workingDays.monday.end
        : null,
      tuesdayStart: settings.workingDays.tuesday.enabled
        ? settings.workingDays.tuesday.start
        : null,
      tuesdayEnd: settings.workingDays.tuesday.enabled
        ? settings.workingDays.tuesday.end
        : null,
      wednesdayStart: settings.workingDays.wednesday.enabled
        ? settings.workingDays.wednesday.start
        : null,
      wednesdayEnd: settings.workingDays.wednesday.enabled
        ? settings.workingDays.wednesday.end
        : null,
      thursdayStart: settings.workingDays.thursday.enabled
        ? settings.workingDays.thursday.start
        : null,
      thursdayEnd: settings.workingDays.thursday.enabled
        ? settings.workingDays.thursday.end
        : null,
      fridayStart: settings.workingDays.friday.enabled
        ? settings.workingDays.friday.start
        : null,
      fridayEnd: settings.workingDays.friday.enabled
        ? settings.workingDays.friday.end
        : null,
      saturdayStart: settings.workingDays.saturday.enabled
        ? settings.workingDays.saturday.start
        : null,
      saturdayEnd: settings.workingDays.saturday.enabled
        ? settings.workingDays.saturday.end
        : null,
      sundayStart: settings.workingDays.sunday.enabled
        ? settings.workingDays.sunday.start
        : null,
      sundayEnd: settings.workingDays.sunday.enabled
        ? settings.workingDays.sunday.end
        : null,
    };
  }

  const handleSaveSchedule = async () => {
    if (!selectedProfessional) {
      alert("Selecciona primero un profesional");
      return;
    }
    setIsLoading(true);
    const dto = mapToDto(scheduleSettings, selectedProfessional.id);
    try {
      const result = await updateSchedule(dto);

      // Si result.status === 200 o como lo manejes en tu backend
      if ("data" in result) {
        setDialogOpen(true); // Muestra el dialog de éxito
      } else {
        // Manejar errores en la respuesta
        toast({
          title: "Error guardando horario",
          description:
            result?.message ||
            "No se pudo guardar el horario. Revisa permisos o intenta de nuevo.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error al guardar horario:", error);
      toast({
        title: "Error guardando horario",
        description:
          error?.message ||
          "Error de red o permisos al intentar guardar el horario.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Card className="w-full max-w-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg sm:text-xl">
          Configuración de Horarios
        </CardTitle>
        <CardDescription className="text-sm">
          Selecciona el profesional y define sus horarios de trabajo y
          disponibilidad
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="space-y-6">
          <ProfessionalSelectorCard
            professionals={professionals}
            selectedProfessional={selectedProfessional}
            onSelectionChange={setSelectedProfessional}
            isLocked={userSession?.role.name == "profesional"}
          />

          {/* Botón para editar horarios */}
          <div className="flex justify-end mb-2">
            <Button
              variant={isEditing ? "secondary" : "default"}
              onClick={() => setIsEditing((prev) => !prev)}
              disabled={!selectedProfessional}
              className="w-full sm:w-auto"
            >
              {isEditing ? "Cancelar edición" : "Editar horarios"}
            </Button>
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
                              isEditing &&
                              updateWorkingDay(
                                day as keyof ScheduleSettings["workingDays"],
                                { enabled: checked }
                              )
                            }
                            disabled={!isEditing}
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
                              isEditing &&
                              updateWorkingDay(
                                day as keyof ScheduleSettings["workingDays"],
                                { start: e.target.value }
                              )
                            }
                            className="flex-1"
                            disabled={!isEditing}
                          />
                          <span className="text-gray-500 text-sm">a</span>
                          <Input
                            type="time"
                            value={settings.end}
                            onChange={(e) =>
                              isEditing &&
                              updateWorkingDay(
                                day as keyof ScheduleSettings["workingDays"],
                                { end: e.target.value }
                              )
                            }
                            className="flex-1"
                            disabled={!isEditing}
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
                            isEditing &&
                            updateWorkingDay(
                              day as keyof ScheduleSettings["workingDays"],
                              { enabled: checked }
                            )
                          }
                          disabled={!isEditing}
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
                            isEditing &&
                            updateWorkingDay(
                              day as keyof ScheduleSettings["workingDays"],
                              { start: e.target.value }
                            )
                          }
                          disabled={!isEditing || !settings.enabled}
                          className="w-32"
                        />
                        <span className="text-gray-500">a</span>
                        <Input
                          type="time"
                          value={settings.end}
                          onChange={(e) =>
                            isEditing &&
                            updateWorkingDay(
                              day as keyof ScheduleSettings["workingDays"],
                              { end: e.target.value }
                            )
                          }
                          disabled={!isEditing || !settings.enabled}
                          className="w-32"
                        />
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Botón de guardar */}
          {isEditing && (
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleSaveSchedule}
                disabled={isLoading || !selectedProfessional}
                className="w-full sm:w-auto"
              >
                {isLoading
                  ? "Guardando..."
                  : !selectedProfessional
                    ? "Selecciona un profesional"
                    : "Guardar Cambios"}
              </Button>
            </div>
          )}
        </div>
      </CardContent>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        variant="success"
        type="notification"
        title="Horario actualizado"
        description="¡Los cambios en el horario se guardaron correctamente!"
        showCancel={false} // Oculta el botón cancelar
      />
    </Card>
  );
}
