"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

type AppointmentStatus = "confirmed" | "pending" | "cancelled";

type Client = {
  Name: string;
  phone: string;
  mail: string;
};

type Appointment = {
  id: number;
  client: Client;
  service: string;
  time: string;
  date: string;
  status: AppointmentStatus;
  avatar: string;
};

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
  stats,
  user,
  clinicInfo,
  userType,
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

  const getStatusColor = (status: AppointmentStatus) => {
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

  const getStatusIcon = (status: AppointmentStatus) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <AlertCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: AppointmentStatus) => {
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header
        title="Dashboard"
        subtitle="Panel de Control"
        user={user}
        notifications={notifications}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            ¡Buen día, {user.name.split(' ')[1]}! 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Tienes {upcomingAppointments.filter(apt => apt.date === "Hoy").length} citas programadas para hoy. 
            Aquí tienes un resumen de tu jornada.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = getIconComponent(stat.icon);
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <Link href={stat.ref}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </p>
                      </div>
                      <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-800 ${stat.color}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Appointments */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Próximas Citas</CardTitle>
                  <CardDescription>Tus citas programadas</CardDescription>
                </div>
                <Link href="/appointments/new">
                  <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Cita
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center space-x-4 p-4 rounded-lg border bg-gray-50 dark:bg-gray-800/50"
                    >
                      <Avatar>
                        <AvatarImage src={appointment.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {appointment.client.Name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {appointment.client.Name}
                          </p>
                          <Badge className={getStatusColor(appointment.status)}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(appointment.status)}
                              <span className="capitalize">
                                {getStatusText(appointment.status)}
                              </span>
                            </div>
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {appointment.service}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {appointment.time}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {appointment.date}
                          </span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Link href={`tel:${appointment.client.phone}`}>
                          <Button variant="outline" size="sm">
                            <Phone className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`mailto:${appointment.client.mail}`}>
                          <Button variant="outline" size="sm">
                            <Mail className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <Link href="/appointments">
                    <Button variant="outline" className="w-full">
                      Ver Todas las Citas
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Info */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/calendar">
                  <Button className="w-full justify-start my-1" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Ver Calendario
                  </Button>
                </Link>
                <Link href="/clients">
                  <Button className="w-full justify-start my-1" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Gestionar Clientes
                  </Button>
                </Link>
                <Link href="/services">
                  <Button className="w-full justify-start my-1" variant="outline">
                    <Stethoscope className="h-4 w-4 mr-2" />
                    Servicios
                  </Button>
                </Link>
                <Link href="/reports">
                  <Button className="w-full justify-start my-1" variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Reportes
                  </Button>
                </Link>
                <Link href="/bot">
                  <Button className="w-full justify-start my-1" variant="outline">
                    <Bot className="h-4 w-4 mr-2" />
                    Bot
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Profile Info */}
            <Card>
              <Link href="/settings">
                <CardHeader>
                  <CardTitle>Información del Consultorio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Dirección</p>
                      <p className="text-xs text-gray-500">{clinicInfo.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Teléfono</p>
                      <p className="text-xs text-gray-500">{clinicInfo.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Horario</p>
                      <p className="text-xs text-gray-500">{clinicInfo.schedule}</p>
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