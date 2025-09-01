"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ClientForm } from "@/components/client-form";
import { ClientPagination } from "@/components/ui/client-pagination";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { create } from "@/actions/clients/create";
import deleteClient from "@/actions/clients/delete";
import edit from "@/actions/clients/edit";
import {
  Users,
  UserCheck,
  UserPlus,
  Star,
  Search,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  Calendar,
  Plus,
  MoreHorizontal,
  Grid3X3,
  List,
  History,
} from "lucide-react";
import type {
  Client,
  ClientStats,
  Pagination,
  ClientFormData,
  ClientEditFormData,
} from "@/types";
import WhatsappIcon from "@/components/icons/whatsapp-icon";
import { openWhatsApp } from "@/utils/functions/openWhatsapp";

interface ClientsPageClientProps {
  clients?: Client[];
  stats?: ClientStats;
  pagination?: Pagination;
  initialSearchParams?: {
    page: number;
    limit: number;
    search: string;
  };
}

const defaultStats: ClientStats = {
  totalClients: 0,
  activeClients: 0,
  newThisMonth: 0,
  averageRating: 0,
};

export default function ClientsPageClient({
  clients = [],
  stats = defaultStats,
  pagination,
  initialSearchParams,
}: ClientsPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
  const [searchTerm, setSearchTerm] = useState(
    initialSearchParams?.search || "",
  );
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Estados para los diálogos de confirmación
  const [confirmationDialogs, setConfirmationDialogs] = useState({
    deleteClient: {
      open: false,
      client: null as Client | null,
    },
    editClient: {
      open: false,
      data: null as ClientFormData | null,
    },
    success: {
      open: false,
      message: "",
      title: "",
    },
  });

  // Pagination states
  const currentPage = initialSearchParams?.page || 1;
  const itemsPerPage = initialSearchParams?.limit || 10;

  // Debounce para búsqueda, solo dispara si hay 2 caracteres o más
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.length >= 2 || searchTerm.length === 0) {
        updateFilters({ search: searchTerm, page: 1 });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // Auto-cerrar diálogo de éxito después de 1000ms
  useEffect(() => {
    if (confirmationDialogs.success.open) {
      const timer = setTimeout(() => {
        closeDialog("success");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [confirmationDialogs.success.open]);

  // Función para actualizar filtros en la URL (búsqueda y paginación)
  const updateFilters = (newFilters: { search?: string; page?: number }) => {
    const params = new URLSearchParams(searchParams.toString());

    // Search filter
    if (newFilters.search !== undefined) {
      if (newFilters.search.trim() && newFilters.search.length >= 2) {
        params.set("search", newFilters.search);
      } else {
        params.delete("search");
      }
      // When changing search, reset page to 1
      params.set("page", "1");
    }

    // Pagination filter
    if (newFilters.page !== undefined) {
      params.set("page", String(newFilters.page));
    }

    router.push(`?${params.toString()}`);
  };

  // Handler for changing the page
  const handlePageChange = (newPage: number) => {
    updateFilters({ page: newPage });
  };

  const hasClients = clients && clients.length > 0;

  // Función para mostrar diálogo de éxito (auto-cierre)
  const showSuccessDialog = (title: string, message: string) => {
    setConfirmationDialogs((prev) => ({
      ...prev,
      success: {
        open: true,
        title,
        message,
      },
    }));
  };

  // Función para cerrar diálogos
  const closeDialog = (dialogType: keyof typeof confirmationDialogs) => {
    setConfirmationDialogs((prev) => ({
      ...prev,
      [dialogType]: {
        ...prev[dialogType],
        open: false,
      },
    }));
  };

  // Handler para crear cliente (SIN CONFIRMACIÓN)
  const handleCreateClient = async (data: ClientFormData) => {
    try {
      const response = await create(data);
      if (response.status === 201) {
        router.refresh();
        showSuccessDialog(
          "¡Cliente creado exitosamente!",
          `El cliente ${data.fullName} ha sido registrado correctamente en el sistema.`,
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Handler para preparar edición de cliente
  const handleEditClient = (data: ClientFormData) => {
    setConfirmationDialogs((prev) => ({
      ...prev,
      editClient: {
        open: true,
        data,
      },
    }));
  };

  // Handler para confirmar edición de cliente
  const confirmEditClient = async () => {
    const { data } = confirmationDialogs.editClient;
    if (!data || !editingClient) return;

    const data2: ClientEditFormData = {
      id: editingClient?.id,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
    };

    try {
      const response = await edit(data2);
      if (response.status === 200) {
        router.refresh();
        setEditingClient(null);
        showSuccessDialog(
          "¡Cliente editado exitosamente!",
          `Los datos de ${data.fullName} han sido actualizados correctamente.`,
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Handler para preparar eliminación de cliente
  const handleDeleteClient = (client: Client) => {
    setConfirmationDialogs((prev) => ({
      ...prev,
      deleteClient: {
        open: true,
        client,
      },
    }));
  };

  // Handler para confirmar eliminación de cliente
  const confirmDeleteClient = async () => {
    const { client } = confirmationDialogs.deleteClient;
    if (!client) return;

    try {
      const response = await deleteClient({ id: client.id });
      if (response.status === 200) {
        router.refresh();
        showSuccessDialog(
          "¡Cliente eliminado exitosamente!",
          `El cliente ${client.fullName} ha sido eliminado del sistema.`,
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setShowDetailsDialog(true);
  };

  const handleCallClient = (client: Client) => {
    window.open(`tel:${client.phone}`, "_self");
  };

  const handleEmailClient = (client: Client) => {
    window.open(`clients/${client.id}/history`);
  };

  const handleScheduleAppointment = (client: Client) => {
    window.open(`appointments/new?clientId=${client.id}`, "_self");
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const renderStars = (rating: number) =>
    [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // Estado vacío cuando no hay clientes del servidor
  if (!hasClients) {
    return (
      <div className="space-y-6">
        {/* Header con botón para crear cliente */}
        <div className="flex flex-wrap sm:flex-row justify-between items-start sm:items-center gap-4">
          <ClientForm
            trigger={
              <Button className="btn-gradient-primary text-white">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Cliente
              </Button>
            }
            onSubmit={handleCreateClient}
          />
        </div>

        {/* Stats Cards - Todos en 0 */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Clientes
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Comienza agregando clientes
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Clientes Activos
              </CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">0% del total</p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Nuevos este Mes
              </CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Sin registros</p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Valoración Promedio
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">0.0</div>
              <p className="text-xs text-muted-foreground">Sin valoraciones</p>
            </CardContent>
          </Card>
        </div>

        {/* Estado vacío principal */}
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-4 mb-6">
              <Users className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">
              ¡Bienvenido a tu lista de clientes!
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Aún no tienes clientes registrados. Comienza agregando tu primer
              cliente para gestionar tus citas y relaciones comerciales.
            </p>
            <ClientForm
              trigger={
                <Button size="lg" className="btn-gradient-primary text-white">
                  <UserPlus className="h-5 w-5 mr-2" />
                  Agregar Primer Cliente
                </Button>
              }
              onSubmit={handleCreateClient}
            />
          </CardContent>
        </Card>

        {/* Dialog de notificación de éxito (auto-cierre) */}
        <ConfirmationDialog
          open={confirmationDialogs.success.open}
          onOpenChange={() => {}} // No permitir cierre manual
          variant="success"
          type="notification"
          title={confirmationDialogs.success.title}
          description={confirmationDialogs.success.message}
          showCancel={false}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-wrap sm:flex-row justify-between items-start sm:items-center gap-4">
        <ClientForm
          trigger={
            <Button className="btn-gradient-primary text-white">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Cliente
            </Button>
          }
          onSubmit={handleCreateClient}
        />

        {/* View Toggle */}
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

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Clientes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {stats.totalClients}
            </div>
            <p className="text-xs text-muted-foreground">
              +{stats.newThisMonth} este mes
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Clientes Activos
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {stats.activeClients}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalClients > 0
                ? Math.round((stats.activeClients / stats.totalClients) * 100)
                : 0}
              % del total
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Nuevos este Mes
            </CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {stats.newThisMonth}
            </div>
            <p className="text-xs text-muted-foreground">Crecimiento mensual</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Valoración Promedio
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {stats.averageRating.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">De 5.0 estrellas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filtro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nombre, email o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Clientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Clientes ({pagination?.totalItems || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {clients.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay clientes</h3>
              <p className="text-muted-foreground mb-4">
                No se encontraron clientes que coincidan con la búsqueda.
              </p>
            </div>
          ) : viewMode === "cards" ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.map((client) => (
                  <Card
                    key={client.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={client.avatar}
                              alt={client.fullName}
                            />
                            <AvatarFallback>
                              {getInitials(client.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{client.fullName}</h3>
                            <p className="text-sm text-muted-foreground">
                              {client.email}
                            </p>
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
                              onClick={() => handleViewClient(client)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setEditingClient(client)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleCallClient(client)}
                            >
                              <Phone className="h-4 w-4 mr-2" />
                              Llamar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEmailClient(client)}
                            >
                              <History className="h-4 w-4 mr-2" />
                              Ver historial
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                openWhatsApp(client.phone, "Buen dia")
                              }
                            >
                              <WhatsappIcon
                                className="text-green-500 dark:bg-gray-900"
                                width={16}
                                height={16}
                              />
                              WhatsApp
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleScheduleAppointment(client)}
                            >
                              <Calendar className="h-4 w-4 mr-2" />
                              Programar Cita
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClient(client)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Teléfono:
                          </span>
                          <span className="text-sm font-medium">
                            {client.phone}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Valoración:
                          </span>
                          <div className="flex items-center space-x-1">
                            {renderStars(parseFloat(client.rating) || 0)}
                            <span className="text-sm ml-1">
                              ({client.rating || "0"})
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Registro:
                          </span>
                          <span className="text-sm font-medium">
                            {formatDate(client.createdAt)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Paginación para cards */}
              {pagination && (
                <ClientPagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  hasNextPage={pagination.hasNextPage}
                  hasPreviousPage={pagination.hasPreviousPage}
                  totalItems={pagination.totalItems}
                  itemsPerPage={pagination.itemsPerPage}
                />
              )}
            </>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Contacto</TableHead>
                      <TableHead>Valoración</TableHead>
                      <TableHead>Fecha Registro</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.map((client) => (
                      <TableRow key={client.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={client.avatar || "/placeholder.svg"}
                                alt={client.fullName}
                              />
                              <AvatarFallback className="text-xs">
                                {getInitials(client.fullName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {client.fullName}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">{client.email}</div>
                            <div className="text-sm text-muted-foreground">
                              {client.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            {renderStars(parseFloat(client.rating) || 0)}
                            <span className="text-sm ml-1">
                              ({client.rating || "0"})
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatDate(client.createdAt)}
                          </div>
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
                                onClick={() => handleViewClient(client)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Ver Detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setEditingClient(client)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleCallClient(client)}
                              >
                                <Phone className="h-4 w-4 mr-2" />
                                Llamar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEmailClient(client)}
                              >
                                <Mail className="h-4 w-4 mr-2" />
                                Enviar Email
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleScheduleAppointment(client)
                                }
                              >
                                <Calendar className="h-4 w-4 mr-2" />
                                Programar Cita
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteClient(client)}
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

              {/* Paginación para tabla */}
              {pagination && (
                <ClientPagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  hasNextPage={pagination.hasNextPage}
                  hasPreviousPage={pagination.hasPreviousPage}
                  totalItems={pagination.totalItems}
                  itemsPerPage={pagination.itemsPerPage}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      {editingClient && (
        <ClientForm
          trigger={<button>Editar</button>}
          client={editingClient}
          onSubmit={handleEditClient}
        />
      )}

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles del Cliente</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={selectedClient.avatar}
                    alt={selectedClient.fullName}
                  />
                  <AvatarFallback>
                    {getInitials(selectedClient.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">
                    {selectedClient.fullName}
                  </h2>
                  <p className="text-muted-foreground">
                    {selectedClient.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Teléfono</label>
                    <p className="mt-1">{selectedClient.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="mt-1">{selectedClient.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Valoración</label>
                    <div className="flex items-center space-x-1 mt-1">
                      {renderStars(parseFloat(selectedClient.rating) || 0)}
                      <span className="text-sm ml-1">
                        ({selectedClient.rating || "0"})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">
                      Fecha de Registro
                    </label>
                    <p className="mt-1">
                      {formatDate(selectedClient.createdAt)}
                    </p>
                    <div>
                      <label className="text-sm font-medium">Compañía</label>
                      <p className="mt-1">{selectedClient.company?.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogos de Confirmación */}

      {/* Dialog de confirmación para editar cliente */}
      <ConfirmationDialog
        open={confirmationDialogs.editClient.open}
        onOpenChange={(open) => !open && closeDialog("editClient")}
        variant="edit"
        type="confirmation"
        title="Guardar cambios del cliente"
        description="¿Deseas guardar los cambios realizados en la información del cliente?"
        confirmText="Guardar cambios"
        onConfirm={confirmEditClient}
      />

      {/* Dialog de confirmación para eliminar cliente */}
      <ConfirmationDialog
        open={confirmationDialogs.deleteClient.open}
        onOpenChange={(open) => !open && closeDialog("deleteClient")}
        variant="delete"
        type="confirmation"
        title="Eliminar cliente"
        description={`Esta acción no se puede deshacer. El cliente ${confirmationDialogs.deleteClient.client?.fullName || ""} será eliminado permanentemente del sistema junto con todo su historial.`}
        confirmText="Sí, eliminar"
        cancelText="No, mantener"
        onConfirm={confirmDeleteClient}
      />

      {/* Dialog de notificación de éxito (auto-cierre en 1000ms) */}
      <ConfirmationDialog
        open={confirmationDialogs.success.open}
        onOpenChange={() => {}} // No permitir cierre manual
        variant="success"
        type="notification"
        title={confirmationDialogs.success.title}
        description={confirmationDialogs.success.message}
        showCancel={false}
      />
    </div>
  );
}
