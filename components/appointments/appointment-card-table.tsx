import { Appointment } from "@/types";
import { AppointmentCard } from "./appointment-card";

interface AppointmentsCardListProps {
  appointments: Appointment[];
  onEdit?: (appointment: Appointment) => void;
  onCancel?: (appointment: Appointment) => void;
  onDelete?: (appointment: Appointment) => void;
  onCall?: (appointment: Appointment) => void;
  onEmail?: (appointment: Appointment) => void;
}

export function AppointmentsCardList({
  appointments,
  onEdit,
  onCancel,
  onDelete,
  onCall,
  onEmail,
}: AppointmentsCardListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          onEdit={onEdit}
          onCancel={onCancel}
          onDelete={onDelete}
          onCall={onCall}
          onEmail={onEmail}
        />
      ))}
    </div>
  );
}
