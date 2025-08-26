"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Calendar,
  Search,
  Plus,
  CheckCircle,
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
  User as UserIcon,
} from "lucide-react";
import { Header } from "@/components/header";
import type { Appointment, AppointmentStats, Pagination, User } from "@/types";
import { redirect } from "next/navigation";
import {
  getStatusColor,
  getStatusIcon,
  getStatusText,
} from "@/utils/functions/appointmentStatus";
import { AppointmentDetailsDialog } from "@/components/appointment-details-dialog";

type Props = {
  appointments: Appointment[];
  stats: AppointmentStats;
  pagination: Pagination;
  professionals?: User[];
  currentUser?: User;
};

export default function PageClient({
  appointments,
  stats,
  pagination,
  professionals,
  currentUser,
}: Props) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState("all");

  // Check if current user is a professional
  const isProfessional = currentUser?.role?.name === "profesional";

  // Helper function to check if date matches filter
  const doesDateMatchFilter = (
    appointmentDate: string | Date,
    filter: string,
  ) => {
    if (filter === "all") return true;

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const appointmentDateObj = new Date(appointmentDate);

    const normalizeDate = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    const normalizedToday = normalizeDate(today);
    const normalizedTomorrow = normalizeDate(tomorrow);
    const normalizedAppointment = normalizeDate(appointmentDateObj);

    switch (filter) {
      case "today":
        return normalizedAppointment.getTime() === normalizedToday.getTime();
      case "tomorrow":
        return normalizedAppointment.getTime() === normalizedTomorrow.getTime();
      case "week":
        const weekFromNow = new Date(today);
        weekFromNow.setDate(today.getDate() + 7);
        return appointmentDateObj >= today && appointmentDateObj <= weekFromNow;
      default:
        return true;
    }
  };

  // Client-side filtering for immediate UI feedback
  const clientFilteredAppointments = appointments.filter((appointment) => {
    // Search filter
    const matchesSearch =
      appointment.client.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.services?.some((service: any) =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    // Status filter
    const matchesStatus =
      statusFilter === "all" || appointment.status === statusFilter;

    // Date filter
    const matchesDate = doesDateMatchFilter(
      appointment.appointmentDate,
      dateFilter,
    );

    // Professional filter
    const matchesProfessional =
      selectedProfessionalId === "all" ||
      appointment.professional?.id === selectedProfessionalId;

    return matchesSearch && matchesStatus && matchesDate && matchesProfessional;
  });

  const handleProfessionalFilter = (value: string) => {
    setSelectedProfessionalId(value);
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    if (value !== "all") {
      params.set("professional", value);
    } else {
      params.delete("professional");
    }

    router.push(`${url.pathname}?${params.toString()}`);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    router.push(`${url.pathname}?${params.toString()}`);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    if (value !== "all") {
      params.set("status", value);
    } else {
      params.delete("status");
    }

    router.push(`${url.pathname}?${params.toString()}`);
  };

  const handleDateFilter = (value: string) => {
    setDateFilter(value);
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    if (value !== "all") {
      params.set("date", value);
    } else {
      params.delete("date");
    }

    router.push(`${url.pathname}?${params.toString()}`);
  };

  // Action handlers
  const handleEditAppointment = (appointment: Appointment) => {
    console.log("Edit appointment:", appointment);
    // router.push(`/appointments/${appointment.id}/edit`)
  };

  const handleConfirmAppointment = (appointment: Appointment) => {
    console.log("Confirm appointment:", appointment);
  };

  const handleCancelAppointment = (appointment: Appointment) => {
    console.log("Cancel appointment:", appointment);
  };

  const handleDeleteAppointment = (appointment: Appointment) => {
    console.log("Delete appointment:", appointment);
  };

  const handleCallClient = (appointment: Appointment) => {
    window.open(`tel:${appointment.client.phone}`);
  };

  const handleEmailClient = (appointment: Appointment) => {
    window.open(`mailto:${appointment.client.email}`);
  };

  const handleViewAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleCreateAppointment = () => {
    redirect("/appointments/new");
  };

  const handleCloseDialog = () => {
    setSelectedAppointment(null);
  };

  const handleExportAppointments = () => {
    console.log("Export appointments");
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge className={getStatusColor(status)}>
        <div className="flex items-center space-x-1">
          {getStatusIcon(status)}
          <span className="text-xs">{getStatusText(status)}</span>
        </div>
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        label: "Pendiente",
      },
      paid: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        label: "Pagado",
      },
      refunded: {
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        label: "Reembolsado",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <Badge variant="outline" className={config.color}>
        <span className="text-xs">{config.label}</span>
      </Badge>
    );
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "GTQ",
    }).format(amount);
  };

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Suma total de duración y precio
  const getTotalDuration = (services: any[]) =>
    services?.reduce(
      (acc: number, service: any) => acc + (Number(service.durationMinutes) || 0),
      0,
    ) || 0;
  const getTotalPrice = (services: any[]) =>
    services?.reduce(
      (acc: number, service: any) => acc + (Number(service.price) || 0),
      0,
    ) || 0;

  const statsCards = [
    { title: "Total Citas", value: stats.todayCount, color: "text-blue-600" },
    {
      title: "Confirmadas",
      value: stats.confirmedCount,
      color: "text-green-600",
    },
    {
      title: "Pendientes",
      value: stats.pendingCount,
      color: "text-yellow-600",
    },
    {
      title: "Canceladas",
      value: stats.cancelledCount,
      color: "text-red-600",
    },
  ];

  // Format time
  const formatTime = (timeString: string) => {
    if (!timeString) return "00:00";
    const timeParts = timeString.split(":");
    return `${timeParts[0]}:${timeParts[1]}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        title="Todas las Citas"
        showBackButton={true}
        backButtonText="Dashboard"
        backButtonHref="/dashboard"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-3 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p
                      className={`text-lg md:text-2xl font-bold ${stat.color}`}
                    >
                      {stat.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <CardTitle>Gestión de Citas</CardTitle>
                <CardDescription>
                  Administra todas tus citas programadas
                </CardDescription>
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
            <div className="space-y-4 mb-6">
              <div className="w-full">
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

              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="w-full sm:w-48">
                    <Select
                      value={statusFilter}
                      onValueChange={handleStatusFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="confirmed">Confirmada</SelectItem>
                        <SelectItem value="scheduled">Agendada</SelectItem>
                        <SelectItem value="completed">Completada</SelectItem>
                        <SelectItem value="in_progress">En progreso</SelectItem>
                        <SelectItem value="cancelled">Cancelada</SelectItem>
                        <SelectItem value="no_show">No asistió</SelectItem>
                        <SelectItem value="expired">Expirada</SelectItem>
                        <SelectItem value="rescheduled">Reagendada</SelectItem>
                        <SelectItem value="waitlist">Lista de espera</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full sm:w-48">
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
                  {!isProfessional && professionals && (
                    <div className="w-full sm:w-64">
                      <Select
                        value={selectedProfessionalId}
                        onValueChange={handleProfessionalFilter}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Filtrar por profesional" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">
                            Todos los profesionales
                          </SelectItem>
                          {professionals.map((professional) => (
                            <SelectItem
                              key={professional.id}
                              value={professional.id}
                            >
                              <div className="flex items-center gap-2">
                                <Avatar className="h-5 w-5">
                                  <AvatarImage
                                    src={professional.avatar || "/Avatar1.png"}
                                    alt={professional.fullName}
                                  />
                                  <AvatarFallback>
                                    {getInitials(professional.fullName)}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{professional.fullName}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
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
              <div className="flex items-center justify-between pt-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Mostrando {clientFilteredAppointments.length} de{" "}
                  {appointments.length} citas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {clientFilteredAppointments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Calendar className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No se encontraron citas
              </h3>
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
              <Card
                key={appointment.id}
                className="hover:shadow-lg transition-shadow"
                onClick={() => handleViewAppointment(appointment)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage
                          src={appointment.client.avatar || "/Avatar1.png"}
                          alt={appointment.client.fullName}
                        />
                        <AvatarFallback>
                          {getInitials(appointment.client.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {appointment.client.fullName}
                        </h3>
                        <ul className="text-sm text-gray-500 dark:text-gray-400">
                          {appointment.services?.map((service: any, idx: number) => (
                            <li key={service.id || idx}>
                              {service.name} ({service.durationMinutes} min, {formatCurrency(Number(service.price) || 0)})
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewAppointment(appointment)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleCallClient(appointment)}
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Llamar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEmailClient(appointment)}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEditAppointment(appointment)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar Cita
                        </DropdownMenuItem>
                        {appointment.status === "pending" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleConfirmAppointment(appointment)
                            }
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Confirmar
                          </DropdownMenuItem>
                        )}
                        {appointment.status !== "cancelled" && (
                          <DropdownMenuItem
                            onClick={() => handleCancelAppointment(appointment)}
                          >
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
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Fecha:
                      </span>
                      <span className="text-sm font-medium">
                        {new Date(
                          appointment.appointmentDate,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Hora:
                      </span>
                      <span className="text-sm font-medium">
                        {formatTime(appointment.startTime)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Duración total:
                      </span>
                      <span className="text-sm font-medium">
                        {getTotalDuration(appointment.services)} min
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Precio total:
                      </span>
                      <span className="text-sm font-medium">
                        {formatCurrency(getTotalPrice(appointment.services))}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Estado:
                      </span>
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
                      <TableHead>Servicios</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Hora</TableHead>
                      <TableHead>Duración</TableHead>
                      <TableHead>Precio</TableHead>
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
                                src={
                                  appointment.client.avatar || "/Avatar1.png"
                                }
                                alt={appointment.client.fullName}
                              />
                              <AvatarFallback className="text-xs">
                                {getInitials(appointment.client.fullName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {appointment.client.fullName}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {appointment.client.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <ul className="text-xs">
                            {appointment.services?.map((service: any, idx: number) => (
                              <li key={service.id || idx}>
                                {service.name} ({service.durationMinutes} min, {formatCurrency(Number(service.price) || 0)})
                              </li>
                            ))}
                          </ul>
                        </TableCell>
                        <TableCell>
                          {new Date(
                            appointment.appointmentDate,
                          ).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {formatTime(appointment.startTime)}
                        </TableCell>
                        <TableCell>
                          {getTotalDuration(appointment.services)} min
                        </TableCell>
                        <TableCell>
                          {formatCurrency(getTotalPrice(appointment.services))}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(appointment.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  handleViewAppointment(appointment)
                                }
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Ver Detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleCallClient(appointment)}
                              >
                                <Phone className="h-4 w-4 mr-2" />
                                Llamar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEmailClient(appointment)}
                              >
                                <Mail className="h-4 w-4 mr-2" />
                                Email
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleEditAppointment(appointment)
                                }
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Editar Cita
                              </DropdownMenuItem>
                              {appointment.status === "pending" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleConfirmAppointment(appointment)
                                  }
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Confirmar
                                </DropdownMenuItem>
                              )}
                              {appointment.status !== "cancelled" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleCancelAppointment(appointment)
                                  }
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Cancelar
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDeleteAppointment(appointment)
                                }
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

        {appointments.length > 0 && (
          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Página {pagination.currentPage} de {pagination.totalPages}
            </p>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                disabled={!pagination.hasPreviousPage}
                onClick={() => {
                  const url = new URL(window.location.href);
                  const params = new URLSearchParams(url.search);
                  const nextPage = pagination.currentPage - 1;
                  params.set("page", nextPage.toString());
                  router.push(`${url.pathname}?${params.toString()}`);
                }}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                disabled={!pagination.hasNextPage}
                onClick={() => {
                  const url = new URL(window.location.href);
                  const params = new URLSearchParams(url.search);
                  const nextPage = pagination.currentPage + 1;
                  params.set("page", nextPage.toString());
                  router.push(`${url.pathname}?${params.toString()}`);
                }}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>

      <AppointmentDetailsDialog
        appointmentId={selectedAppointment?.id}
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