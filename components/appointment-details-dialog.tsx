"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import formatCurrency from "@/utils/functions/formatCurrency";
import {
  Calendar,
  Phone,
  Mail,
  Edit,
  CheckCircle,
  XCircle,
  Trash2,
  Clock,
  MapPin,
  User as UserIcon,
  FileText,
  Stethoscope,
  CalendarClock,
  History,
  CreditCard,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { Appointment } from "@/types";
import {
  getStatusColor,
  getStatusIcon,
  getStatusText,
} from "@/utils/functions/appointmentStatus";
import WhatsappIcon from "./icons/whatsapp-icon";
import { openWhatsApp } from "@/utils/functions/openWhatsapp";
import { findOne } from "@/actions/appointments/findOne";
import { update } from "@/actions/appointments/appointmentStatus";
import Link from "next/link";
import { AppointmentPaymentDialog } from "@/components/appointments/appointment-payment-dialog";
import { RateClientDialog } from "@/components/client/RateClientDialog";

interface AppointmentDetailsDialogProps {
  appointmentId: string | undefined;
  isOpen: boolean;
  onClose: () => void;
  onCancel: (appointment: Appointment) => void;
  onDelete: (appointment: Appointment) => void;
  onCall: (appointment: Appointment) => void;
  onEmail: (appointment: Appointment) => void;
}

export function AppointmentDetailsDialog({
  appointmentId,
  isOpen,
  onClose,
  onDelete,
  onCall,
  onEmail,
}: AppointmentDetailsDialogProps) {
  const router = useRouter();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dialog states for payment and rating
  const [isPaymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [isRateDialogOpen, setRateDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchAppointment() {
      // Solo ejecutar si el modal está abierto y hay un appointmentId
      if (!appointmentId || !isOpen) return;

      setLoading(true);
      setError(null);
      try {
        const result = await findOne(appointmentId);
        if ("data" in result) {
          setAppointment(result.data);
        } else {
          setError(result.message || "No se pudo cargar la cita.");
        }
      } catch (err) {
        setError("Error inesperado al cargar la cita.");
      } finally {
        setLoading(false);
      }
    }
    fetchAppointment();
  }, [appointmentId, isOpen]); // Agregar isOpen como dependencia
  // Limpiar el estado cuando se cierre el modal
  useEffect(() => {
    if (!isOpen) {
      setAppointment(null);
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  if (!appointmentId || !isOpen) return null;

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cargando detalles...</DialogTitle>
            <DialogDescription>
              Por favor espere mientras se cargan los detalles de la cita.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 text-center text-gray-500">Cargando...</div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !appointment) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>
              Ocurrió un error al cargar los detalles de la cita.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 text-center text-red-500">
            {error || "No se pudo encontrar la cita."}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ... resto del código igual ...
  const getInitials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => (
    <Badge className={getStatusColor(status)}>
      <div className="flex items-center space-x-1">
        {getStatusIcon(status)}
        <span className="text-xs">{getStatusText(status)}</span>
      </div>
    </Badge>
  );

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        label: "Pendiente",
      },
      paid: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        label: "Pagado",
      },
      refunded: {
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        label: "Reembolsado",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <Badge variant="outline" className={config.color}>
        <span className="text-xs">{config.label}</span>
      </Badge>
    );
  };

  async function handleConfirmAppointment(appointment: Appointment) {
    try {
      await update({
        appointmentId: appointment.id,
        status: "confirmed",
      });
      onClose();
    } catch (err) {
      console.error("Error actualizando el estado de la cita:", err);
    }
  }

  async function handleCancelAppointment(appointment: Appointment) {
    try {
      await update({
        appointmentId: appointment.id,
        status: "cancelled",
      });
      onClose();
    } catch (err) {
      console.error("Error actualizando el estado de la cita:", err);
    }
  }

  const handleRescheduleAppointment = () => {
    //console.log("Reprogramar cita:", appointment?.id);
  };
  const handleEditAppointment = () => {
    router.push(`/appointments/${appointment?.id}/edit`);
  };
  const handleAttendAppointment = async () => {
    onClose();
    try {
      await update({
        appointmentId: appointment?.id!,
        status: "in_progress",
      });
      router.push(`/consultation/${appointment?.id}`);
    } catch (err) {
      console.error("Error actualizando el estado de la cita:", err);
    }
  };

  const handleViewClientHistory = () => {
    onClose();
    router.push(`/clients/${appointment?.client.id}/history`);
  };

  // Suma total de precios y duración
  const totalPrice = appointment?.services?.reduce(
    (acc: number, service: any) => acc + (Number(service.price) || 0),
    0
  );
  const totalDuration = appointment?.services?.reduce(
    (acc: number, service: any) => acc + (Number(service.durationMinutes) || 0),
    0
  );

  // PaymentDialog -> RateDialog flow handlers
  const handleOpenPaymentDialog = () => setPaymentDialogOpen(true);
  const handleClosePaymentDialog = () => setPaymentDialogOpen(false);

  // Cuando el pago se realiza, cierra el payment y abre el rate
  const handlePayAppointment = (
    appointment: Appointment,
    paymentData: { amount: number; method: string }
  ) => {
    // Aquí va tu lógica de pago
    setPaymentDialogOpen(false);
    // Usar setTimeout para asegurar que el estado se actualice correctamente
    setTimeout(() => {
      setRateDialogOpen(true);
    }, 100);
  };

  // Cuando el rating se guarda, cierra el rate
  const handleRateClient = (clientId: string, rating: number) => {
    //  console.log("Rating saved:", { clientId, rating }); // Debug log
    // Aquí va tu lógica de rating
    setRateDialogOpen(false);
  };

  const handleCloseRateDialog = () => {
    setRateDialogOpen(false);
  };
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[95vh] w-[95vw] sm:w-full overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="truncate">Detalles de la Cita</span>
            </DialogTitle>
            <DialogDescription className="text-sm">
              Información completa de la cita programada
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-6">
            {/* Client Information */}
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">Información del paciente</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleViewClientHistory}
                    className="text-xs sm:text-sm h-8 sm:h-9 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <History className="h-3 w-3 mr-1 flex-shrink-0" />
                    Ver Historial
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex items-center sm:flex-col sm:items-center gap-3 sm:gap-2">
                    <Avatar className="h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0">
                      <AvatarImage
                        src={appointment.client.avatar || "/Avatar1.png"}
                        alt={appointment.client.fullName}
                      />
                      <AvatarFallback className="text-sm sm:text-lg">
                        {getInitials(appointment.client.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="sm:hidden">
                      <h3 className="font-medium text-sm">
                        {appointment.client.fullName}
                      </h3>
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                      <div className="hidden sm:block">
                        <Label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                          Nombre
                        </Label>
                        <p className="text-sm font-medium truncate">
                          {appointment.client.fullName}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                          Email
                        </Label>
                        <p className="text-xs sm:text-sm truncate">
                          {appointment.client.email}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                          Teléfono
                        </Label>
                        <p className="text-xs sm:text-sm">
                          {appointment.client.phone}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                          Estado
                        </Label>
                        <p className="text-xs sm:text-sm">Activo</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onCall(appointment)}
                        className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
                      >
                        <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">Llamar</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEmail(appointment)}
                        className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
                      >
                        <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">Email</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          openWhatsApp(
                            appointment.client.phone,
                            `Hola, le saluda la clínica del Dr. ${encodeURIComponent(
                              appointment.professional.fullName
                            )}`
                          )
                        }
                        className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
                      >
                        <WhatsappIcon
                          className="text-green-500 mr-1 flex-shrink-0"
                          width={16}
                          height={16}
                        />
                        <span className="truncate">WhatsApp</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Created By Information */}
            {appointment.createdBy && (
              <Card>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <UserIcon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">Cita creada por</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <Label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                        Nombre
                      </Label>
                      <p className="text-sm font-medium truncate">
                        {appointment.createdBy.fullName}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                        Email
                      </Label>
                      <p className="text-xs sm:text-sm truncate">
                        {appointment.createdBy.email}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Appointment Information */}
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">Información de la Cita</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <Label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                        Servicios
                      </Label>
                      <ul className="space-y-2">
                        {appointment.services?.length > 0 ? (
                          appointment.services.map(
                            (service: any, idx: number) => (
                              <li
                                key={service.id || idx}
                                className="border-b pb-2 mb-2 last:border-none last:pb-0 last:mb-0"
                              >
                                <div className="font-medium text-sm truncate">
                                  {service.name}
                                </div>
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-2">
                                  <Clock className="h-3 w-3 flex-shrink-0" />
                                  {service.durationMinutes} min
                                  <span>•</span>
                                  {formatCurrency(Number(service.price) || 0)}
                                </div>
                              </li>
                            )
                          )
                        ) : (
                          <li className="text-xs text-gray-500">
                            Sin servicios asignados
                          </li>
                        )}
                      </ul>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Servicio profesional de calidad
                      </p>
                    </div>

                    <div>
                      <Label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                        Fecha y Hora
                      </Label>
                      <p className="text-xs sm:text-sm font-medium break-words">
                        {formatDateTime(
                          appointment.appointmentDate.toLocaleString(),
                          appointment.startTime
                        )}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                        Duración Total
                      </Label>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 flex-shrink-0" />
                        <p className="text-xs sm:text-sm">
                          {totalDuration || 0} minutos
                        </p>
                      </div>
                    </div>
                    {appointment.company.address && (
                      <div>
                        <Label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                          Ubicación
                        </Label>
                        <div className="flex items-start gap-1">
                          <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                          <p className="text-xs sm:text-sm break-words">
                            {appointment.company.address}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <Label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                        Estado
                      </Label>
                      <div className="mt-1">
                        {getStatusBadge(appointment.status)}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                        Precio Total
                      </Label>
                      <p className="text-sm font-medium">
                        {formatCurrency(totalPrice || 0)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                        Estado de Pago
                      </Label>
                      <div className="mt-1">
                        {getPaymentStatusBadge(
                          appointment.payment.status || "pending"
                        )}
                      </div>
                    </div>
                    {appointment.professional.fullName && (
                      <div>
                        <Label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                          Doctor
                        </Label>
                        <p className="text-xs sm:text-sm truncate">
                          {appointment.professional.fullName}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes and Additional Information */}
            {appointment.notes && (
              <Card>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <FileText className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">Información Adicional</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                      Notas
                    </Label>
                    <div className="mt-1 p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 break-words">
                        {appointment.notes}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Consultation Notes (added) */}
            {appointment.consultationNotes && (
              <Card>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Stethoscope className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">Notas de Consulta</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <Label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                        Observaciones
                      </Label>
                      <div className="mt-1 p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 break-words">
                          {appointment.consultationNotes.observations || "—"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                        Diagnóstico
                      </Label>
                      <div className="mt-1 p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 break-words">
                          {appointment.consultationNotes.diagnosis || "—"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                        Plan de Tratamiento
                      </Label>
                      <div className="mt-1 p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 break-words">
                          {appointment.consultationNotes.treatment || "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Timestamps */}
            <Card>
              <Link href={`/clients/${appointment.client.id}/history`}>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    Historial
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                    <div>
                      <Label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                        Creada
                      </Label>
                      <p className="text-xs sm:text-sm break-words">
                        {new Date(appointment.createdAt).toLocaleString(
                          "es-ES"
                        )}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                        Última Actualización
                      </Label>
                      <p className="text-xs sm:text-sm break-words">
                        {new Date(appointment.createdAt).toLocaleString(
                          "es-ES"
                        )}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                        Recordatorio Enviado
                      </Label>
                      <p className="text-xs sm:text-sm">
                        {appointment ? "Sí" : "No"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 pt-4">
              {(() => {
                const status = String(appointment?.status ?? "").toLowerCase();
                return status !== "cancelled" && status !== "canceled";
              })() && (
                <Button
                  onClick={handleAttendAppointment}
                  className="w-full h-10 text-sm bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                >
                  <Stethoscope className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Atender Cita</span>
                </Button>
              )}
              <Button
                onClick={() => handleEditAppointment()}
                variant="outline"
                className="w-full h-10 text-sm"
              >
                <Edit className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">Editar</span>
              </Button>
              {appointment.status !== "cancelled" &&
                appointment.status !== "completed" && (
                  <Button
                    onClick={handleRescheduleAppointment}
                    variant="outline"
                    className="w-full h-10 text-sm text-blue-600 border-blue-300 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-600 dark:hover:bg-blue-950"
                  >
                    <CalendarClock className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">Reprogramar</span>
                  </Button>
                )}
              {appointment.status === "scheduled" && (
                <Button
                  onClick={() => handleConfirmAppointment(appointment)}
                  variant="outline"
                  className="w-full h-10 text-sm text-green-600 border-green-300 hover:bg-green-50 dark:text-green-400 dark:border-green-600 dark:hover:bg-green-950"
                >
                  <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Confirmar</span>
                </Button>
              )}
              {appointment.status !== "cancelled" &&
                appointment.status !== "completed" && (
                  <Button
                    onClick={() => handleCancelAppointment(appointment)}
                    variant="outline"
                    className="w-full h-10 text-sm text-orange-600 border-orange-300 hover:bg-orange-50 dark:text-orange-400 dark:border-orange-600 dark:hover:bg-orange-950"
                  >
                    <XCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">Cancelar</span>
                  </Button>
                )}
              <Button
                onClick={() => onDelete(appointment)}
                variant="destructive"
                className="w-full h-10 text-sm"
              >
                <Trash2 className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">Eliminar</span>
              </Button>
              {/* Botón para pagar */}
              <Button
                onClick={handleOpenPaymentDialog}
                variant="outline"
                className="w-full h-10 text-sm text-indigo-600 border-indigo-300 hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-600 dark:hover:bg-indigo-950"
              >
                <CreditCard className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">Pagar</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog separado */}
      <AppointmentPaymentDialog
        appointment={appointment}
        isOpen={isPaymentDialogOpen}
        onClose={handleClosePaymentDialog}
        onPay={handlePayAppointment}
      />

      {/* RateClientDialog separado, se abre después de pagar */}
      <RateClientDialog
        client={appointment.client}
        onRate={handleRateClient}
        open={isRateDialogOpen}
        onOpenChange={setRateDialogOpen}
      />
    </>
  );
}
