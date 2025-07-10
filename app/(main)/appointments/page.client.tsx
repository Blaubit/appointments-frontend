"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataView, useDataView } from "@/components/data-view"
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
} from "lucide-react"
import { Header } from "@/components/header"
import type { Appointment, AppointmentStats, Pagination, DataViewField, DataViewAction } from "@/types"

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
  const { viewMode, ViewToggle } = useDataView("cards")

  // Client-side filtering for immediate UI feedback
  const clientFilteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.service.toLowerCase().includes(searchTerm.toLowerCase())
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
    console.log("Call client:", appointment.clientPhone)
    // TODO: Integrate with phone system or open tel: link
    // window.open(`tel:${appointment.clientPhone}`)
  }

  const handleEmailClient = (appointment: Appointment) => {
    console.log("Email client:", appointment.clientEmail)
    // TODO: Open email client or send email via API
    // window.open(`mailto:${appointment.clientEmail}`)
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

  // DataView field configuration
  const appointmentFields: DataViewField[] = [
    {
      key: "avatar",
      label: "Avatar",
      type: "avatar",
      showInTable: false,
      avatarConfig: {
        nameKey: "clientName",
        imageKey: "avatar",
      },
    },
    {
      key: "clientName",
      label: "Cliente",
      type: "text",
      primary: true,
      sortable: true,
    },
    {
      key: "clientEmail",
      label: "Email",
      type: "email",
      secondary: true,
      showInCard: false,
    },
    {
      key: "service",
      label: "Servicio",
      type: "text",
      sortable: true,
    },
    {
      key: "dateFormatted",
      label: "Fecha",
      type: "custom",
      sortable: true,
      render: (value: string, item: Appointment) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground">{item.time}</div>
        </div>
      ),
    },
    {
      key: "duration",
      label: "Duración",
      type: "duration",
    },
    {
      key: "status",
      label: "Estado",
      type: "custom",
      sortable: true,
      render: (value: string) => {
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

        const config = statusConfig[value as keyof typeof statusConfig]

        return (
          <Badge className={config.color}>
            <div className="flex items-center space-x-1">
              {config.icon}
              <span>{config.label}</span>
            </div>
          </Badge>
        )
      },
    },
    {
      key: "clientPhone",
      label: "Teléfono",
      type: "phone",
      showInCard: false,
    },
    {
      key: "notes",
      label: "Notas",
      type: "custom",
      showInTable: false,
      render: (value: string) =>
        value ? (
          <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm text-gray-600 dark:text-gray-400">
            <strong>Notas:</strong> {value}
          </div>
        ) : null,
    },
  ]

  // DataView actions configuration
  const appointmentActions: DataViewAction[] = [
    {
      label: "Ver Detalles",
      icon: Eye,
      onClick: handleViewAppointment,
    },
    {
      label: "Llamar",
      icon: Phone,
      onClick: handleCallClient,
    },
    {
      label: "Email",
      icon: Mail,
      onClick: handleEmailClient,
    },
    {
      label: "Editar Cita",
      icon: Edit,
      onClick: handleEditAppointment,
    },
    {
      label: "Confirmar",
      icon: CheckCircle,
      onClick: handleConfirmAppointment,
      show: (appointment: Appointment) => appointment.status === "pending",
    },
    {
      label: "Cancelar",
      icon: XCircle,
      onClick: handleCancelAppointment,
      show: (appointment: Appointment) => appointment.status !== "cancelled",
      variant: "destructive",
    },
    {
      label: "Eliminar",
      icon: Trash2,
      onClick: handleDeleteAppointment,
      variant: "destructive",
    },
  ]

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
              <ViewToggle />
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
        <DataView
          data={clientFilteredAppointments}
          fields={appointmentFields}
          actions={appointmentActions}
          viewMode={viewMode}
          emptyState={{
            icon: <Calendar className="h-12 w-12 text-gray-400" />,
            title: "No se encontraron citas",
            description: "No hay citas que coincidan con los filtros seleccionados.",
            action: (
              <Button onClick={handleCreateAppointment}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Nueva Cita
              </Button>
            ),
          }}
        />

        {/* Pagination */}
        {appointments.length > 0 && (
          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Página {pagination.page} de {pagination.totalPages}
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" disabled={pagination.page <= 1}>
                Anterior
              </Button>
              <Button variant="outline" disabled={pagination.page >= pagination.totalPages}>
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
