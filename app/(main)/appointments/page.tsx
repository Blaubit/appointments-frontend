"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Calendar,
  Clock,
  Search,
  Plus,
  CheckCircle,
  AlertCircle,
  XCircle,
  Phone,
  Mail,
  Edit,
  Trash2,
  MoreHorizontal,
  Download,
  CalendarDays,
  List,
  Eye,
} from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function AppointmentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState("list")

  // Mock data - in real app this would come from API
  const allAppointments = [
    {
      id: 1,
      clientName: "María González",
      clientEmail: "maria@email.com",
      clientPhone: "+1 (555) 123-4567",
      service: "Consulta General",
      time: "09:00",
      date: "2024-01-15",
      dateFormatted: "Hoy",
      status: "confirmed",
      duration: "30 min",
      notes: "Primera consulta, revisar historial médico",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      clientName: "Carlos Rodríguez",
      clientEmail: "carlos@email.com",
      clientPhone: "+1 (555) 234-5678",
      service: "Limpieza Dental",
      time: "10:30",
      date: "2024-01-15",
      dateFormatted: "Hoy",
      status: "pending",
      duration: "45 min",
      notes: "Paciente con sensibilidad dental",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      clientName: "Ana Martínez",
      clientEmail: "ana@email.com",
      clientPhone: "+1 (555) 345-6789",
      service: "Corte y Peinado",
      time: "14:00",
      date: "2024-01-16",
      dateFormatted: "Mañana",
      status: "confirmed",
      duration: "60 min",
      notes: "Corte bob y mechas",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      clientName: "Luis Fernández",
      clientEmail: "luis@email.com",
      clientPhone: "+1 (555) 456-7890",
      service: "Consulta Especializada",
      time: "11:00",
      date: "2024-01-16",
      dateFormatted: "Mañana",
      status: "cancelled",
      duration: "45 min",
      notes: "Cancelado por el paciente",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 5,
      clientName: "Carmen López",
      clientEmail: "carmen@email.com",
      clientPhone: "+1 (555) 567-8901",
      service: "Terapia Física",
      time: "15:30",
      date: "2024-01-17",
      dateFormatted: "Pasado mañana",
      status: "confirmed",
      duration: "90 min",
      notes: "Sesión de rehabilitación",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 6,
      clientName: "Roberto Silva",
      clientEmail: "roberto@email.com",
      clientPhone: "+1 (555) 678-9012",
      service: "Revisión Rutinaria",
      time: "08:30",
      date: "2024-01-18",
      dateFormatted: "Jueves",
      status: "pending",
      duration: "30 min",
      notes: "Chequeo anual",
      avatar: "/placeholder.svg?height=40&width=40",
    },
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

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmada"
      case "pending":
        return "Pendiente"
      case "cancelled":
        return "Cancelada"
      default:
        return "Desconocido"
    }
  }

  // Filter appointments based on search and filters
  const filteredAppointments = allAppointments.filter((appointment) => {
    const matchesSearch =
      appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.service.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter
    const matchesDate =
      dateFilter === "all" ||
      (dateFilter === "today" && appointment.dateFormatted === "Hoy") ||
      (dateFilter === "tomorrow" && appointment.dateFormatted === "Mañana") ||
      (dateFilter === "week" && ["Hoy", "Mañana", "Pasado mañana", "Jueves"].includes(appointment.dateFormatted))

    return matchesSearch && matchesStatus && matchesDate
  })

  const stats = [
    { title: "Total Citas", value: allAppointments.length.toString(), color: "text-blue-600" },
    {
      title: "Confirmadas",
      value: allAppointments.filter((a) => a.status === "confirmed").length.toString(),
      color: "text-green-600",
    },
    {
      title: "Pendientes",
      value: allAppointments.filter((a) => a.status === "pending").length.toString(),
      color: "text-yellow-600",
    },
    {
      title: "Canceladas",
      value: allAppointments.filter((a) => a.status === "cancelled").length.toString(),
      color: "text-red-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header
        title="Todas las Citas"
        showBackButton={true}
        backButtonText="Dashboard"
        backButtonHref="/dashboard"
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters and Actions */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <CardTitle>Gestión de Citas</CardTitle>
                <CardDescription>Administra todas tus citas programadas</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <Link href="/appointments/new">
                    <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Cita
                    </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="flex-1">
                <Label htmlFor="search" className="sr-only">
                  Buscar
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Buscar por cliente o servicio..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="w-full md:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="confirmed">Confirmadas</SelectItem>
                    <SelectItem value="pending">Pendientes</SelectItem>
                    <SelectItem value="cancelled">Canceladas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Filter */}
              <div className="w-full md:w-48">
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Fecha" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las fechas</SelectItem>
                    <SelectItem value="today">Hoy</SelectItem>
                    <SelectItem value="tomorrow">Mañana</SelectItem>
                    <SelectItem value="week">Esta semana</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-r-none"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "calendar" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("calendar")}
                  className="rounded-l-none"
                >
                  <CalendarDays className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Mostrando {filteredAppointments.length} de {allAppointments.length} citas
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No se encontraron citas</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No hay citas que coincidan con los filtros seleccionados.
                </p>
                <Link href="/appointments/new">
                    <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Nueva Cita
                    </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            filteredAppointments.map((appointment) => (
              <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={appointment.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {appointment.clientName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                          {appointment.clientName}
                        </h3>
                        <Badge className={getStatusColor(appointment.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(appointment.status)}
                            <span>{getStatusText(appointment.status)}</span>
                          </div>
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {appointment.dateFormatted} - {appointment.time}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            {appointment.service} ({appointment.duration})
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4" />
                          <span>{appointment.clientPhone}</span>
                        </div>
                      </div>

                      {appointment.notes && (
                        <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm text-gray-600 dark:text-gray-400">
                          <strong>Notas:</strong> {appointment.notes}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar Cita
                          </DropdownMenuItem>
                          {appointment.status === "pending" && (
                            <DropdownMenuItem>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Confirmar
                            </DropdownMenuItem>
                          )}
                          {appointment.status !== "cancelled" && (
                            <DropdownMenuItem className="text-red-600">
                              <XCircle className="h-4 w-4 mr-2" />
                              Cancelar
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredAppointments.length > 0 && (
          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">Página 1 de 1</p>
            <div className="flex space-x-2">
              <Button variant="outline" disabled>
                Anterior
              </Button>
              <Button variant="outline" disabled>
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
