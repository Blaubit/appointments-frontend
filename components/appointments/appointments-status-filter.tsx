"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

// Define los estados posibles de una cita
export const APPOINTMENT_STATUSES = {
  all: { label: "Todos los estados", icon: null },
  scheduled: {
    label: "Programada",
    icon: Calendar,
    color: "bg-blue-100 text-blue-800",
  },
  confirmed: {
    label: "Confirmada",
    icon: CheckCircle,
    color: "bg-green-100 text-green-800",
  },
  in_progress: {
    label: "En progreso",
    icon: Clock,
    color: "bg-yellow-100 text-yellow-800",
  },
  completed: {
    label: "Completada",
    icon: CheckCircle,
    color: "bg-emerald-100 text-emerald-800",
  },
  cancelled: {
    label: "Cancelada",
    icon: XCircle,
    color: "bg-red-100 text-red-800",
  },
  no_show: {
    label: "No asistió",
    icon: AlertCircle,
    color: "bg-gray-100 text-gray-800",
  },
} as const;

type AppointmentStatus = keyof typeof APPOINTMENT_STATUSES;

interface AppointmentStatusFilterProps {
  className?: string;
}

export function AppointmentStatusFilter({
  className = "",
}: AppointmentStatusFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status") || "all";

  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value === "all") {
      params.delete("status");
    } else {
      params.set("status", value);
    }

    // Reset page when changing status
    params.delete("page");

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl);
  };

  const renderStatusBadge = (status: AppointmentStatus) => {
    const statusInfo = APPOINTMENT_STATUSES[status];
    const Icon = statusInfo.icon;

    if (status === "all") {
      return (
        <div className="flex items-center gap-2">
          <span>Todos los estados</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4" />}
        <span>{statusInfo.label}</span>
      </div>
    );
  };

  return (
    <div className={className}>
      <Select value={currentStatus} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue>
            {renderStatusBadge(currentStatus as AppointmentStatus)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(APPOINTMENT_STATUSES).map(([value, info]) => {
            const Icon = info.icon;
            return (
              <SelectItem key={value} value={value}>
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{info.label}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}

// Componente para mostrar el badge de estado en las tablas/cards
interface AppointmentStatusBadgeProps {
  status: string;
  className?: string;
}

export function AppointmentStatusBadge({
  status,
  className = "",
}: AppointmentStatusBadgeProps) {
  const statusInfo = APPOINTMENT_STATUSES[status as AppointmentStatus];

  if (!statusInfo) {
    return <Badge className={className}>{status}</Badge>;
  }

  const Icon = statusInfo.icon;

  return (
    <Badge className={`${className}`} variant="secondary">
      <div className="flex items-center gap-1">
        {Icon && <Icon className="h-3 w-3" />}
        <span>{statusInfo.label}</span>
      </div>
    </Badge>
  );
}
