"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { create } from "@/actions/clients/create";
import edit from "@/actions/clients/edit";
import {
  Users,
  UserCheck,
  UserPlus,
  Star,
  Search,
  Filter,
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
  Tag,
  StarIcon,
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
  clients: Client[];
  stats: ClientStats;
  pagination: Pagination;
}

export default function ClientsPageClient({
  clients,
  stats,
  pagination,
}: ClientsPageClientProps) {
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" || client.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCreateClient = (data: ClientFormData) => {
    create(data)
      .then((response) => {
        if (response.status === 201) {
          console.log("Cliente creado exitosamente");
        }
      })
      .catch((error) => console.error(error));
  };

  const handleEditClient = (data: ClientFormData) => {
    const data2: ClientEditFormData = {
      id: editingClient?.id,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
    };

    edit(data2)
      .then((response) => {
        if (response.status === 201) {
          console.log("Cliente editado exitosamente");
        }
      })
      .catch((error) => console.error(error));

    setEditingClient(null);
  };

  const handleDeleteClient = (client: Client) => {
    console.log("Eliminar cliente:", client.id);
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setShowDetailsDialog(true);
  };

  const handleCallClient = (client: Client) => {
    window.open(`tel:${client.phone}`, "_self");
  };

  const handleEmailClient = (client: Client) => {
    window.open(`mailto:${client.email}`, "_self");
  };

  const handleScheduleAppointment = (client: Client) => {
    console.log("Programar cita para:", client.id);
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: {
        label: "Activo",
        className:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      },
      inactive: {
        label: "Inactivo",
        className:
          "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      },
      blocked: {
        label: "Bloqueado",
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.inactive;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

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
        {/* Card 1 */}
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

        {/* Card 2 */}
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

        {/* Card 3 */}
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

        {/* Card 4 */}
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
          <CardTitle className="text-base">Filtros</CardTitle>
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
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                  <SelectItem value="blocked">Bloqueados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Clientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Clientes ({filteredClients.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredClients.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay clientes</h3>
              <p className="text-muted-foreground mb-4">
                No se encontraron clientes que coincidan con los filtros.
              </p>
              <ClientForm
                trigger={
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Agregar Primer Cliente
                  </Button>
                }
              />
            </div>
          ) : viewMode === "cards" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.map((client) => (
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
                            <Mail className="h-4 w-4 mr-2" />
                            Enviar Email
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(() => openWhatsApp(client.phone,"Buen dia"))}
                          >
                          <WhatsappIcon className="text-green-500 dark:bg-gray-900" width={32} height={32} />
                           WhatsApp
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleScheduleAppointment(client)}
                          >
                            <Calendar className="h-4 w-4 mr-2" />
                            Programar Cita
                          </DropdownMenuItem>
                          {client.status !== "active" && (
                            <DropdownMenuItem
                              onClick={() => handleDeleteClient(client)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Estado:
                        </span>
                        {getStatusBadge(client.status)}
                      </div>

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
                          Citas:
                        </span>
                        <span className="text-sm font-medium">
                          {client.totalAppointments}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Total Gastado:
                        </span>
                        <span className="text-sm font-medium">
                          {formatCurrency(client.totalSpent)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Valoración:
                        </span>
                        <div className="flex items-center space-x-1">
                          {renderStars(client.rating)}
                          <span className="text-sm ml-1">
                            ({client.rating})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Última Cita:
                        </span>
                        <span className="text-sm font-medium">
                          {client.lastAppointment
                            ? formatDate(client.lastAppointment)
                            : "Nunca"}
                        </span>
                      </div>

                      {client.tags && client.tags.length > 0 && (
                        <div className="pt-2">
                          <div className="flex flex-wrap gap-1">
                            {client.tags.map((tag, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Citas</TableHead>
                    <TableHead>Total Gastado</TableHead>
                    <TableHead>Valoración</TableHead>
                    <TableHead>Última Cita</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
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
                            <div className="font-medium">{client.fullName}</div>
                            {client.tags && client.tags.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {client.tags.slice(0, 2).map((tag, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                                {client.tags.length > 2 && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    +{client.tags.length - 2}
                                  </Badge>
                                )}
                              </div>
                            )}
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
                      <TableCell>{getStatusBadge(client.status)}</TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="font-medium">
                            {client.totalAppointments}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {formatCurrency(client.totalSpent)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {renderStars(client.rating)}
                          <span className="text-sm ml-1">
                            ({client.rating})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {client.lastAppointment
                            ? formatDate(client.lastAppointment)
                            : "Nunca"}
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
                              onClick={() => handleScheduleAppointment(client)}
                            >
                              <Calendar className="h-4 w-4 mr-2" />
                              Programar Cita
                            </DropdownMenuItem>
                            {client.status !== "active" && (
                              <DropdownMenuItem
                                onClick={() => handleDeleteClient(client)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
