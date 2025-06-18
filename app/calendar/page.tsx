"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  Bell,
  Settings,
  LogOut,
  ArrowLeft,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react"
import Link from "next/link"

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"month" | "week" | "day" | "agenda">("month")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [serviceFilter, setServiceFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  // Form data for create/edit appointment
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    service: "",
    date: "",
    time: "",
    duration: 30,
    notes: "",
    status: "pending",
  })

  // Mock data - in real app this would come from API
  const appointments = [
    {
      id: 1,
      clientName: "María González",
      clientEmail: "maria@email.com",
      clientPhone: "+1 (555) 123-4567",
      service: "Consulta General",
      serviceColor: "#3B82F6",
      date: "2024-01-15",
      time: "09:00",
      duration: 30,
      status: "confirmed",
      notes: "Primera consulta, revisar historial médico",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      clientName: "Carlos Rodríguez",
      clientEmail: "carlos@email.com",
      clientPhone: "+1 (555) 234-5678",
      service: "Limpieza Dental",
      serviceColor: "#10B981",
      date: "2024-01-15",
      time: "10:30",
      duration: 45,
      status: "pending",
      notes: "Paciente con sensibilidad dental",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      clientName: "Ana Martínez",
      clientEmail: "ana@email.com",
      clientPhone: "+1 (555) 345-6789",
      service: "Corte y Peinado",
      serviceColor: "#F59E0B",
      date: "2024-01-16",
      time: "14:00",
      duration: 60,
      status: "confirmed",
      notes: "Corte bob y mechas",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      clientName: "Luis Fernández",
      clientEmail: "luis@email.com",
      clientPhone: "+1 (555) 456-7890",
      service: "Consulta Especializada",
      serviceColor: "#EF4444",
      date: "2024-01-16",
      time: "11:00",
      duration: 45,
      status: "cancelled",
      notes: "Cancelado por el paciente",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 5,
      clientName: "Carmen López",
      clientEmail: "carmen@email.com",
      clientPhone: "+1 (555) 567-8901",
      service: "Terapia Física",
      serviceColor: "#8B5CF6",
      date: "2024-01-17",
      time: "15:30",
      duration: 90,
      status: "confirmed",
      notes: "Sesión de rehabilitación",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 6,
      clientName: "Roberto Silva",
      clientEmail: "roberto@email.com",
      clientPhone: "+1 (555) 678-9012",
      service: "Revisión Rutinaria",
      serviceColor: "#06B6D4",
      date: "2024-01-18",
      time: "08:30",
      duration: 30,
      status: "pending",
      notes: "Chequeo anual",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const services = [
    { id: "consulta-general", name: "Consulta General", color: "#3B82F6" },
    { id: "limpieza-dental", name: "Limpieza Dental", color: "#10B981" },
    { id: "corte-peinado", name: "Corte y Peinado", color: "#F59E0B" },
    { id: "terapia-fisica", name: "Terapia Física", color: "#8B5CF6" },
    { id: "consulta-especializada", name: "Consulta Especializada", color: "#EF4444" },
    { id: "revision-rutinaria", name: "Revisión Rutinaria", color: "#06B6D4" },
  ]

  const timeSlots = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
  ]

  // Filter appointments
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.service.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesService = serviceFilter === "all" || appointment.service === serviceFilter
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter

    return matchesSearch && matchesService && matchesStatus
  })

  // Get appointments for a specific date
  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return filteredAppointments.filter((apt) => apt.date === dateStr)
  }

  // Navigation functions
  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (direction === "prev") {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setDate(newDate.getDate() + 7)
    }
    setCurrentDate(newDate)
  }

  const navigateDay = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (direction === "prev") {
      newDate.setDate(newDate.getDate() - 1)
    } else {
      newDate.setDate(newDate.getDate() + 1)
    }
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Generate calendar days for month view
  const generateMonthDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const currentDateObj = new Date(startDate)

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDateObj))
      currentDateObj.setDate(currentDateObj.getDate() + 1)
    }

    return days
  }

  // Generate week days
  const generateWeekDays = () => {
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())

    const days = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      days.push(day)
    }

    return days
  }

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("Creating appointment:", formData)
    setIsLoading(false)
    setIsCreateDialogOpen(false)
    resetForm()
  }

  const handleEditAppointment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("Editing appointment:", { id: selectedAppointment?.id, ...formData })
    setIsLoading(false)
    setIsEditDialogOpen(false)
    resetForm()
  }

  const handleDeleteAppointment = async (appointmentId: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta cita?")) {
      console.log("Deleting appointment:", appointmentId)
    }
  }

  const resetForm = () => {
    setFormData({
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      service: "",
      date: "",
      time: "",
      duration: 30,
      notes: "",
      status: "pending",
    })
    setSelectedAppointment(null)
  }

  const openCreateDialog = (date?: Date) => {
    if (date) {
      setFormData({ ...formData, date: date.toISOString().split("T")[0] })
    }
    setIsCreateDialogOpen(true)
  }

  const openEditDialog = (appointment: any) => {
    setSelectedAppointment(appointment)
    setFormData({
      clientName: appointment.clientName,
      clientEmail: appointment.clientEmail,
      clientPhone: appointment.clientPhone,
      service: appointment.service,
      date: appointment.date,
      time: appointment.time,
      duration: appointment.duration,
      notes: appointment.notes,
      status: appointment.status,
    })
    setIsEditDialogOpen(true)
  }

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
        return <CheckCircle className="h-3 w-3" />
      case "pending":
        return <AlertCircle className="h-3 w-3" />
      case "cancelled":
        return <XCircle className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
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

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
  const dayNamesLong = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                  <CalendarIcon className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Calendario</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </Button>

              <ThemeToggle variant="ghost" />

              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>DR</AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Dr. Roberto Silva</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Médico General</p>
                </div>
              </div>

              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>

              <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Calendar Controls */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (viewMode === "month") navigateMonth("prev")
                      else if (viewMode === "week") navigateWeek("prev")
                      else if (viewMode === "day") navigateDay("prev")
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (viewMode === "month") navigateMonth("next")
                      else if (viewMode === "week") navigateWeek("next")
                      else if (viewMode === "day") navigateDay("next")
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={goToToday}>
                    Hoy
                  </Button>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {viewMode === "month" && `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
                    {viewMode === "week" &&
                      `Semana del ${currentDate.getDate()} de ${monthNames[currentDate.getMonth()]}`}
                    {viewMode === "day" &&
                      `${dayNamesLong[currentDate.getDay()]}, ${currentDate.getDate()} de ${monthNames[currentDate.getMonth()]}`}
                    {viewMode === "agenda" && "Agenda"}
                  </h2>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "month" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("month")}
                >
                  Mes
                </Button>
                <Button
                  variant={viewMode === "week" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("week")}
                >
                  Semana
                </Button>
                <Button
                  variant={viewMode === "day" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("day")}
                >
                  Día
                </Button>
                <Button
                  variant={viewMode === "agenda" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("agenda")}
                >
                  Agenda
                </Button>
                <Button
                  onClick={() => openCreateDialog()}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Cita
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar citas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Service Filter */}
              <div className="w-full md:w-48">
                <Select value={serviceFilter} onValueChange={setServiceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Servicio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los servicios</SelectItem>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.name}>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: service.color }} />
                          <span>{service.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            </div>
          </CardContent>
        </Card>

        {/* Calendar Views */}
        {viewMode === "month" && (
          <Card>
            <CardContent className="p-6">
              {/* Month Header */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {dayNames.map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Month Grid */}
              <div className="grid grid-cols-7 gap-2">
                {generateMonthDays().map((date, index) => {
                  const isCurrentMonth = date.getMonth() === currentDate.getMonth()
                  const isToday = date.toDateString() === new Date().toDateString()
                  const dayAppointments = getAppointmentsForDate(date)

                  return (
                    <div
                      key={index}
                      className={`min-h-[120px] p-2 border rounded-lg cursor-pointer transition-colors ${
                        isCurrentMonth
                          ? "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                          : "bg-gray-50 dark:bg-gray-900 text-gray-400"
                      } ${isToday ? "ring-2 ring-blue-500" : ""}`}
                      onClick={() => openCreateDialog(date)}
                    >
                      <div className={`text-sm font-medium mb-2 ${isToday ? "text-blue-600" : ""}`}>
                        {date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayAppointments.slice(0, 3).map((appointment) => (
                          <div
                            key={appointment.id}
                            className="text-xs p-1 rounded truncate cursor-pointer hover:opacity-80"
                            style={{
                              backgroundColor: `${appointment.serviceColor}20`,
                              color: appointment.serviceColor,
                              borderLeft: `3px solid ${appointment.serviceColor}`,
                            }}
                            onClick={(e) => {
                              e.stopPropagation()
                              openEditDialog(appointment)
                            }}
                          >
                            {appointment.time} - {appointment.clientName}
                          </div>
                        ))}
                        {dayAppointments.length > 3 && (
                          <div className="text-xs text-gray-500">+{dayAppointments.length - 3} más</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {viewMode === "week" && (
          <Card>
            <CardContent className="p-6">
              {/* Week Header */}
              <div className="grid grid-cols-8 gap-2 mb-4">
                <div className="text-center text-sm font-medium text-gray-500 py-2">Hora</div>
                {generateWeekDays().map((date, index) => {
                  const isToday = date.toDateString() === new Date().toDateString()
                  return (
                    <div key={index} className={`text-center py-2 ${isToday ? "text-blue-600 font-bold" : ""}`}>
                      <div className="text-sm font-medium">{dayNames[date.getDay()]}</div>
                      <div className="text-lg">{date.getDate()}</div>
                    </div>
                  )
                })}
              </div>

              {/* Week Grid */}
              <div className="space-y-1">
                {timeSlots.map((time) => (
                  <div key={time} className="grid grid-cols-8 gap-2 min-h-[60px]">
                    <div className="text-sm text-gray-500 py-2 text-right pr-2">{time}</div>
                    {generateWeekDays().map((date, dayIndex) => {
                      const dayAppointments = getAppointmentsForDate(date).filter((apt) => apt.time === time)
                      return (
                        <div
                          key={dayIndex}
                          className="border rounded p-1 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                          onClick={() => {
                            setFormData({ ...formData, date: date.toISOString().split("T")[0], time })
                            openCreateDialog(date)
                          }}
                        >
                          {dayAppointments.map((appointment) => (
                            <div
                              key={appointment.id}
                              className="text-xs p-1 rounded mb-1 cursor-pointer hover:opacity-80"
                              style={{
                                backgroundColor: `${appointment.serviceColor}20`,
                                color: appointment.serviceColor,
                                borderLeft: `3px solid ${appointment.serviceColor}`,
                              }}
                              onClick={(e) => {
                                e.stopPropagation()
                                openEditDialog(appointment)
                              }}
                            >
                              <div className="font-medium truncate">{appointment.clientName}</div>
                              <div className="truncate">{appointment.service}</div>
                            </div>
                          ))}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {viewMode === "day" && (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-1">
                {timeSlots.map((time) => {
                  const dayAppointments = getAppointmentsForDate(currentDate).filter((apt) => apt.time === time)
                  return (
                    <div key={time} className="flex min-h-[80px]">
                      <div className="w-20 text-sm text-gray-500 py-2 text-right pr-4">{time}</div>
                      <div
                        className="flex-1 border rounded p-2 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                        onClick={() => {
                          setFormData({ ...formData, date: currentDate.toISOString().split("T")[0], time })
                          openCreateDialog(currentDate)
                        }}
                      >
                        {dayAppointments.map((appointment) => (
                          <div
                            key={appointment.id}
                            className="p-3 rounded mb-2 cursor-pointer hover:opacity-80"
                            style={{
                              backgroundColor: `${appointment.serviceColor}20`,
                              color: appointment.serviceColor,
                              borderLeft: `4px solid ${appointment.serviceColor}`,
                            }}
                            onClick={(e) => {
                              e.stopPropagation()
                              openEditDialog(appointment)
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">{appointment.clientName}</div>
                                <div className="text-sm">{appointment.service}</div>
                                <div className="text-xs opacity-75">{appointment.duration} min</div>
                              </div>
                              <Badge className={getStatusColor(appointment.status)}>
                                <div className="flex items-center space-x-1">
                                  {getStatusIcon(appointment.status)}
                                  <span>{getStatusText(appointment.status)}</span>
                                </div>
                              </Badge>
                            </div>
                            {appointment.notes && <div className="text-xs mt-2 opacity-75">{appointment.notes}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {viewMode === "agenda" && (
          <div className="space-y-4">
            {filteredAppointments.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No hay citas programadas</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    No se encontraron citas que coincidan con los filtros seleccionados.
                  </p>
                  <Button onClick={() => openCreateDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Nueva Cita
                  </Button>
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
                            <CalendarIcon className="h-4 w-4" />
                            <span>
                              {appointment.date} - {appointment.time}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: appointment.serviceColor }}
                            />
                            <span>
                              {appointment.service} ({appointment.duration} min)
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
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(appointment)}>
                          <Edit className="h-4 w-4" />
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
                            <DropdownMenuItem onClick={() => openEditDialog(appointment)}>
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
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteAppointment(appointment.id)}
                            >
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
        )}

        {/* Create Appointment Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleCreateAppointment}>
              <DialogHeader>
                <DialogTitle>Nueva Cita</DialogTitle>
                <DialogDescription>Completa la información para crear una nueva cita</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="clientName" className="text-right">
                    Cliente *
                  </Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="col-span-3"
                    placeholder="Nombre del cliente"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="clientPhone" className="text-right">
                    Teléfono
                  </Label>
                  <Input
                    id="clientPhone"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    className="col-span-3"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="service" className="text-right">
                    Servicio *
                  </Label>
                  <Select
                    value={formData.service}
                    onValueChange={(value) => setFormData({ ...formData, service: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccionar servicio" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.name}>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: service.color }} />
                            <span>{service.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Fecha *
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="time" className="text-right">
                    Hora *
                  </Label>
                  <Select value={formData.time} onValueChange={(value) => setFormData({ ...formData, time: value })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccionar hora" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="duration" className="text-right">
                    Duración
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number.parseInt(e.target.value) })}
                    className="col-span-3"
                    placeholder="30"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Notas
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="col-span-3"
                    placeholder="Notas adicionales..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creando..." : "Crear Cita"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Appointment Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleEditAppointment}>
              <DialogHeader>
                <DialogTitle>Editar Cita</DialogTitle>
                <DialogDescription>Modifica la información de la cita</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-clientName" className="text-right">
                    Cliente *
                  </Label>
                  <Input
                    id="edit-clientName"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-clientPhone" className="text-right">
                    Teléfono
                  </Label>
                  <Input
                    id="edit-clientPhone"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-service" className="text-right">
                    Servicio *
                  </Label>
                  <Select
                    value={formData.service}
                    onValueChange={(value) => setFormData({ ...formData, service: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.name}>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: service.color }} />
                            <span>{service.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-date" className="text-right">
                    Fecha *
                  </Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-time" className="text-right">
                    Hora *
                  </Label>
                  <Select value={formData.time} onValueChange={(value) => setFormData({ ...formData, time: value })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-status" className="text-right">
                    Estado
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="confirmed">Confirmada</SelectItem>
                      <SelectItem value="cancelled">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-duration" className="text-right">
                    Duración
                  </Label>
                  <Input
                    id="edit-duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number.parseInt(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="edit-notes" className="text-right">
                    Notas
                  </Label>
                  <Textarea
                    id="edit-notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
