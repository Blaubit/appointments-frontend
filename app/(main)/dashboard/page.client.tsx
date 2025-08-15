"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bot,
  Calendar,
  Clock,
  Users,
  TrendingUp,
  Plus,
  Stethoscope,
  MapPin,
  Phone,
  CalendarCheck,
  UserRoundCheck,
  BookX,
  OctagonPause,
  Eye,
  CalendarX,
  Smile,
  Coffee,
  Sparkles,
  FileText,
  Globe,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";
import { AppointmentDetailsDialog } from "@/components/appointment-details-dialog";
import type { Appointment, AppointmentStats, User, Company } from "@/types";
import {
  getStatusColor,
  getStatusIcon,
  getStatusText,
} from "@/utils/functions/appointmentStatus";
import WhatsappIcon from "@/components/icons/whatsapp-icon";
import { openWhatsApp } from "@/utils/functions/openWhatsapp";

type Props = {
  upcomingAppointments: Appointment[];
  appointmentStats: AppointmentStats;
  user: User;
  clinicInfo: Company;
};

export default function DashboardClient({
  upcomingAppointments,
  appointmentStats,
  user,
  clinicInfo,
}: Props) {
  // Estado para manejar el dialog
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const getInitials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Hoy";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Mañana";
    } else {
      // Formato dd/mm/aaaa
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
  };

  const formatTime = (timeString: string) => {
    // timeString viene como "14:00:00" o "14:00"
    if (!timeString) return "00:00";

    // Tomar solo las primeras dos partes (horas y minutos)
    const timeParts = timeString.split(":");
    return `${timeParts[0]}:${timeParts[1]}`;
  };

  // Funciones para manejar las acciones del dialog
  const handleViewAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleCloseDialog = () => {
    setSelectedAppointment(null);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    console.log("Edit appointment:", appointment);
    // TODO: Navegar a la página de edición
    // window.location.href = `/appointments/${appointment.id}/edit`;
  };

  const handleConfirmAppointment = (appointment: Appointment) => {
    console.log("Confirm appointment:", appointment);
    // TODO: Llamar API para confirmar cita
    // await confirmAppointment(appointment.id);
    setSelectedAppointment(null);
  };

  const handleCancelAppointment = (appointment: Appointment) => {
    console.log("Cancel appointment:", appointment);
    // TODO: Llamar API para cancelar cita
    // await cancelAppointment(appointment.id);
    setSelectedAppointment(null);
  };

  const handleDeleteAppointment = (appointment: Appointment) => {
    console.log("Delete appointment:", appointment);
    // TODO: Mostrar confirmación y llamar API
    // if (confirm("¿Estás seguro?")) await deleteAppointment(appointment.id);
    setSelectedAppointment(null);
  };

  const handleCallClient = (appointment: Appointment) => {
    console.log("Call client:", appointment.client.phone);
    window.open(`tel:${appointment.client.phone}`);
  };

  const handleEmailClient = (appointment: Appointment) => {
    console.log("Email client:", appointment.client.email);
    window.open(`mailto:${appointment.client.email}`);
  };

  // Función para determinar si no hay actividad
  const hasNoActivity = () => {
    return (
      appointmentStats.todayCount === 0 &&
      appointmentStats.confirmedCount === 0 &&
      appointmentStats.pendingCount === 0
    );
  };

  // Componente para estado vacío de citas
  const EmptyAppointmentsState = () => (
    <div className="text-center py-12">
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full">
            <CalendarX className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="absolute -top-1 -right-1">
            <Sparkles className="h-6 w-6 text-yellow-500" />
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
        ¡No hay citas programadas!
      </h3>

      {hasNoActivity() ? (
        <div className="space-y-3 mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Parece que tienes un día libre. Es perfecto para:
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <Coffee className="h-4 w-4" />
              <span>Tomar un descanso</span>
            </div>
            <div className="flex items-center space-x-2">
              <Smile className="h-4 w-4" />
              <span>Organizar el consultorio</span>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Todas tus próximas citas están más adelante en la semana.
        </p>
      )}

      <div className="space-y-3">
        <Link href="/appointments/new">
          <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
            <Plus className="h-4 w-4 mr-2" />
            Programar Nueva Cita
          </Button>
        </Link>

        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Link href="/calendar">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Ver Calendario
            </Button>
          </Link>
          <Link href="/clients">
            <Button variant="outline" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Gestionar Clientes
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );

  // Componente para mostrar mensaje motivacional cuando hay pocas citas
  const LowActivityMessage = () => {
    if (appointmentStats.todayCount > 0 && appointmentStats.todayCount <= 2) {
      return (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-full">
              <Smile className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                Día Tranquilo Hoy
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Solo tienes {appointmentStats.todayCount}{" "}
                {appointmentStats.todayCount === 1 ? "cita" : "citas"} hoy.
                ¡Perfecto para enfocarte en cada paciente!
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header title="Dashboard" subtitle="Panel de Control" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            ¡Buen día, {user.fullName.split(" ")[0]}! 👋
          </h2>

          {hasNoActivity() ? (
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Hoy parece ser un día tranquilo. ¿Qué tal si aprovechas para
              organizarte o descansar?
            </p>
          ) : (
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Tienes {appointmentStats.todayCount}{" "}
              {appointmentStats.todayCount === 1
                ? "cita programada"
                : "citas programadas"}{" "}
              para hoy. Aquí tienes un resumen de tu jornada.
            </p>
          )}
        </div>

        {/* Mensaje de baja actividad */}
        <LowActivityMessage />

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <Link href="/appointments">
              <CardContent className="p-3 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                      Citas Hoy
                    </p>
                    <p className="text-lg sm:text-3xl font-bold text-gray-900 dark:text-white">
                      {appointmentStats.todayCount}
                    </p>
                  </div>
                  <div
                    className={`p-2 sm:p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-blue-600 flex-shrink-0`}
                  >
                    <CalendarCheck className="h-4 w-4 sm:h-6 sm:w-6" />
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <Link href="/appointments">
              <CardContent className="p-3 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                      Confirmadas
                    </p>
                    <p className="text-lg sm:text-3xl font-bold text-gray-900 dark:text-white">
                      {appointmentStats.confirmedCount}
                    </p>
                  </div>
                  <div
                    className={`p-2 sm:p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-green-600 flex-shrink-0`}
                  >
                    <UserRoundCheck className="h-4 w-4 sm:h-6 sm:w-6" />
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <Link href="/appointments">
              <CardContent className="p-3 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                      Pendientes
                    </p>
                    <p className="text-lg sm:text-3xl font-bold text-gray-900 dark:text-white">
                      {appointmentStats.pendingCount}
                    </p>
                  </div>
                  <div
                    className={`p-2 sm:p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-yellow-600 flex-shrink-0`}
                  >
                    <OctagonPause className="h-4 w-4 sm:h-6 sm:w-6" />
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <Link href="/appointments">
              <CardContent className="p-3 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                      Canceladas
                    </p>
                    <p className="text-lg sm:text-3xl font-bold text-gray-900 dark:text-white">
                      {appointmentStats.cancelledCount}
                    </p>
                  </div>
                  <div
                    className={`p-2 sm:p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-red-600 flex-shrink-0`}
                  >
                    <BookX className="h-4 w-4 sm:h-6 sm:w-6" />
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Upcoming Appointments */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                <div>
                  <CardTitle className="text-lg sm:text-xl">
                    Próximas Citas
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {upcomingAppointments.length > 0
                      ? "Tus citas programadas"
                      : "No hay citas programadas"}
                  </CardDescription>
                </div>
                <Link href="/appointments/new">
                  <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 w-full sm:w-auto text-sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Cita
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length === 0 ? (
                  <EmptyAppointmentsState />
                ) : (
                  <>
                    <div className="space-y-3 sm:space-y-4">
                      {upcomingAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 rounded-lg border bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors cursor-pointer"
                          onClick={() => handleViewAppointment(appointment)}
                        >
                          {/* Avatar and main info */}
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                              <AvatarImage
                                src={
                                  appointment.client.avatar || "/Avatar1.png"
                                }
                                alt={appointment.client.fullName}
                              />
                              <AvatarFallback className="text-xs sm:text-sm">
                                {getInitials(appointment.client.fullName)}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-1">
                                <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate pr-2">
                                  {appointment.client.fullName}
                                </p>
                                <Badge
                                  className={`${getStatusColor(appointment.status)} flex-shrink-0 text-xs`}
                                >
                                  <div className="flex items-center space-x-1">
                                    {getStatusIcon(appointment.status)}
                                    <span className="capitalize hidden sm:inline">
                                      {getStatusText(appointment.status)}
                                    </span>
                                  </div>
                                </Badge>
                              </div>
                              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                                {appointment.service.name}
                              </p>
                              <div className="flex items-center space-x-3 sm:space-x-4 mt-1">
                                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {formatTime(appointment.startTime)}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {formatDate(
                                    appointment.appointmentDate.toLocaleString(),
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex space-x-2 sm:flex-shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewAppointment(appointment);
                              }}
                            >
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="ml-1 sm:hidden">Ver</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`tel:${appointment.client.phone}`);
                              }}
                            >
                              <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="ml-1 sm:hidden">Llamar</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                openWhatsApp(
                                  appointment.client.phone,
                                  `Hola, le saluda la clínica del Dr. ${encodeURIComponent(
                                    appointment.professional.fullName,
                                  )}`,
                                );
                              }}
                            >
                              <WhatsappIcon
                                className="text-green-500 dark:bg-gray-900"
                                width={16}
                                height={16}
                              />
                              <span className="ml-1 sm:hidden">WhatsApp</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 sm:mt-6 text-center">
                      <Link href="/appointments">
                        <Button variant="outline" className="w-full text-sm">
                          Ver Todas las Citas
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Info */}
          <div className="space-y-4 sm:space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Acciones Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                <Link href="/calendar">
                  <Button
                    className="w-full justify-start text-sm my-1"
                    variant="outline"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Ver Calendario
                  </Button>
                </Link>
                <Link href="/clients">
                  <Button
                    className="w-full justify-start text-sm my-1"
                    variant="outline"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Gestionar Clientes
                  </Button>
                </Link>
                <Link href="/services">
                  <Button
                    className="w-full justify-start text-sm my-1"
                    variant="outline"
                  >
                    <Stethoscope className="h-4 w-4 mr-2" />
                    Servicios
                  </Button>
                </Link>
                <Link href="/reports">
                  <Button
                    className="w-full justify-start text-sm my-1"
                    variant="outline"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Reportes
                  </Button>
                </Link>
                {/*AQUI DEBERIA IR UN BOTON DE BOT CUANDO EXISTA LA FUNCIONALIDAD */}
              </CardContent>
            </Card>

            {/* Profile Info */}
            <Card>
              <Link href="/settings?tab=business">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl my-2">
                    Información del Consultorio
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  {/* Nombre del consultorio */}
                  <div className="flex items-start space-x-3">
                    <Building2 className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Nombre</p>
                      <p className="text-xs text-gray-500 break-words">
                        {clinicInfo.name}
                      </p>
                    </div>
                  </div>

                  {/* Dirección completa */}
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Dirección</p>
                      <p className="text-xs text-gray-500 break-words">
                        {clinicInfo.address}, {clinicInfo.city}
                      </p>
                    </div>
                  </div>

                  {/* Ciudad y Código postal */}
                  <div className="flex items-start space-x-3">
                    <Globe className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Telefono</p>
                      <p className="text-xs text-gray-500 break-words">
                        {clinicInfo.postal_code}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialog de detalles de la cita */}
      <AppointmentDetailsDialog
        appointment={selectedAppointment}
        isOpen={selectedAppointment !== null}
        onClose={handleCloseDialog}
        onEdit={handleEditAppointment}
        onConfirm={handleConfirmAppointment}
        onCancel={handleCancelAppointment}
        onDelete={handleDeleteAppointment}
        onCall={handleCallClient}
        onEmail={handleEmailClient}
      />
    </div>
  );
}
