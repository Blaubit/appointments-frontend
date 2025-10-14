"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Appointment } from "@/types";
import { AppointmentActions } from "./appointment-actions";
import { useState } from "react";
import { AppointmentDetailsDialog } from "@/components/appointment-details-dialog";
import formatCurrency from "@/utils/functions/formatCurrency";

interface AppointmentsTableProps {
  appointments: Appointment[];
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

const getPaymentStatusVariant = (status: string) => {
  switch (status) {
    case "completed":
      return "default";
    case "pending":
      return "secondary";
    case "failed":
      return "destructive";
    default:
      return "secondary";
  }
};

const getPaymentStatusText = (status: string) => {
  switch (status) {
    case "completed":
      return "Pagado";
    case "pending":
      return "Pendiente";
    case "failed":
      return "Fallido";
    default:
      return status;
  }
};

export function AppointmentsTable({
  appointments,
  onEdit,
  onCancel,
  onDelete,
  onCall,
  onEmail,
}: AppointmentsTableProps) {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | undefined
  >();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formatDate = (date: Date) => {
    try {
      return format(date, "dd/MM/yyyy", { locale: es });
    } catch {
      return date;
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

  const handleRowClick = (
    appointment: Appointment,
    event: React.MouseEvent
  ) => {
    // Evitar abrir el dialog si se hace clic en los botones de acciones
    if ((event.target as HTMLElement).closest("[data-actions]")) {
      return;
    }

    setSelectedAppointmentId(appointment.id);
    setIsDialogOpen(true);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Profesional</TableHead>
            <TableHead>Fecha y Hora</TableHead>
            <TableHead>Servicios</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Pago</TableHead>
            <TableHead className="text-right">Monto</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6">
                No hay citas programadas
              </TableCell>
            </TableRow>
          ) : (
            appointments.map((appointment) => (
              <TableRow
                key={appointment.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={(event) => handleRowClick(appointment, event)}
              >
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={appointment.client.avatar} />
                      <AvatarFallback>
                        {getClientInitials(appointment.client.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {appointment.client.fullName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {appointment.client.phone}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={appointment.professional.avatar} />
                      <AvatarFallback>
                        {getClientInitials(appointment.professional.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-medium">
                      {appointment.professional.fullName}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {String(formatDate(appointment.appointmentDate))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {appointment.startTime} - {appointment.endTime}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {appointment.services.map((service) => (
                      <div key={service.id} className="text-sm">
                        <div className="font-medium">{service.name}</div>
                        <div className="text-muted-foreground">
                          {service.durationMinutes} min - €{service.price}
                        </div>
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(appointment.status)}>
                    {getStatusText(appointment.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={getPaymentStatusVariant(
                      appointment.payment.status
                    )}
                  >
                    {getPaymentStatusText(appointment.payment.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(Number(appointment.payment.amount))}
                </TableCell>
                <TableCell className="text-center" data-actions>
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
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AppointmentDetailsDialog
        appointmentId={selectedAppointmentId}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedAppointmentId(undefined);
        }}
        onEdit={onEdit || (() => {})}
        onCancel={onCancel || (() => {})}
        onDelete={onDelete || (() => {})}
        onCall={onCall || (() => {})}
        onEmail={onEmail || (() => {})}
      />
    </>
  );
}
