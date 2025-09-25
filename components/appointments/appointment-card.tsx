import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Appointment } from "@/types";
import { AppointmentActions } from "./appointment-actions";

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
  const getClientInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: Date) => {
    try {
      return format(date, "dd/MM/yyyy", { locale: es });
    } catch {
      return date.toString();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={appointment.client.avatar} />
            <AvatarFallback>
              {getClientInitials(appointment.client.fullName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">
              {appointment.client.fullName}
            </p>
            <p className="text-xs text-muted-foreground">
              {appointment.client.phone}
            </p>
          </div>
        </div>
        <AppointmentActions
          appointment={appointment}
          variant="buttons"
          onEdit={onEdit}
          onCancel={onCancel}
          onDelete={onDelete}
          onCall={onCall}
          onEmail={onEmail}
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {formatDate(appointment.appointmentDate)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {appointment.startTime} - {appointment.endTime}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{appointment.professional.fullName}</span>
          </div>
          <div className="space-y-1">
            {appointment.services.map((service) => (
              <div key={service.id} className="text-sm">
                <span className="font-medium">{service.name}</span>
                <span className="text-muted-foreground ml-2">
                  ({service.durationMinutes} min - €{service.price})
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-2">
            <Badge variant={getStatusVariant(appointment.status)}>
              {getStatusText(appointment.status)}
            </Badge>
            <span className="text-sm font-medium">
              Q{appointment.payment.amount}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
