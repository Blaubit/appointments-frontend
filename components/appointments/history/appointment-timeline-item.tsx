import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  UserX,
  FileText,
} from "lucide-react";
import type { Appointment } from "@/types/appointments";

interface AppointmentTimelineItemProps {
  appointment: Appointment;
  onViewAppointment: (appointment: Appointment) => void;
}

export function AppointmentTimelineItem({
  appointment,
  onViewAppointment,
}: AppointmentTimelineItemProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: {
        label: "Completada",
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        icon: CheckCircle,
      },
      cancelled: {
        label: "Cancelada",
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        icon: XCircle,
      },
      no_show: {
        label: "No asistió",
        color:
          "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
        icon: UserX,
      },
      scheduled: {
        label: "Programada",
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        icon: Clock,
      },
      confirmed: {
        label: "Confirmada",
        color:
          "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
        icon: CheckCircle,
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.scheduled;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} text-xs`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getTimelineIcon = (status: string) => {
    const iconConfig = {
      completed: {
        icon: CheckCircle,
        color: "text-green-500",
        bg: "bg-green-50 dark:bg-green-900/20",
      },
      cancelled: {
        icon: XCircle,
        color: "text-red-500",
        bg: "bg-red-50 dark:bg-red-900/20",
      },
      no_show: {
        icon: UserX,
        color: "text-orange-500",
        bg: "bg-orange-50 dark:bg-orange-900/20",
      },
      scheduled: {
        icon: Clock,
        color: "text-blue-500",
        bg: "bg-blue-50 dark:bg-blue-900/20",
      },
      confirmed: {
        icon: CheckCircle,
        color: "text-purple-500",
        bg: "bg-purple-50 dark:bg-purple-900/20",
      },
    };

    const config =
      iconConfig[status as keyof typeof iconConfig] || iconConfig.scheduled;
    const Icon = config.icon;

    return { Icon, color: config.color, bg: config.bg };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hoy";
    if (diffDays === 1) return "Ayer";
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.ceil(diffDays / 7)} semanas`;
    if (diffDays < 365) return `Hace ${Math.ceil(diffDays / 30)} meses`;
    return `Hace ${Math.ceil(diffDays / 365)} años`;
  };

  const renderServicesSummary = (services: any[]) => {
    if (!Array.isArray(services) || services.length === 0)
      return "Sin servicios";
    return services.map((service, idx) => (
      <span key={service.id || idx}>
        {service.name} ({service.durationMinutes} min)
        {idx < services.length - 1 ? ", " : ""}
      </span>
    ));
  };

  const { Icon, color, bg } = getTimelineIcon(appointment.status);

  return (
    <div className="relative z-10">
      <div className="flex gap-3 sm:gap-4">
        {/* Icono del timeline */}
        <div className="relative flex-shrink-0 z-20">
          <div
            className={`w-8 h-8 sm:w-12 sm:h-12 ${bg} border-2 border-white dark:border-gray-800 rounded-full flex items-center justify-center shadow-sm`}
          >
            <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${color}`} />
          </div>
        </div>

        {/* Contenido de la cita */}
        <div className="flex-1 min-w-0 pb-4 sm:pb-6 relative z-10">
          <Card
            className="
              transition-all duration-300 cursor-pointer 
              border-l-4 border-l-gray-200 dark:border-l-gray-700
              hover:border-l-blue-500 dark:hover:border-l-blue-400 
              hover:shadow-lg hover:shadow-blue-100/50 dark:hover:shadow-blue-900/20
              hover:-translate-y-1
              relative overflow-hidden
              before:absolute before:inset-0 before:bg-gradient-to-r 
              before:from-blue-50/0 before:to-blue-50/20 
              dark:before:from-blue-900/0 dark:before:to-blue-900/10
              before:opacity-0 hover:before:opacity-100 
              before:transition-opacity before:duration-300
            "
            onClick={() => onViewAppointment(appointment)}
          >
            <CardContent className="p-3 sm:p-4 relative z-10">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate">
                    {renderServicesSummary(appointment.services)}
                  </h3>
                  {/* Información principal */}
                  <div className="space-y-1 sm:space-y-0 sm:flex sm:items-center sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="truncate">
                        {new Date(
                          appointment.appointmentDate
                        ).toLocaleDateString("es-ES")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>
                        {appointment.startTime} - {appointment.endTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="truncate">
                        {appointment.professional.fullName}
                      </span>
                    </div>
                  </div>
                  {/* Dirección */}
                  {appointment.company.address && (
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 sm:mt-0">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="truncate">
                        {appointment.company.address}
                      </span>
                    </div>
                  )}
                </div>
                {/* Lado derecho */}
                <div className="flex flex-col items-end gap-2 ml-2 sm:ml-3">
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {formatDate(appointment.appointmentDate.toLocaleString())}
                  </span>
                  {getStatusBadge(appointment.status)}
                </div>
              </div>
              {/* Notas */}
              {appointment.notes && (
                <div className="mb-2 sm:mb-3">
                  <div className="flex items-start gap-2">
                    <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                      {appointment.notes}
                    </p>
                  </div>
                </div>
              )}
              {/* Footer con precio total y duración */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                    €
                    {Array.isArray(appointment.services)
                      ? appointment.services.reduce(
                          (sum, s) => sum + Number(s.price || 0),
                          0
                        )
                      : 0}
                  </span>
                  <span className="text-xs text-gray-500">
                    •{" "}
                    {Array.isArray(appointment.services)
                      ? appointment.services.reduce(
                          (sum, s) => sum + Number(s.durationMinutes || 0),
                          0
                        )
                      : 0}{" "}
                    min
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
