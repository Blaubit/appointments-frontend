"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
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
  CreditCard,
  Loader2,
  FileText,
  FileSpreadsheet,
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
import { AppointmentPaymentDialog } from "@/components/appointments/appointment-payment-dialog";
import { RateClientDialog } from "@/components/client/RateClientDialog";
import { useDebounceSearch } from "@/hooks/useDebounce";
import { getInitials } from "@/utils/functions/getInitials";
import formatCurrency from "@/utils/functions/formatCurrency";
import { exportAppointments } from "@/actions/appointments/export";

type Props = {
  appointments: Appointment[];
  stats: AppointmentStats;
  pagination: Pagination;
  professionals?: User[];
  currentUser?: User;
};

type ExportOptions = {
  format: "pdf" | "excel";
  includeStatistics: boolean;
  startDate?: string;
  endDate?: string;
  status?: string;
  professionalId?: string;
  includePaymentInfo: boolean;
  includeServices: boolean;
};

export default function PageClient({
  appointments,
  stats,
  pagination,
  professionals,
  currentUser,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const qValue = searchParams.get("q") || "";
  const { searchTerm, setSearchTerm } = useDebounceSearch(qValue, {
    delay: 500,
    minLength: 2,
    resetPage: true,
  });

  useEffect(() => {
    setSearchTerm(qValue);
  }, [qValue, setSearchTerm]);

  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState("all");

  // Payment dialog handlers
  const [isPaymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [appointmentToPay, setAppointmentToPay] = useState<Appointment | null>(
    null
  );

  // Rating dialog handlers
  const [isRateDialogOpen, setRateDialogOpen] = useState(false);
  const [appointmentToRate, setAppointmentToRate] =
    useState<Appointment | null>(null);

  // Export dialog handlers
  const [isExportDialogOpen, setExportDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: "excel",
    includeStatistics: false,
    startDate: "",
    endDate: "",
    status: "all",
    professionalId: "all",
    includePaymentInfo: false,
    includeServices: true,
  });

  const handleOpenPaymentDialog = (appointment: Appointment) => {
    setAppointmentToPay(appointment);
    setPaymentDialogOpen(true);
  };

  const handleClosePaymentDialog = () => {
    setAppointmentToPay(null);
    setPaymentDialogOpen(false);
  };

  const handlePayAppointment = (
    appointment: Appointment,
    paymentData: { amount: number; method: string }
  ) => {
    console.log("Payment completed, opening rate dialog");
    console.log("Pagando cita:", appointment, paymentData);

    setPaymentDialogOpen(false);
    setAppointmentToPay(null);

    setTimeout(() => {
      setAppointmentToRate(appointment);
      setRateDialogOpen(true);
    }, 100);
  };

  const handleRateClient = (clientId: string, rating: number) => {
    console.log("Rating saved:", { clientId, rating });
    setRateDialogOpen(false);
    setAppointmentToRate(null);
  };

  const handleCloseRateDialog = () => {
    setRateDialogOpen(false);
    setAppointmentToRate(null);
  };

  // Export functionality
  const handleOpenExportDialog = () => {
    // Set default values based on current filters
    setExportOptions({
      ...exportOptions,
      status: statusFilter === "all" ? "" : statusFilter,
      professionalId:
        selectedProfessionalId === "all" ? "" : selectedProfessionalId,
    });
    setExportDialogOpen(true);
  };

  const handleExportAppointments = async () => {
    setIsExporting(true);

    try {
      const options = {
        format: exportOptions.format,
        includeStatistics: exportOptions.includeStatistics,
        startDate: exportOptions.startDate || undefined,
        endDate: exportOptions.endDate || undefined,
        status:
          exportOptions.status === "all" ? undefined : exportOptions.status,
        professionalId:
          exportOptions.professionalId === "all"
            ? undefined
            : exportOptions.professionalId,
        includePaymentInfo: exportOptions.includePaymentInfo,
        includeServices: exportOptions.includeServices,
      };

      const result = await exportAppointments(options);

      if ("data" in result && result.data.success) {
        // Create blob and download file
        const byteCharacters = atob(result.data.fileData!);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: result.data.mimeType });

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download =
          result.data.filename ||
          `citas-export-${new Date().toISOString().split("T")[0]}.${exportOptions.format === "pdf" ? "pdf" : "xlsx"}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast({
          title: "Exportación exitosa",
          description: "El archivo se ha descargado correctamente.",
        });

        setExportDialogOpen(false);
      } else {
        throw new Error("Error al exportar");
      }
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Error al exportar",
        description:
          error instanceof Error
            ? error.message
            : "Ocurrió un error inesperado.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const updateExportOption = <K extends keyof ExportOptions>(
    key: K,
    value: ExportOptions[K]
  ) => {
    setExportOptions((prev) => ({ ...prev, [key]: value }));
  };

  const isProfessional = currentUser?.role?.name === "profesional";

  const doesDateMatchFilter = (
    appointmentDate: string | Date,
    filter: string
  ) => {
    if (filter === "all") return true;
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const appointmentDateObj = new Date(appointmentDate);
    const normalizeDate = (date: Date) =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate());
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

  const clientFilteredAppointments = appointments.filter((appointment) => {
    const matchesStatus =
      statusFilter === "all" || appointment.status === statusFilter;
    const matchesDate = doesDateMatchFilter(
      appointment.appointmentDate,
      dateFilter
    );
    const matchesProfessional =
      selectedProfessionalId === "all" ||
      appointment.professional?.id === selectedProfessionalId;
    return matchesStatus && matchesDate && matchesProfessional;
  });

  const handleStatusFilter = (value: string) => setStatusFilter(value);
  const handleDateFilter = (value: string) => setDateFilter(value);
  const handleProfessionalFilter = (value: string) =>
    setSelectedProfessionalId(value);

  const handleEditAppointment = (appointment: Appointment) => {
    router.push(`/appointments/${appointment.id}/edit`);
  };
  const handleConfirmAppointment = (appointment: Appointment) =>
    console.log("Confirm appointment:", appointment);
  const handleCancelAppointment = (appointment: Appointment) =>
    console.log("Cancel appointment:", appointment);
  const handleDeleteAppointment = (appointment: Appointment) =>
    console.log("Delete appointment:", appointment);
  const handleCallClient = (appointment: Appointment) =>
    window.open(`tel:${appointment.client.phone}`);
  const handleEmailClient = (appointment: Appointment) =>
    window.open(`mailto:${appointment.client.email}`);
  const handleViewAppointment = (appointment: Appointment) =>
    setSelectedAppointment(appointment);
  const handleCreateAppointment = () => redirect("/appointments/new");
  const handleCloseDialog = () => setSelectedAppointment(null);

  const getStatusBadge = (status: string) => (
    <Badge className={getStatusColor(status)}>
      <div className="flex items-center space-x-1">
        {getStatusIcon(status)}
        <span className="text-xs">{getStatusText(status)}</span>
      </div>
    </Badge>
  );

  const getTotalDuration = (services: any[]) =>
    services?.reduce(
      (acc: number, service: any) =>
        acc + (Number(service.durationMinutes) || 0),
      0
    ) || 0;

  const getTotalPrice = (services: any[]) =>
    services?.reduce(
      (acc: number, service: any) => acc + (Number(service.price) || 0),
      0
    ) || 0;

  const formatTime = (timeString: string) => {
    if (!timeString) return "00:00";
    const timeParts = timeString.split(":");
    return `${timeParts[0]}:${timeParts[1]}`;
  };

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
    { title: "Canceladas", value: stats.cancelledCount, color: "text-red-600" },
  ];

  const handlePrevPage = () => {
    if (!pagination.hasPreviousPage) return;
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    params.set("page", String(pagination.currentPage - 1));
    router.push(`${url.pathname}?${params.toString()}`);
  };

  const handleNextPage = () => {
    if (!pagination.hasNextPage) return;
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    params.set("page", String(pagination.currentPage + 1));
    router.push(`${url.pathname}?${params.toString()}`);
  };

  const menuActionHandler =
    (action: (appointment: Appointment) => void) =>
    (e: React.MouseEvent, appointment: Appointment) => {
      e.stopPropagation();
      action(appointment);
    };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

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
                <Dialog
                  open={isExportDialogOpen}
                  onOpenChange={setExportDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={handleOpenExportDialog}>
                      <Download className="h-4 w-4 mr-2" />
                      Exportar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Exportar Citas</DialogTitle>
                      <DialogDescription>
                        Configura las opciones de exportación para generar tu
                        reporte de citas.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      {/* Format Selection */}
                      <div className="space-y-2">
                        <Label>Formato de exportación</Label>
                        <Select
                          value={exportOptions.format}
                          onValueChange={(value: "pdf" | "excel") =>
                            updateExportOption("format", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="excel">
                              <div className="flex items-center gap-2">
                                <FileSpreadsheet className="h-4 w-4" />
                                Excel (.xlsx)
                              </div>
                            </SelectItem>
                            <SelectItem value="pdf">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                PDF (.pdf)
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Separator />

                      {/* Date Range */}
                      <div className="space-y-3">
                        <Label>Rango de fechas (opcional)</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label
                              htmlFor="startDate"
                              className="text-xs text-muted-foreground"
                            >
                              Fecha inicio
                            </Label>
                            <Input
                              id="startDate"
                              type="date"
                              value={exportOptions.startDate}
                              onChange={(e) =>
                                updateExportOption("startDate", e.target.value)
                              }
                              max={today}
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor="endDate"
                              className="text-xs text-muted-foreground"
                            >
                              Fecha fin
                            </Label>
                            <Input
                              id="endDate"
                              type="date"
                              value={exportOptions.endDate}
                              onChange={(e) =>
                                updateExportOption("endDate", e.target.value)
                              }
                              min={exportOptions.startDate || undefined}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Filters */}
                      <div className="space-y-3">
                        <Label>Filtros</Label>

                        {/* Status Filter */}
                        <div>
                          <Label
                            htmlFor="statusFilter"
                            className="text-xs text-muted-foreground"
                          >
                            Estado de las citas
                          </Label>
                          <Select
                            value={exportOptions.status}
                            onValueChange={(value) =>
                              updateExportOption("status", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Todos los estados" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">
                                Todos los estados
                              </SelectItem>
                              <SelectItem value="confirmed">
                                Confirmada
                              </SelectItem>
                              <SelectItem value="scheduled">
                                Agendada
                              </SelectItem>
                              <SelectItem value="completed">
                                Completada
                              </SelectItem>
                              <SelectItem value="in_progress">
                                En progreso
                              </SelectItem>
                              <SelectItem value="cancelled">
                                Cancelada
                              </SelectItem>
                              <SelectItem value="no_show">
                                No asistió
                              </SelectItem>
                              <SelectItem value="expired">Expirada</SelectItem>
                              <SelectItem value="rescheduled">
                                Reagendada
                              </SelectItem>
                              <SelectItem value="waitlist">
                                Lista de espera
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Professional Filter */}
                        {!isProfessional && professionals && (
                          <div>
                            <Label
                              htmlFor="professionalFilter"
                              className="text-xs text-muted-foreground"
                            >
                              Profesional
                            </Label>
                            <Select
                              value={exportOptions.professionalId}
                              onValueChange={(value) =>
                                updateExportOption("professionalId", value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Todos los profesionales" />
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
                                    {professional.fullName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>

                      <Separator />

                      {/* Include Options */}
                      <div className="space-y-3">
                        <Label>Incluir en la exportación</Label>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="includeServices"
                              checked={exportOptions.includeServices}
                              onCheckedChange={(checked) =>
                                updateExportOption(
                                  "includeServices",
                                  checked as boolean
                                )
                              }
                            />
                            <Label
                              htmlFor="includeServices"
                              className="text-sm"
                            >
                              Detalles de servicios
                            </Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="includePaymentInfo"
                              checked={exportOptions.includePaymentInfo}
                              onCheckedChange={(checked) =>
                                updateExportOption(
                                  "includePaymentInfo",
                                  checked as boolean
                                )
                              }
                            />
                            <Label
                              htmlFor="includePaymentInfo"
                              className="text-sm"
                            >
                              Información de pagos
                            </Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="includeStatistics"
                              checked={exportOptions.includeStatistics}
                              onCheckedChange={(checked) =>
                                updateExportOption(
                                  "includeStatistics",
                                  checked as boolean
                                )
                              }
                            />
                            <Label
                              htmlFor="includeStatistics"
                              className="text-sm"
                            >
                              Estadísticas resumidas
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setExportDialogOpen(false)}
                        disabled={isExporting}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleExportAppointments}
                        disabled={isExporting}
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                      >
                        {isExporting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Exportando...
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Exportar
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

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
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                        <SelectItem value="waitlist">
                          Lista de espera
                        </SelectItem>
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
                  {pagination.totalItems ?? appointments.length} citas
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
                          {appointment.services?.map(
                            (service: any, idx: number) => (
                              <li key={service.id || idx}>
                                {service.name} ({service.durationMinutes} min,{" "}
                                {formatCurrency(Number(service.price) || 0)})
                              </li>
                            )
                          )}
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
                          onClick={(e) =>
                            menuActionHandler(handleViewAppointment)(
                              e,
                              appointment
                            )
                          }
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) =>
                            menuActionHandler(handleCallClient)(e, appointment)
                          }
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Llamar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) =>
                            menuActionHandler(handleEmailClient)(e, appointment)
                          }
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) =>
                            menuActionHandler(handleEditAppointment)(
                              e,
                              appointment
                            )
                          }
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar Cita
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) =>
                            menuActionHandler(handleOpenPaymentDialog)(
                              e,
                              appointment
                            )
                          }
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          Pagar
                        </DropdownMenuItem>
                        {appointment.status === "pending" && (
                          <DropdownMenuItem
                            onClick={(e) =>
                              menuActionHandler(handleConfirmAppointment)(
                                e,
                                appointment
                              )
                            }
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Confirmar
                          </DropdownMenuItem>
                        )}
                        {appointment.status !== "cancelled" && (
                          <DropdownMenuItem
                            onClick={(e) =>
                              menuActionHandler(handleCancelAppointment)(
                                e,
                                appointment
                              )
                            }
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancelar
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={(e) =>
                            menuActionHandler(handleDeleteAppointment)(
                              e,
                              appointment
                            )
                          }
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
                          appointment.appointmentDate
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
                            {appointment.services?.map(
                              (service: any, idx: number) => (
                                <li key={service.id || idx}>
                                  {service.name} ({service.durationMinutes} min,{" "}
                                  {formatCurrency(Number(service.price) || 0)})
                                </li>
                              )
                            )}
                          </ul>
                        </TableCell>
                        <TableCell>
                          {new Date(
                            appointment.appointmentDate
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
                                onClick={(e) =>
                                  menuActionHandler(handleViewAppointment)(
                                    e,
                                    appointment
                                  )
                                }
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Ver Detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) =>
                                  menuActionHandler(handleCallClient)(
                                    e,
                                    appointment
                                  )
                                }
                              >
                                <Phone className="h-4 w-4 mr-2" />
                                Llamar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) =>
                                  menuActionHandler(handleEmailClient)(
                                    e,
                                    appointment
                                  )
                                }
                              >
                                <Mail className="h-4 w-4 mr-2" />
                                Email
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) =>
                                  menuActionHandler(handleEditAppointment)(
                                    e,
                                    appointment
                                  )
                                }
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Editar Cita
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) =>
                                  menuActionHandler(handleOpenPaymentDialog)(
                                    e,
                                    appointment
                                  )
                                }
                              >
                                <CreditCard className="h-4 w-4 mr-2" />
                                Pagar
                              </DropdownMenuItem>
                              {appointment.status === "pending" && (
                                <DropdownMenuItem
                                  onClick={(e) =>
                                    menuActionHandler(handleConfirmAppointment)(
                                      e,
                                      appointment
                                    )
                                  }
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Confirmar
                                </DropdownMenuItem>
                              )}
                              {appointment.status !== "cancelled" && (
                                <DropdownMenuItem
                                  onClick={(e) =>
                                    menuActionHandler(handleCancelAppointment)(
                                      e,
                                      appointment
                                    )
                                  }
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Cancelar
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={(e) =>
                                  menuActionHandler(handleDeleteAppointment)(
                                    e,
                                    appointment
                                  )
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

        {pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Página {pagination.currentPage} de {pagination.totalPages}
            </p>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                disabled={!pagination.hasPreviousPage}
                onClick={handlePrevPage}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                disabled={!pagination.hasNextPage}
                onClick={handleNextPage}
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
        onCancel={handleCancelAppointment}
        onDelete={handleDeleteAppointment}
        onCall={handleCallClient}
        onEmail={handleEmailClient}
      />

      <AppointmentPaymentDialog
        appointment={appointmentToPay}
        isOpen={isPaymentDialogOpen}
        onClose={handleClosePaymentDialog}
        onPay={handlePayAppointment}
      />

      {appointmentToRate && (
        <RateClientDialog
          client={appointmentToRate.client}
          onRate={handleRateClient}
          open={isRateDialogOpen}
          onOpenChange={setRateDialogOpen}
        />
      )}
    </div>
  );
}
