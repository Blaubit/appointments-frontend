"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Appointment } from "@/types";
import { AppointmentActions } from "./appointment-actions";
import { useState } from "react";
import { AppointmentDetailsDialog } from "@/components/appointment-details-dialog";

interface AppointmentCardProps {
  appointment: Appointment;
  onEdit?: (appointment: Appointment) => void;
  onCancel?: (appointment: Appointment) => void;
  onDelete?: (appointment: Appointment) => void;
  onCall?: (appointment: Appointment) => void;
  onEmail?: (appointment: Appointment) => void;
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case "confirmed":
      return "default";
    case "pending":
      return "secondary";
    case "cancelled":
      return "destructive";
    case "completed":
      return "outline";
    default:
      return "secondary";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "confirmed":
      return "Confirmada";
    case "pending":
      return "Pendiente";
    case "cancelled":
      return "Cancelada";
    case "completed":
      return "Completada";
    default:
      return status;
  }
};

export function AppointmentCard({
  appointment,
  onEdit,
  onCancel,
  onDelete,
  onCall,
  onEmail,
}: AppointmentCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formatDate = (date: Date) => {
    try {
      return format(date, "dd/MM/yyyy", { locale: es });
    } catch {
      return String(date);
    }
  };

  const getClientInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleCardClick = (event: React.MouseEvent) => {
    // Evitar abrir el dialog si se hace clic en los botones de acciones
    if ((event.target as HTMLElement).closest("[data-actions]")) {
      return;
    }

    setIsDialogOpen(true);
  };

  return (
    <>
      <Card
        className="cursor-pointer hover:shadow-md transition-shadow duration-200 border hover:border-gray-300"
        onClick={handleCardClick}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={appointment.client.avatar} />
                <AvatarFallback>
                  {getClientInitials(appointment.client.fullName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-sm">
                  {appointment.client.fullName}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {appointment.client.phone}
                </p>
              </div>
            </div>
            <div data-actions>
              <AppointmentActions
                appointment={appointment}
                onEdit={onEdit}
                onCancel={onCancel}
                onDelete={onDelete}
                onCall={onCall}
                onEmail={onEmail}
                variant="dropdown"
                size="sm"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant={getStatusVariant(appointment.status)}>
              {getStatusText(appointment.status)}
            </Badge>
            <span className="font-semibold text-lg">
              Q{appointment.payment.amount}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(appointment.appointmentDate)}</span>
            </div>

            <div className="flex items-center space-x-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                {appointment.startTime} - {appointment.endTime}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">
                {appointment.professional.fullName}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Servicios:
            </p>
            {appointment.services.map((service, index) => (
              <div key={service.id} className="text-xs">
                <span className="font-medium">{service.name}</span>
                <span className="text-muted-foreground ml-2">
                  ({service.durationMinutes} min)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AppointmentDetailsDialog
        appointmentId={appointment.id}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onEdit={onEdit || (() => {})}
        onCancel={onCancel || (() => {})}
        onDelete={onDelete || (() => {})}
        onCall={onCall || (() => {})}
        onEmail={onEmail || (() => {})}
      />
    </>
  );
}
