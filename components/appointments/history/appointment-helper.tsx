import { Badge } from "@/components/ui/badge";
import formatCurrency from "@/utils/functions/formatCurrency";
import { CheckCircle, XCircle, UserX, Clock } from "lucide-react";

export function useAppointmentHelpers() {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

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

  const renderServicesDetails = (services: any[]) => {
    if (!Array.isArray(services) || services.length === 0)
      return <span>Sin servicios</span>;
    return (
      <ul className="space-y-1">
        {services.map((service, idx) => (
          <li key={service.id || idx}>
            <strong>{service.name}</strong> - {service.durationMinutes} min -
            {formatCurrency(Number(service.price))}
          </li>
        ))}
      </ul>
    );
  };

  const calculateTotalPrice = (services: any[]) => {
    if (!Array.isArray(services) || services.length === 0) return 0;
    return services.reduce((sum, s) => sum + Number(s.price || 0), 0);
  };

  const calculateTotalDuration = (services: any[]) => {
    if (!Array.isArray(services) || services.length === 0) return 0;
    return services.reduce((sum, s) => sum + Number(s.durationMinutes || 0), 0);
  };

  return {
    getInitials,
    getStatusBadge,
    getTimelineIcon,
    formatDate,
    renderServicesSummary,
    renderServicesDetails,
    calculateTotalPrice,
    calculateTotalDuration,
  };
}
