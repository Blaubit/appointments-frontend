"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { Appointment, Service } from "@/types";
import create from "@/actions/appointments/create";

interface CalendarPageClientProps {
  initialAppointments: Appointment[];
  services: Service[];
}

export default function CalendarPageClient({
  initialAppointments,
  services,
}: CalendarPageClientProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "day" | "agenda">(
    "month",
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [appointments, setAppointments] =
    useState<Appointment[]>(initialAppointments);

  // Form data for create/edit appointment
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    serviceId: "",
    date: "",
    time: "",
    duration: 30,
    notes: "",
    status: "pending",
  });

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
  ];

  // Filter appointments
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.client.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.service.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService =
      serviceFilter === "all" || appointment.service.name === serviceFilter;
    const matchesStatus =
      statusFilter === "all" || appointment.status === statusFilter;

    return matchesSearch && matchesService && matchesStatus;
  });

  // Get appointments for a specific date
  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return filteredAppointments.filter((apt) => {
      // Handle both string and Date formats for appointmentDate
      let aptDateStr: string;
      if (typeof apt.appointmentDate === "string") {
        aptDateStr = apt.appointmentDate;
      } else {
        aptDateStr = new Date(apt.appointmentDate).toISOString().split("T")[0];
      }
      return aptDateStr === dateStr;
    });
  };

  // Convert time format from HH:MM:SS to HH:MM
  const formatTime = (timeStr: string) => {
    if (timeStr.includes(":")) {
      const parts = timeStr.split(":");
      return `${parts[0]}:${parts[1]}`;
    }
    return timeStr;
  };

  // Navigation functions
  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const navigateDay = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Generate calendar days for month view
  const generateMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDateObj = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDateObj));
      currentDateObj.setDate(currentDateObj.getDate() + 1);
    }

    return days;
  };

  // Generate week days
  const generateWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }

    return days;
  };

  // Handle day click in month view - switch to week view
  const handleDayClick = (date: Date) => {
    setCurrentDate(date);
    setViewMode("week");
  };

  // Handle hour click in week view - switch to day view
  const handleHourClickWeek = (date: Date, time: string) => {
    setCurrentDate(date);
    setViewMode("day");
  };

  // Handle hour click in day view - open create/edit dialog
  const handleHourClickDay = (time: string) => {
    const dayAppointments = getAppointmentsForDate(currentDate).filter(
      (apt) => formatTime(apt.startTime) === time,
    );

    if (dayAppointments.length > 0) {
      // If there's an appointment, open edit dialog
      openEditDialog(dayAppointments[0]);
    } else {
      // If no appointment, open create dialog with pre-filled data
      setFormData({
        ...formData,
        date: currentDate.toISOString().split("T")[0],
        time,
      });
      setIsCreateDialogOpen(true);
    }
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const selectedService = services.find((s) => s.id === formData.serviceId);
      if (!selectedService) {
        alert("Por favor selecciona un servicio");
        setIsLoading(false);
        return;
      }

      // Create appointment using the server action
      const result = await create({
        clientId: "temp-client-id", // You'll need to handle client creation/selection
        professionalId: "temp-professional-id", // You'll need to get current professional
        serviceId: formData.serviceId,
        appointmentDate: formData.date,
        startTime: formData.time,
        status: formData.status,
        notes: formData.notes,
      });

      if ("data" in result) {
        // Success
        setAppointments((prev) => [...prev, result.data]);
        setIsCreateDialogOpen(false);
        resetForm();
      } else {
        // Error
        alert(result.message || "Error creando la cita");
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert("Error creando la cita");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (selectedAppointment) {
      const selectedService = services.find((s) => s.id === formData.serviceId);
      const updatedAppointment: Appointment = {
        ...selectedAppointment,
        appointmentDate: new Date(formData.date),
        startTime: formData.time,
        endTime: calculateEndTime(formData.time, formData.duration),
        status: formData.status,
        notes: formData.notes,
        service: selectedService || selectedAppointment.service,
      };

      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === selectedAppointment.id ? updatedAppointment : apt,
        ),
      );
      console.log("Editing appointment:", updatedAppointment);
    }

    setIsLoading(false);
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta cita?")) {
      setAppointments((prev) => prev.filter((apt) => apt.id !== appointmentId));
      console.log("Deleting appointment:", appointmentId);
    }
  };

  const calculateEndTime = (startTime: string, durationMinutes: number) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    return `${endDate.getHours().toString().padStart(2, "0")}:${endDate.getMinutes().toString().padStart(2, "0")}`;
  };

  const resetForm = () => {
    setFormData({
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      serviceId: "",
      date: "",
      time: "",
      duration: 30,
      notes: "",
      status: "pending",
    });
    setSelectedAppointment(null);
  };

  const openCreateDialog = (date?: Date) => {
    if (date) {
      setFormData({ ...formData, date: date.toISOString().split("T")[0] });
    }
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setFormData({
      clientName: appointment.client.fullName,
      clientEmail: appointment.client.email,
      clientPhone: appointment.client.phone,
      serviceId: appointment.service.id,
      date:
        typeof appointment.appointmentDate === "string"
          ? appointment.appointmentDate
          : new Date(appointment.appointmentDate).toISOString().split("T")[0],
      time: formatTime(appointment.startTime),
      duration: appointment.service.durationMinutes,
      notes: appointment.notes || "",
      status: appointment.status,
    });
    setIsEditDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
      case "scheduled":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "rescheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "no_show":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
      case "scheduled":
        return <CheckCircle className="h-3 w-3" />;
      case "pending":
        return <AlertCircle className="h-3 w-3" />;
      case "cancelled":
      case "no_show":
        return <XCircle className="h-3 w-3" />;
      case "rescheduled":
        return <Clock className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmada";
      case "scheduled":
        return "Programada";
      case "pending":
        return "Pendiente";
      case "cancelled":
        return "Cancelada";
      case "rescheduled":
        return "Reprogramada";
      case "no_show":
        return "No asistió";
      default:
        return "Desconocido";
    }
  };

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
  ];

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const dayNamesLong = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  return (
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
                    if (viewMode === "month") navigateMonth("prev");
                    else if (viewMode === "week") navigateWeek("prev");
                    else if (viewMode === "day") navigateDay("prev");
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (viewMode === "month") navigateMonth("next");
                    else if (viewMode === "week") navigateWeek("next");
                    else if (viewMode === "day") navigateDay("next");
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
                  {viewMode === "month" &&
                    `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
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
                      <span>{service.name}</span>
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
                <div
                  key={day}
                  className="text-center text-sm font-medium text-gray-500 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Month Grid */}
            <div className="grid grid-cols-7 gap-2">
              {generateMonthDays().map((date, index) => {
                const isCurrentMonth =
                  date.getMonth() === currentDate.getMonth();
                const isToday =
                  date.toDateString() === new Date().toDateString();
                const dayAppointments = getAppointmentsForDate(date);

                return (
                  <div
                    key={index}
                    className={`min-h-[120px] p-2 border rounded-lg cursor-pointer transition-colors ${
                      isCurrentMonth
                        ? "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                        : "bg-gray-50 dark:bg-gray-900 text-gray-400"
                    } ${isToday ? "ring-2 ring-blue-500" : ""}`}
                    onClick={() => handleDayClick(date)}
                  >
                    <div
                      className={`text-sm font-medium mb-2 ${isToday ? "text-blue-600" : ""}`}
                    >
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayAppointments.slice(0, 3).map((appointment) => (
                        <div
                          key={appointment.id}
                          className="text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 bg-blue-100 text-blue-800 border-l-2 border-blue-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditDialog(appointment);
                          }}
                        >
                          {formatTime(appointment.startTime)} -{" "}
                          {appointment.client.fullName}
                        </div>
                      ))}
                      {dayAppointments.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{dayAppointments.length - 3} más
                        </div>
                      )}
                    </div>
                  </div>
                );
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
              <div className="text-center text-sm font-medium text-gray-700 py-2">
                Hora
              </div>
              {generateWeekDays().map((date, index) => {
                const isToday =
                  date.toDateString() === new Date().toDateString();
                return (
                  <div
                    key={index}
                    className={`text-center py-2 ${isToday ? "text-blue-600 font-bold" : ""}`}
                  >
                    <div className="text-sm font-medium">
                      {dayNames[date.getDay()]}
                    </div>
                    <div className="text-lg">{date.getDate()}</div>
                  </div>
                );
              })}
            </div>

            {/* Week Grid */}
            <div className="space-y-1">
              {timeSlots.map((time) => (
                <div key={time} className="grid grid-cols-8 gap-2 min-h-[60px]">
                  <div className="text-sm  py-2 text-right pr-2">
                    {time}
                  </div>
                  {generateWeekDays().map((date, dayIndex) => {
                    const dayAppointments = getAppointmentsForDate(date).filter(
                      (apt) => formatTime(apt.startTime) === time,
                    );
                    return (
                      <div
                        key={dayIndex}
                        className="border rounded p-1 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                        onClick={() => handleHourClickWeek(date, time)}
                      >
                        {dayAppointments.map((appointment) => (
                          <div
                            key={appointment.id}
                            className="text-xs p-1 rounded mb-1 cursor-pointer hover:opacity-80 bg-blue-100 text-blue-800 border-l-2 border-blue-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditDialog(appointment);
                            }}
                          >
                            <div className="font-medium truncate">
                              {appointment.client.fullName}
                            </div>
                            <div className="truncate">
                              {appointment.service.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
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
                const dayAppointments = getAppointmentsForDate(
                  currentDate,
                ).filter((apt) => formatTime(apt.startTime) === time);
                return (
                  <div key={time} className="flex min-h-[80px]">
                    <div className="w-20 text-sm  py-2 text-right pr-4">
                      {time}
                    </div>
                    <div
                      className="flex-1 border rounded p-2 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                      onClick={() => handleHourClickDay(time)}
                    >
                      {dayAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="p-3 rounded mb-2 cursor-pointer hover:opacity-80 bg-blue-100 text-blue-800 border-l-4 border-blue-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditDialog(appointment);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">
                                {appointment.client.fullName}
                              </div>
                              <div className="text-sm">
                                {appointment.service.name}
                              </div>
                              <div className="text-xs opacity-75">
                                {appointment.service.durationMinutes} min
                              </div>
                            </div>
                            <Badge
                              className={getStatusColor(appointment.status)}
                            >
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(appointment.status)}
                                <span>{getStatusText(appointment.status)}</span>
                              </div>
                            </Badge>
                          </div>
                          {appointment.notes && (
                            <div className="text-xs mt-2 opacity-75">
                              {appointment.notes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
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
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No hay citas programadas
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No se encontraron citas que coincidan con los filtros
                  seleccionados.
                </p>
                <Button onClick={() => openCreateDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Nueva Cita
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredAppointments
              .sort((a, b) => {
                const dateA = new Date(
                  a.appointmentDate + " " + a.startTime,
                ).getTime();
                const dateB = new Date(
                  b.appointmentDate + " " + b.startTime,
                ).getTime();
                return dateA - dateB;
              })
              .map((appointment) => (
                <Card
                  key={appointment.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>
                          {appointment.client.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                            {appointment.client.fullName}
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
                              {new Date(
                                appointment.appointmentDate,
                              ).toLocaleDateString("es-AR")}{" "}
                              - {formatTime(appointment.startTime)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <span>
                              {appointment.service.name} (
                              {appointment.service.durationMinutes} min)
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4" />
                            <span>{appointment.client.phone}</span>
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(appointment)}
                        >
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
                            <DropdownMenuItem
                              onClick={() => openEditDialog(appointment)}
                            >
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
                              onClick={() =>
                                handleDeleteAppointment(appointment.id)
                              }
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
              <DialogDescription>
                Completa la información para crear una nueva cita
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="clientName" className="text-right">
                  Cliente *
                </Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) =>
                    setFormData({ ...formData, clientName: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="Nombre del cliente"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="clientEmail" className="text-right">
                  Email
                </Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, clientEmail: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="cliente@email.com"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="clientPhone" className="text-right">
                  Teléfono
                </Label>
                <Input
                  id="clientPhone"
                  value={formData.clientPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, clientPhone: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="+54 11 1234-5678"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service" className="text-right">
                  Servicio *
                </Label>
                <Select
                  value={formData.serviceId}
                  onValueChange={(value) => {
                    const selectedService = services.find(
                      (s) => s.id === value,
                    );
                    setFormData({
                      ...formData,
                      serviceId: value,
                      duration: selectedService?.durationMinutes || 30,
                    });
                  }}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar servicio" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        <span>
                          {service.name} - {service.durationMinutes} min
                        </span>
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
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">
                  Hora *
                </Label>
                <Select
                  value={formData.time}
                  onValueChange={(value) =>
                    setFormData({ ...formData, time: value })
                  }
                >
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
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notas
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="Notas adicionales..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
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
              <DialogDescription>
                Modifica la información de la cita
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-clientName" className="text-right">
                  Cliente *
                </Label>
                <Input
                  id="edit-clientName"
                  value={formData.clientName}
                  onChange={(e) =>
                    setFormData({ ...formData, clientName: e.target.value })
                  }
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-clientEmail" className="text-right">
                  Email
                </Label>
                <Input
                  id="edit-clientEmail"
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, clientEmail: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-clientPhone" className="text-right">
                  Teléfono
                </Label>
                <Input
                  id="edit-clientPhone"
                  value={formData.clientPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, clientPhone: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-service" className="text-right">
                  Servicio *
                </Label>
                <Select
                  value={formData.serviceId}
                  onValueChange={(value) => {
                    const selectedService = services.find(
                      (s) => s.id === value,
                    );
                    setFormData({
                      ...formData,
                      serviceId: value,
                      duration:
                        selectedService?.durationMinutes || formData.duration,
                    });
                  }}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        <span>
                          {service.name} - {service.durationMinutes} min
                        </span>
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
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-time" className="text-right">
                  Hora *
                </Label>
                <Select
                  value={formData.time}
                  onValueChange={(value) =>
                    setFormData({ ...formData, time: value })
                  }
                >
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
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
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
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="edit-notes" className="text-right">
                  Notas
                </Label>
                <Textarea
                  id="edit-notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="col-span-3"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
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
  );
}
