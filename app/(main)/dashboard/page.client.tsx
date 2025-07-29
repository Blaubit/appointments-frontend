"use client";

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
  Mail,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";
import type { Appointment, AppointmentStats } from "@/types";

type Stat = {
  title: string;
  value: string;
  icon: string;
  color: string;
  ref: string;
};

type User = {
  name: string;
  email: string;
  role: string;
  avatar: string;
  initials: string;
};

type ClinicInfo = {
  address: string;
  phone: string;
  schedule: string;
};

type Props = {
  upcomingAppointments: Appointment[];
  appointmentStats: AppointmentStats;
  stats: Stat[];
  user: User;
  clinicInfo: ClinicInfo;
  userType: "professional" | "client";
  notifications: {
    count: number;
  };
};

export default function DashboardClient({
  upcomingAppointments,
  appointmentStats,
  stats,
  user,
  clinicInfo,
  notifications,
}: Props) {
  const getIconComponent = (iconName: string) => {
    const iconMap = {
      Calendar,
      Users,
      TrendingUp,
      Clock,
    };
    return iconMap[iconName as keyof typeof iconMap] || Clock;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-3 w-3" />;
      case "pending":
        return <AlertCircle className="h-3 w-3" />;
      case "cancelled":
        return <XCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
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
      default:
        return "Desconocido";
    }
  };

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
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  };

  const formatTime = (timeString: string) => {
    // timeString viene como "14:00:00" o "14:00"
    if (!timeString) return "00:00";
    
    // Tomar solo las primeras dos partes (horas y minutos)
    const timeParts = timeString.split(':');
    return `${timeParts[0]}:${timeParts[1]}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header
        title="Dashboard"
        subtitle="Panel de Control"
        notifications={notifications}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            ¡Buen día, {user.name.split(" ")[1]}! 👋
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Tienes{" "}
            {appointmentStats.total}{" "}
            {appointmentStats.total === 1 ? 'cita programada' : 'citas programadas'} para hoy. Aquí tienes un resumen de tu jornada.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          {stats.map((stat, index) => {
            const IconComponent = getIconComponent(stat.icon);
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <Link href={stat.ref}>
                  <CardContent className="p-3 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                          {stat.title}
                        </p>
                        <p className="text-lg sm:text-3xl font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </p>
                      </div>
                      <div
                        className={`p-2 sm:p-3 rounded-full bg-gray-100 dark:bg-gray-800 ${stat.color} flex-shrink-0`}
                      >
                        <IconComponent className="h-4 w-4 sm:h-6 sm:w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            );
          })}
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
                    Tus citas programadas
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
                <div className="space-y-3 sm:space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 rounded-lg border bg-gray-50 dark:bg-gray-800/50"
                    >
                      {/* Avatar and main info */}
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                          <AvatarImage
                            src={appointment.client.avatar || "/Avatar1.png"}
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
                              {formatDate(appointment.appointmentDate.toLocaleString())}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex space-x-2 sm:flex-shrink-0">
                        <Link href={`tel:${appointment.client.phone}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="ml-1 sm:hidden">Llamar</span>
                          </Button>
                        </Link>
                        <Link href={`mailto:${appointment.client.email}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="ml-1 sm:hidden">Email</span>
                          </Button>
                        </Link>
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
                <Link href="/bot">
                  <Button
                    className="w-full justify-start text-sm my-1"
                    variant="outline"
                  >
                    <Bot className="h-4 w-4 mr-2" />
                    Bot
                  </Button>
                </Link>
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
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Dirección</p>
                      <p className="text-xs text-gray-500 break-words">
                        {clinicInfo.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Teléfono</p>
                      <p className="text-xs text-gray-500 break-words">
                        {clinicInfo.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Horario</p>
                      <p className="text-xs text-gray-500 break-words">
                        {clinicInfo.schedule}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}