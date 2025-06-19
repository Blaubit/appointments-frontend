"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
} from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"

export default function DashboardPage() {
  const [userType] = useState<"professional" | "client">("professional") // This would come from auth context

  // Mock data - in real app this would come from API
  const upcomingAppointments = [
    {
      id: 1,
      clientName: "María González",
      service: "Consulta General",
      time: "09:00",
      date: "Hoy",
      status: "confirmed",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      clientName: "Carlos Rodríguez",
      service: "Limpieza Dental",
      time: "10:30",
      date: "Hoy",
      status: "pending",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      clientName: "Ana Martínez",
      service: "Corte y Peinado",
      time: "14:00",
      date: "Mañana",
      status: "confirmed",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const stats = [
    { title: "Citas Hoy", value: "8", icon: Calendar, color: "text-blue-600" },
    { title: "Clientes Atendidos", value: "156", icon: Users, color: "text-green-600" },
    { title: "Ingresos del Mes", value: "$12,450", icon: TrendingUp, color: "text-purple-600" },
    { title: "Tiempo Promedio", value: "45min", icon: Clock, color: "text-orange-600" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <AlertCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header
        title="Dashboard"
        subtitle="Panel de Control"
        user={{
          name: "Dr. Roberto Silva",
          email: "roberto.silva@email.com",
          role: "Médico General",
          avatar: "/placeholder.svg?height=32&width=32",
          initials: "DR",
        }}
        notifications={{
          count: 3,
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">¡Buen día, Dr. Silva! 👋</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Tienes 8 citas programadas para hoy. Aquí tienes un resumen de tu jornada.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-800 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Appointments */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Próximas Citas</CardTitle>
                  <CardDescription>Tus citas programadas para hoy y mañana</CardDescription>
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
                          {appointment.clientName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {appointment.clientName}
                          </p>
                          <Badge className={getStatusColor(appointment.status)}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(appointment.status)}
                              <span className="capitalize">
                                {appointment.status === "confirmed" ? "Confirmada" : "Pendiente"}
                              </span>
                            </div>
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{appointment.service}</p>
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
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <Link href="appointments">
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
                <Link href = "/calendar">
                  <Button className="w-full justify-start my-1" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Ver Calendario
                  </Button>
                </Link>
                <Link href="">
                  <Button className="w-full justify-start my-1" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Gestionar Clientes
                  </Button>
                </Link>
                <Link href="services">
                  <Button className="w-full justify-start my-1" variant="outline">
                    <Stethoscope className="h-4 w-4 mr-2" />
                    Servicios
                  </Button>
                </Link>
                <Link href="/reports">
                  <Button className="w-full justify-start my-1" variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2"/>
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
              <CardHeader>
                <CardTitle>Información del Consultorio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Dirección</p>
                    <p className="text-xs text-gray-500">Av. Principal 123, Centro</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Teléfono</p>
                    <p className="text-xs text-gray-500">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Horario</p>
                    <p className="text-xs text-gray-500">Lun-Vie: 8:00-18:00</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
