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
  upcomingAppointments?: Appointment[];
  appointmentStats?: AppointmentStats;
  user: User | null;
  clinicInfo?: Company;
  errorMessage?: string;
};

export default function DashboardClient({
  upcomingAppointments,
  appointmentStats,
  user,
  clinicInfo,
  errorMessage,
}: Props) {
  // Estado para manejar el dialog
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  // Helpers seguros
  const getInitials = (name?: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";

    try {
      // Manejar diferentes formatos de fecha
      let date: Date;

      // Si es un ISO string con timezone
      if (typeof dateString === "string" && dateString.includes("T")) {
        // Extraer solo la parte de la fecha para evitar cambios de zona horaria
        const datePart = dateString.split("T")[0];
        const [year, month, day] = datePart.split("-").map(Number);
        // Crear fecha en UTC al mediodía para evitar cambios de día
        date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
      } else if (typeof dateString === "string") {
        // Formato YYYY-MM-DD simple
        const [year, month, day] = dateString.split("-").map(Number);
        date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
      } else {
        // Si es un objeto Date
        date = new Date(dateString);
      }

      const today = new Date();
      const todayUTC = new Date(
        Date.UTC(
          today.getUTCFullYear(),
          today.getUTCMonth(),
          today.getUTCDate()
        )
      );

      const tomorrow = new Date(todayUTC);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const appointmentDateUTC = new Date(
        Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
      );

      if (appointmentDateUTC.getTime() === todayUTC.getTime()) {
        return "Hoy";
      } else if (appointmentDateUTC.getTime() === tomorrow.getTime()) {
        return "Mañana";
      } else {
        // Usar formato de fecha en español
        return new Intl.DateTimeFormat("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(appointmentDateUTC);
      }
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return "00:00";
    const timeParts = timeString.split(":");
    return `${timeParts[0] || "00"}:${timeParts[1] || "00"}`;
  };

  const handleViewAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleCloseDialog = () => {
    setSelectedAppointment(null);
  };
  const handleEditAppointment = (_appointment: Appointment) => {
    // redirigir a /appointments/:id/edit
    setSelectedAppointment(null);
  };
  const handleCancelAppointment = (_appointment: Appointment) => {
    setSelectedAppointment(null);
  };
  const handleDeleteAppointment = (_appointment: Appointment) => {
    setSelectedAppointment(null);
  };
  const handleCallClient = (appointment: Appointment) => {
    if (appointment?.client?.phone)
      window.open(`tel:${appointment.client.phone}`);
  };
  const handleEmailClient = (appointment: Appointment) => {
    if (appointment?.client?.email)
      window.open(`mailto:${appointment.client.email}`);
  };

  // Función para determinar si no hay actividad
  const hasNoActivity = () => {
    if (!appointmentStats) return true;
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
              Gestionar Pacientes
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );

  // Componente para mensaje motivacional cuando hay pocas citas
  const LowActivityMessage = () => {
    if (
      appointmentStats &&
      appointmentStats.todayCount > 0 &&
      appointmentStats.todayCount <= 2
    ) {
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

  // No bloquea toda la página, solo muestra errores en stats y tabla
  const showStatsError = !!errorMessage || !appointmentStats;
  const showAppointmentsError =
    !!errorMessage ||
    !upcomingAppointments ||
    !Array.isArray(upcomingAppointments);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header title="Dashboard" subtitle="Panel de Control" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            ¡Buen día, {user?.fullName?.split(" ")[0] || ""}! 👋
          </h2>
          {!showStatsError &&
            (hasNoActivity() ? (
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Hoy parece ser un día tranquilo. ¿Qué tal si aprovechas para
                organizarte o descansar?
              </p>
            ) : (
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Tienes {appointmentStats?.todayCount}{" "}
                {appointmentStats?.todayCount === 1
                  ? "cita programada"
                  : "citas programadas"}{" "}
                para hoy. Aquí tienes un resumen de tu jornada.
              </p>
            ))}
        </div>
        {/* Mensaje de baja actividad */}
        {!showStatsError && <LowActivityMessage />}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          {showStatsError ? (
            <div className="col-span-2 lg:col-span-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <CalendarX className="mx-auto mb-4 h-12 w-12 text-red-500" />
                  <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                    Error al cargar las estadísticas
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {errorMessage ??
                      "No se pudieron cargar las estadísticas de citas."}
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <>
              <Card className="hover:shadow-lg transition-shadow">
                <Link href="/appointments">
                  <CardContent className="p-3 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                          Citas Hoy
                        </p>
                        <p className="text-lg sm:text-3xl font-bold text-gray-900 dark:text-white">
                          {appointmentStats?.todayCount ?? 0}
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
                          {appointmentStats?.confirmedCount ?? 0}
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
                          {appointmentStats?.pendingCount ?? 0}
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
                          {appointmentStats?.cancelledCount ?? 0}
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
            </>
          )}
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
                    {!showAppointmentsError &&
                    upcomingAppointments &&
                    upcomingAppointments.length > 0
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
                {showAppointmentsError ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <CalendarX className="h-12 w-12 text-red-500 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Error al cargar las próximas citas
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {errorMessage ??
                        "No se pudo cargar la lista de próximas citas."}
                    </p>
                  </div>
                ) : upcomingAppointments.length === 0 ? (
                  <EmptyAppointmentsState />
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 p-3 sm:p-4 rounded-lg border bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors cursor-pointer"
                        onClick={() => handleViewAppointment(appointment)}
                      >
                        {/* Avatar and main info */}
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                            <AvatarImage
                              src={
                                appointment?.client?.avatar || "/avatars/1.svg"
                              }
                              alt={appointment?.client?.fullName || ""}
                            />
                            <AvatarFallback className="text-xs sm:text-sm">
                              {getInitials(appointment?.client?.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate pr-2">
                                {appointment?.client?.fullName || ""}
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
                            {/* Mostrar todos los servicios (services[]) */}
                            <ul className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                              {Array.isArray(appointment.services) &&
                              appointment.services.length > 0 ? (
                                appointment.services.map(
                                  (service: any, idx: number) => (
                                    <li key={service.id || idx}>
                                      {service.name || "Servicio"}
                                      {service.durationMinutes
                                        ? ` (${service.durationMinutes} min)`
                                        : ""}
                                    </li>
                                  )
                                )
                              ) : (
                                <li>No hay servicios</li>
                              )}
                            </ul>
                            <div className="flex items-center space-x-3 sm:space-x-4 mt-1">
                              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatTime(appointment?.startTime)}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(
                                  typeof appointment?.appointmentDate ===
                                    "string"
                                    ? appointment.appointmentDate
                                    : appointment?.appointmentDate?.toString?.()
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
                              if (appointment?.client?.phone) {
                                window.open(`tel:${appointment.client.phone}`);
                              }
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
                              if (
                                appointment?.client?.phone &&
                                appointment?.professional?.fullName
                              ) {
                                openWhatsApp(
                                  appointment.client.phone,
                                  `Hola, le saluda la clínica del Dr. ${encodeURIComponent(
                                    appointment.professional.fullName
                                  )}`
                                );
                              }
                            }}
                          >
                            <WhatsappIcon
                              className="text-green-500 dark:bg-gray-900"
                              width={16}
                              height={16}
                            />
                            <span className="sm:hidden">WhatsApp</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="mt-4 sm:mt-6 text-center">
                      <Link href="/appointments">
                        <Button variant="outline" className="w-full text-sm">
                          Ver Todas las Citas
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
                {/* Botón "Ver Todas las Citas" SIEMPRE VISIBLE */}
                {upcomingAppointments &&
                  upcomingAppointments.length === 0 &&
                  !showAppointmentsError && (
                    <div className="mt-6 text-center">
                      <Link href="/appointments">
                        <Button variant="outline" className="w-full text-sm">
                          Ver Todas las Citas
                        </Button>
                      </Link>
                    </div>
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
                    Gestionar Pacientes
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
                {/* Aquí el botón de Bot cuando exista la funcionalidad */}
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
                        {clinicInfo?.name || ""}
                      </p>
                    </div>
                  </div>
                  {/* Dirección completa */}
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Dirección</p>
                      <p className="text-xs text-gray-500 break-words">
                        {clinicInfo?.address || ""}
                        {clinicInfo?.city ? `, ${clinicInfo.city}` : ""}
                      </p>
                    </div>
                  </div>
                  {/* pais y ciudad */}
                  <div className="flex items-start space-x-3">
                    <Globe className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Ubicación</p>
                      <p className="text-xs text-gray-500 break-words">
                        {clinicInfo?.country || ""}{" "}
                        {clinicInfo?.city ? `, ${clinicInfo.city}` : ""}
                      </p>
                    </div>
                  </div>
                  {/* descripcion */}
                  <div className="flex items-start space-x-3">
                    <Phone className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium"> Teléfono </p>
                      <p className="text-xs text-gray-500 break-words">
                        {clinicInfo?.phones?.[0].phone || "N/A"}
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
        appointmentId={selectedAppointment?.id}
        isOpen={selectedAppointment !== null}
        onClose={handleCloseDialog}
        onCancel={handleCancelAppointment}
        onDelete={handleDeleteAppointment}
        onCall={handleCallClient}
        onEmail={handleEmailClient}
      />
    </div>
  );
}
