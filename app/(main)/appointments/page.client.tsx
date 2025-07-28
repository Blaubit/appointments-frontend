"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Calendar,
  Search,
  Plus,
  CheckCircle,
  AlertCircle,
  XCircle,
  Phone,
  Mail,
  Edit,
  Trash2,
  Download,
  Eye,
  MoreHorizontal,
  Grid3X3,
  List,
} from "lucide-react"
import { Header } from "@/components/header"
import type { Appointment, AppointmentStats, Pagination } from "@/types"

type Props = {
  appointments: Appointment[]
  stats: AppointmentStats
  pagination: Pagination
}

export default function PageClient({ appointments, stats, pagination }: Props) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards")

  // Client-side filtering for immediate UI feedback
  const clientFilteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.client.fullName ||
      appointment.service
    return matchesSearch
  })

  // Handle search with URL update for server-side filtering
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    const url = new URL(window.location.href)
    const params = new URLSearchParams(url.search)

    if (value) {
      params.set("search", value)
    } else {
      params.delete("search")
    }

    router.push(`${url.pathname}?${params.toString()}`)
  }

  // Handle status filter with URL update
  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)
    const url = new URL(window.location.href)
    const params = new URLSearchParams(url.search)

    if (value !== "all") {
      params.set("status", value)
    } else {
      params.delete("status")
    }

    router.push(`${url.pathname}?${params.toString()}`)
  }

  // Handle date filter with URL update
  const handleDateFilter = (value: string) => {
    setDateFilter(value)
    const url = new URL(window.location.href)
    const params = new URLSearchParams(url.search)

    if (value !== "all") {
      params.set("date", value)
    } else {
      params.delete("date")
    }

    router.push(`${url.pathname}?${params.toString()}`)
  }

  // Action handlers - ready for backend integration
  const handleEditAppointment = (appointment: Appointment) => {
    console.log("Edit appointment:", appointment)
    // TODO: Open edit dialog or navigate to edit page
    // router.push(`/appointments/${appointment.id}/edit`)
  }

  const handleConfirmAppointment = (appointment: Appointment) => {
    console.log("Confirm appointment:", appointment)
    // TODO: Call API to confirm appointment
    // await confirmAppointment(appointment.id)
  }

  const handleCancelAppointment = (appointment: Appointment) => {
    console.log("Cancel appointment:", appointment)
    // TODO: Call API to cancel appointment
    // await cancelAppointment(appointment.id)
  }

  const handleDeleteAppointment = (appointment: Appointment) => {
    console.log("Delete appointment:", appointment)
    // TODO: Show confirmation dialog and call API
    // if (confirm("¿Estás seguro?")) await deleteAppointment(appointment.id)
  }

  const handleCallClient = (appointment: Appointment) => {
    console.log("Call client:", appointment.client.phone)
    // TODO: Integrate with phone system or open tel: link
    // window.open(`tel:${appointment.client.phone}`)
  }

  const handleEmailClient = (appointment: Appointment) => {
    console.log("Email client:", appointment.client.email)
    // TODO: Open email client or send email via API
    // window.open(`mailto:${appointment.client.email}`)
  }

  const handleViewAppointment = (appointment: Appointment) => {
    console.log("View appointment:", appointment)
    // TODO: Navigate to appointment details
    // router.push(`/appointments/${appointment.id}`)
  }

  const handleCreateAppointment = () => {
    console.log("Create new appointment")
    // TODO: Navigate to create appointment page
    // router.push("/appointments/new")
  }

  const handleExportAppointments = () => {
    console.log("Export appointments")
    // TODO: Generate and download CSV/PDF export
    // await exportAppointments(appointments)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: {
        color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        icon: <CheckCircle className="h-4 w-4" />,
        label: "Confirmada",
      },
      pending: {
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        icon: <AlertCircle className="h-4 w-4" />,
        label: "Pendiente",
      },
      cancelled: {
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        icon: <XCircle className="h-4 w-4" />,
        label: "Cancelada",
      },
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    if (!config) {
      return (
        <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">
          <div className="flex items-center space-x-1">
            <AlertCircle className="h-4 w-4" />
            <span>Desconocido</span>
          </div>
        </Badge>
      )
    }
    return (
      <Badge className={config.color}>
        <div className="flex items-center space-x-1">
          {config.icon}
          <span>{config.label}</span>
        </div>
      </Badge>
    )
  }

  const getInitials = (name: string) => {
    if (!name) return "";

    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const statsCards = [
    { title: "Total Citas", value: stats.total.toString(), color: "text-blue-600" },
    { title: "Confirmadas", value: stats.confirmed.toString(), color: "text-green-600" },
    { title: "Pendientes", value: stats.pending.toString(), color: "text-yellow-600" },
    { title: "Canceladas", value: stats.cancelled.toString(), color: "text-red-600" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header
        title="Todas las Citas"
        showBackButton={true}
        backButtonText="Dashboard"
        backButtonHref="/dashboard"
        notifications={{
          count: 3,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
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
                <Button variant="outline" onClick={handleExportAppointments}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <Button
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                  onClick={handleCreateAppointment}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Cita
                </Button>
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
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="w-full md:w-48">
                <Select value={statusFilter} onValueChange={handleStatusFilter}>
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
                <Select value={dateFilter} onValueChange={handleDateFilter}>
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
                  variant={viewMode === "cards" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("cards")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Mostrando {clientFilteredAppointments.length} de {appointments.length} citas
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        {clientFilteredAppointments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Calendar className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No se encontraron citas</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No hay citas que coincidan con los filtros seleccionados.
              </p>
              <Button onClick={handleCreateAppointment}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Nueva Cita
              </Button>
            </CardContent>
          </Card>
        ) : viewMode === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clientFilteredAppointments.map((appointment) => (
              <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={appointment.client.avatar || "/Avatar1.png"} alt={appointment.client.fullName} />
                        <AvatarFallback>{getInitials(appointment.client.fullName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{appointment.client.fullName}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{appointment.service.name}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewAppointment(appointment)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCallClient(appointment)}>
                          <Phone className="h-4 w-4 mr-2" />
                          Llamar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEmailClient(appointment)}>
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditAppointment(appointment)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar Cita
                        </DropdownMenuItem>
                        {appointment.status === "pending" && (
                          <DropdownMenuItem onClick={() => handleConfirmAppointment(appointment)}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Confirmar
                          </DropdownMenuItem>
                        )}
                        {appointment.status !== "cancelled" && (
                          <DropdownMenuItem onClick={() => handleCancelAppointment(appointment)}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancelar
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleDeleteAppointment(appointment)} className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Fecha:</span>
                      <span className="text-sm font-medium">{new Date(appointment.appointmentDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Hora:</span>
                      <span className="text-sm font-medium">{appointment.startTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Duración:</span>
                      <span className="text-sm font-medium">{appointment.service.durationMinutes} min</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Estado:</span>
                      {getStatusBadge(appointment.status)}
                    </div>
                  </div>

                  {appointment.notes && (
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Notas:</strong> {appointment.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Servicio</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Hora</TableHead>
                      <TableHead>Duración</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientFilteredAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={appointment.client.avatar || "/Avatar1.png"}
                                alt={appointment.client.fullName}
                              />
                              <AvatarFallback className="text-xs">{getInitials(appointment.client.fullName)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{appointment.client.fullName}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{appointment.client.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{appointment.service.name}</TableCell>
                        <TableCell>{new Date(appointment.appointmentDate).toLocaleDateString()}</TableCell>
                        <TableCell>{appointment.startTime}</TableCell>
                        <TableCell>{appointment.service.durationMinutes} min</TableCell>
                        <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewAppointment(appointment)}>
                                <Eye className="h-4 w-4 mr-2" />
                                Ver Detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleCallClient(appointment)}>
                                <Phone className="h-4 w-4 mr-2" />
                                Llamar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEmailClient(appointment)}>
                                <Mail className="h-4 w-4 mr-2" />
                                Email
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditAppointment(appointment)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar Cita
                              </DropdownMenuItem>
                              {appointment.status === "pending" && (
                                <DropdownMenuItem onClick={() => handleConfirmAppointment(appointment)}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Confirmar
                                </DropdownMenuItem>
                              )}
                              {appointment.status !== "cancelled" && (
                                <DropdownMenuItem onClick={() => handleCancelAppointment(appointment)}>
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Cancelar
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => handleDeleteAppointment(appointment)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {appointments.length > 0 && (
          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Página {pagination.currentPage} de {pagination.totalPages}
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" disabled={!pagination.hasPreviousPage}
                onClick={() => {
                  const url = new URL(window.location.href)
                  const params = new URLSearchParams(url.search)
                  const nextPage = pagination.currentPage - 1
                  params.set("page", nextPage.toString())
                  router.push(`${url.pathname}?${params.toString()}`)
                }}
              >
                Anterior
              </Button>
              <Button variant="outline" disabled={!pagination.hasNextPage}
                onClick={() => {
                  const url = new URL(window.location.href)
                  const params = new URLSearchParams(url.search)
                  const nextPage = pagination.currentPage + 1
                  params.set("page", nextPage.toString())
                  router.push(`${url.pathname}?${params.toString()}`)
                }}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

