"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Star,
  CheckCircle,
  XCircle,
  UserX,
  FileText,
  MessageSquare,
  Activity,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import type { Client } from "@/types/clients";
import type { Appointment } from "@/types/appointments";
import { Header } from "@/components/header";

interface ClientStats {
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  noShowAppointments: number;
  totalSpent: number;
  averageRating: number;
  completionRate: number;
}

interface ClientHistoryPageClientProps {
  client: Client;
  appointments: Appointment[];
}

export default function ClientHistoryPageClient({
  client,
  appointments,
}: ClientHistoryPageClientProps) {
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Funciones de utilidad
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
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getTimelineIcon = (status: string) => {
    const iconConfig = {
      completed: { icon: CheckCircle, color: "text-green-500" },
      cancelled: { icon: XCircle, color: "text-red-500" },
      no_show: { icon: UserX, color: "text-orange-500" },
      scheduled: { icon: Clock, color: "text-blue-500" },
      confirmed: { icon: CheckCircle, color: "text-purple-500" },
    };

    const config =
      iconConfig[status as keyof typeof iconConfig] || iconConfig.scheduled;
    const Icon = config.icon;

    return <Icon className={`h-4 w-4 ${config.color}`} />;
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

  const handleViewAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsDialog(true);
  };

  const handleCallClient = () => {
    window.open(`tel:${client.phone}`);
  };

  const handleEmailClient = () => {
    window.open(`mailto:${client.email}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header del Cliente */}
      <Header
        title={`Historial`}
        showBackButton={true}
        backButtonText="pacientes"
        backButtonHref={`/clients`}
        notifications={{
          count: 3,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas del Cliente */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Citas
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    stats.totalAppointments
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Completadas
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    stats.completedAppointments
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Gastado
                  </p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    €stats.totalSpent
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Valoración Media
                  </p>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    stats.averageRating
                  </p>
                </div>
                <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                  <Star className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline de Citas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Historial de Citas
            </CardTitle>
            <CardDescription>
              Cronología completa de todas las citas de {client.fullName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No hay citas registradas
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  Este cliente aún no tiene citas en el historial.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {appointments.map((appointment, index) => (
                  <div key={appointment.id} className="relative">
                    {/* Línea de conexión */}
                    {index < appointments.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200 dark:bg-gray-700" />
                    )}

                    <div className="flex gap-4">
                      {/* Icono del timeline */}
                      <div className="flex-shrink-0 w-12 h-12 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center">
                        {getTimelineIcon(appointment.status)}
                      </div>

                      {/* Contenido de la cita */}
                      <div className="flex-1 min-w-0">
                        <Card
                          className="hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => handleViewAppointment(appointment)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                  {appointment.service.name}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {appointment.appointmentDate.toLocaleString()}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {appointment.startTime} -{" "}
                                    {appointment.endTime}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    {appointment.professional.fullName}
                                  </div>
                                  {appointment.company.address && (
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-4 w-4" />
                                      {appointment.company.address}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-500">
                                  {formatDate(
                                    appointment.appointmentDate.toLocaleString(),
                                  )}
                                </span>
                                {getStatusBadge(appointment.status)}
                              </div>
                            </div>

                            {appointment.notes && (
                              <div className="mb-3">
                                <div className="flex items-start gap-2">
                                  <FileText className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                                    {appointment.notes}
                                  </p>
                                </div>
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  €{appointment.service.price}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal de Detalles */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalles de la Cita</DialogTitle>
              <DialogDescription>
                Información completa de la cita del{" "}
                {selectedAppointment?.appointmentDate.toLocaleString()} con{" "}
                {client.fullName}
              </DialogDescription>
            </DialogHeader>

            {selectedAppointment && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Información de la Cita */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Información de la Cita
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Servicio:</span>
                        <p className="font-medium">
                          {selectedAppointment.service.name}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Duración:</span>
                        <p className="font-medium">
                          {selectedAppointment.service.durationMinutes} min
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Fecha:</span>
                        <p className="font-medium">
                          {selectedAppointment.appointmentDate.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Hora:</span>
                        <p className="font-medium">
                          {selectedAppointment.startTime}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Profesional:</span>
                        <p className="font-medium">
                          {selectedAppointment.professional.fullName}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Ubicación:</span>
                        <p className="font-medium">
                          {selectedAppointment.company.address}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Estado:</span>
                        <div className="mt-1">
                          {getStatusBadge(selectedAppointment.status)}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Precio:</span>
                        <p className="font-medium">
                          €{selectedAppointment.service.price}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Información del Cliente */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Cliente
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={client.avatar || "/placeholder.svg"}
                          alt={client.fullName}
                        />
                        <AvatarFallback>
                          {getInitials(client.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{client.fullName}</p>
                        <p className="text-sm text-gray-500">{client.email}</p>
                        <p className="text-sm text-gray-500">{client.phone}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCallClient}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Llamar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleEmailClient}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Notas y Feedback */}
                {selectedAppointment.notes && (
                  <Card className="sm:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Notas y Comentarios
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedAppointment.notes && (
                        <div>
                          <span className="text-sm text-gray-500 flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4" />
                            Notas médicas:
                          </span>
                          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-sm">
                              {selectedAppointment.notes}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
