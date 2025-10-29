import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Activity } from "lucide-react";
import type { Appointment, Client } from "@/types";
import { AppointmentTimelineItem } from "./appointment-timeline-item";

interface AppointmentsTimelineProps {
  client: Client;
  appointments: Appointment[];
  onViewAppointment: (appointment: Appointment) => void;
}

export function AppointmentsTimeline({
  client,
  appointments,
  onViewAppointment,
}: AppointmentsTimelineProps) {
  if (appointments.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Activity className="h-5 w-5" />
            Historial de Citas
          </CardTitle>
          <CardDescription className="text-sm">
            Cronología completa de todas las citas de {client.fullName}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No hay citas registradas
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center">
              Este paciente aún no tiene citas en el historial.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Activity className="h-5 w-5" />
          Historial de Citas
        </CardTitle>
        <CardDescription className="text-sm">
          Cronología completa de todas las citas de {client.fullName}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="relative">
          {/* Línea vertical continua */}
          <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 z-0" />

          <div className="space-y-4 sm:space-y-6">
            {appointments.map((appointment) => (
              <AppointmentTimelineItem
                key={appointment.id}
                appointment={appointment}
                onViewAppointment={onViewAppointment}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
