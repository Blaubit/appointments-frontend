"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MessageCircle, Phone, MoreHorizontal } from "lucide-react";
import { Appointment } from "@/types";
import { openWhatsApp } from "@/utils/functions/openWhatsapp";
import { AppointmentDetailsDialog } from "@/components/appointment-details-dialog";

interface AppointmentActionsProps {
  appointment: Appointment;
  onEdit?: (appointment: Appointment) => void;
  onCancel?: (appointment: Appointment) => void;
  onDelete?: (appointment: Appointment) => void;
  onCall?: (appointment: Appointment) => void;
  onEmail?: (appointment: Appointment) => void;
  variant?: "dropdown" | "buttons";
  size?: "sm" | "md" | "lg";
}

export function AppointmentActions({
  appointment,
  onEdit,
  onCancel,
  onDelete,
  onCall,
  onEmail,
  variant = "dropdown",
  size = "md",
}: AppointmentActionsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleView = () => {
    setIsDialogOpen(true);
  };

  const handleWhatsApp = () => {
    const message = `Hola, le saluda la clínica del Dr. ${encodeURIComponent(
      appointment.professional.fullName
    )}`;
    openWhatsApp(appointment.client.phone, message);
  };

  const handleCall = () => {
    if (onCall) {
      onCall(appointment);
    } else {
      // Implementación por defecto para llamar
      window.location.href = `tel:${appointment.client.phone}`;
    }
  };

  const buttonSizeClass = {
    sm: "h-8 px-2 text-xs",
    md: "h-9 px-3 text-sm",
    lg: "h-10 px-4 text-sm",
  }[size];

  const iconSize = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-4 w-4",
  }[size];

  if (variant === "buttons") {
    return (
      <>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleView}
            className={buttonSizeClass}
            title="Ver detalles"
          >
            <Eye className={`${iconSize} mr-1`} />
            Ver
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleWhatsApp}
            className={`${buttonSizeClass} text-green-600 hover:text-green-700`}
            title="Enviar mensaje por WhatsApp"
          >
            <MessageCircle className={`${iconSize} mr-1`} />
            WhatsApp
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCall}
            className={`${buttonSizeClass} text-blue-600 hover:text-blue-700`}
            title="Llamar"
          >
            <Phone className={`${iconSize} mr-1`} />
            Llamar
          </Button>
        </div>

        <AppointmentDetailsDialog
          appointmentId={appointment.id}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onCancel={onCancel || (() => {})}
          onDelete={onDelete || (() => {})}
          onCall={onCall || (() => {})}
          onEmail={onEmail || (() => {})}
        />
      </>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className={`${buttonSizeClass} p-0`}>
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className={iconSize} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleView}>
            <Eye className="mr-2 h-4 w-4" />
            <span>Ver detalles</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleWhatsApp}>
            <MessageCircle className="mr-2 h-4 w-4 text-green-600" />
            <span>Enviar mensaje</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCall}>
            <Phone className="mr-2 h-4 w-4 text-blue-600" />
            <span>Llamar</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AppointmentDetailsDialog
        appointmentId={appointment.id}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCancel={onCancel || (() => {})}
        onDelete={onDelete || (() => {})}
        onCall={onCall || (() => {})}
        onEmail={onEmail || (() => {})}
      />
    </>
  );
}
