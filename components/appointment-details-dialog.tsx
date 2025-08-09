"use client";

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
} from "lucide-react";
import type { Appointment } from "@/types";
import {
  getStatusColor,
  getStatusIcon,
  getStatusText,
} from "@/utils/functions/appointmentStatus";
import WhatsappIcon from "./icons/whatsapp-icon";
import { openWhatsApp } from "@/utils/functions/openWhatsapp";
interface AppointmentDetailsDialogProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (appointment: Appointment) => void;
  onConfirm: (appointment: Appointment) => void;
  onCancel: (appointment: Appointment) => void;
  onDelete: (appointment: Appointment) => void;
  onCall: (appointment: Appointment) => void;
  onEmail: (appointment: Appointment) => void;
}

export function AppointmentDetailsDialog({
  appointment,
  isOpen,
  onClose,
  onEdit,
  onConfirm,
  onCancel,
  onDelete,
  onCall,
  onEmail,
}: AppointmentDetailsDialogProps) {
  if (!appointment) return null;

  const getInitials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "GTQ",
    }).format(amount);
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

  const getStatusBadge = (status: string) => {
    return (
      <Badge className={getStatusColor(status)}>
        <div className="flex items-center space-x-1">
          {getStatusIcon(status)}
          <span className="text-xs">{getStatusText(status)}</span>
        </div>
      </Badge>
    );
  };

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Detalles de la Cita
          </DialogTitle>
          <DialogDescription>
            Información completa de la cita programada
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Client Information */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserIcon className="h-4 w-4" />
                Información del Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={appointment.client.avatar || "/Avatar1.png"}
                    alt={appointment.client.fullName}
                  />
                  <AvatarFallback className="text-lg">
                    {getInitials(appointment.client.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Nombre
                      </Label>
                      <p className="text-sm font-medium">
                        {appointment.client.fullName}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Email
                      </Label>
                      <p className="text-sm">{appointment.client.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Teléfono
                      </Label>
                      <p className="text-sm">{appointment.client.phone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Estado
                      </Label>
                      <p className="text-sm">Activo</p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onCall(appointment)}
                    >
                      <Phone className="h-3 w-3 mr-1" />
                      Llamar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEmail(appointment)}
                    >
                       <Mail className="h-3 w-3 mr-1"  />
                      Email
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openWhatsApp(
                        appointment.client.phone,
                        `Hola, le saluda la clínica del Dr. ${encodeURIComponent(
                          appointment.professional.fullName
                        )}`
                      )}
                    >
                      <WhatsappIcon className="text-green-500" width={32} height={32} />
                    

                      WhatsApp
                    </Button>
                    
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appointment Information */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-4 w-4" />
                Información de la Cita
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Servicio
                    </Label>
                    <p className="text-sm font-medium">
                      {appointment.service.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Servicio profesional de calidad
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Fecha y Hora
                    </Label>
                    <p className="text-sm font-medium">
                      {formatDateTime(
                        appointment.appointmentDate.toLocaleString(),
                        appointment.startTime,
                      )}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Duración
                    </Label>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <p className="text-sm">
                        {appointment.service.durationMinutes} minutos
                      </p>
                    </div>
                  </div>
                  {appointment.company.address && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Ubicación
                      </Label>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <p className="text-sm">{appointment.company.address}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Estado
                    </Label>
                    <div className="mt-1">
                      {getStatusBadge(appointment.status)}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Precio
                    </Label>
                    <p className="text-sm font-medium">
                      {formatCurrency(Number(appointment.service.price) || 0)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Estado de Pago
                    </Label>
                    <div className="mt-1">
                      {getPaymentStatusBadge(appointment.status || "pending")}
                    </div>
                  </div>
                  {appointment.professional.fullName && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Doctor
                      </Label>
                      <p className="text-sm">
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
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-4 w-4" />
                  Información Adicional
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Notas
                  </Label>
                  <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {appointment.notes}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timestamps */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-4 w-4" />
                Historial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Creada
                  </Label>
                  <p className="text-sm">
                    {new Date(appointment.createdAt).toLocaleString("es-ES")}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Última Actualización
                  </Label>
                  <p className="text-sm">
                    {new Date(appointment.createdAt).toLocaleString("es-ES")}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Recordatorio Enviado
                  </Label>
                  <p className="text-sm">{appointment ? "Sí" : "No"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button onClick={() => onEdit(appointment)} className="flex-1">
              <Edit className="h-4 w-4 mr-2" />
              Editar Cita
            </Button>
            {appointment.status === "pending" && (
              <Button
                onClick={() => onConfirm(appointment)}
                variant="outline"
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirmar
              </Button>
            )}
            {appointment.status !== "cancelled" && (
              <Button
                onClick={() => onCancel(appointment)}
                variant="outline"
                className="flex-1"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            )}
            <Button
              onClick={() => onDelete(appointment)}
              variant="destructive"
              className="flex-1"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
