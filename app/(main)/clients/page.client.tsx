"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DataView, useDataView } from "@/components/data-view";
import {
  Search,
  Plus,
  Filter,
  Download,
  User,
  Users,
  TrendingUp,
  Star,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
} from "lucide-react";

type ClientStatus = "active" | "inactive";

type Client = {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  status: ClientStatus;
  totalAppointments: number;
  lastAppointment: string;
  nextAppointment: string | null;
  totalSpent: number;
  rating: number;
  notes: string;
  address: string;
  birthDate: string;
  joinDate: string;
  preferredServices: string[];
  tags: string[];
};

type Stats = {
  totalClients: number;
  activeClients: number;
  newThisMonth: number;
  averageRating: number;
};

type User = {
  name: string;
  email: string;
  role: string;
  avatar: string;
  initials: string;
};

type Pagination = {
  totalItems: number;
  totalPages: number;
  page: number;
  limit: number;
};

type Props = {
  clients: Client[];
  pagination: Pagination;
  stats: Stats;
  user: User;
  initialFilters: {
    query: string;
    status: string;
  };
};

export default function ClientsPageClient({
  clients,
  pagination,
  stats,
  user,
  initialFilters,
}: Props) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(initialFilters.query);
  const [statusFilter, setStatusFilter] = useState(initialFilters.status);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { viewMode, ViewToggle } = useDataView("cards");

  // Manejar cambios de filtros y búsqueda
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    updateURL({ query: value, status: statusFilter });
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    updateURL({ query: searchTerm, status: value });
  };

  const updateURL = (filters: { query: string; status: string }) => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    
    if (filters.query) {
      params.set("query", filters.query);
    } else {
      params.delete("query");
    }
    
    if (filters.status !== "all") {
      params.set("status", filters.status);
    } else {
      params.delete("status");
    }
    
    params.delete("page"); // Reset page when filtering
    router.push(`${url.pathname}?${params.toString()}`);
  };

  // Configuración de campos para el DataView
  const clientFields = [
    {
      key: "avatar",
      label: "Avatar",
      type: "avatar" as const,
      showInTable: false,
      avatarConfig: {
        nameKey: "name",
        imageKey: "avatar",
      },
    },
    {
      key: "name",
      label: "Cliente",
      type: "text" as const,
      primary: true,
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      type: "email" as const,
      secondary: true,
    },
    {
      key: "phone",
      label: "Teléfono",
      type: "phone" as const,
    },
    {
      key: "status",
      label: "Estado",
      type: "badge" as const,
      sortable: true,
      badgeConfig: {
        colors: {
          active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
          inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
        },
        labels: {
          active: "Activo",
          inactive: "Inactivo",
        },
      },
    },
    {
      key: "totalAppointments",
      label: "Citas",
      type: "number" as const,
      sortable: true,
    },
    {
      key: "totalSpent",
      label: "Total Gastado",
      type: "currency" as const,
      sortable: true,
    },
    {
      key: "rating",
      label: "Valoración",
      type: "rating" as const,
      sortable: true,
    },
    {
      key: "nextAppointment",
      label: "Próxima Cita",
      type: "date" as const,
      showInCard: false,
    },
    {
      key: "tags",
      label: "Etiquetas",
      type: "tags" as const,
      showInTable: false,
    },
  ];

  // Configuración de acciones
  const clientActions = [
    {
      label: "Ver detalles",
      icon: Eye,
      onClick: (client: Client) => router.push(`/clients/${client.id}`),
    },
    {
      label: "Editar",
      icon: Edit,
      onClick: (client: Client) => router.push(`/clients/${client.id}/edit`),
    },
    {
      label: "Contactar",
      icon: MessageSquare,
      onClick: (client: Client) => router.push(`/clients/${client.id}/contact`),
    },
    {
      label: "Eliminar",
      icon: Trash2,
      onClick: (client: Client) => console.log("Eliminar", client),
      variant: "destructive" as const,
    },
  ];

  const handleAddClient = () => {
    // Aquí iría la lógica para agregar un cliente
    console.log("Agregar nuevo cliente");
    setIsAddDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        title="Clientes"
        showBackButton={true}
        backButtonText="Dashboard"
        backButtonHref="/dashboard"
        user={user}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Clientes
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalClients}
                </div>
                <p className="text-xs text-muted-foreground">+12% desde el mes pasado</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Clientes Activos
                </CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.activeClients}
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((stats.activeClients / stats.totalClients) * 100)}% del total
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Nuevos Este Mes
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.newThisMonth}
                </div>
                <p className="text-xs text-muted-foreground">+5 esta semana</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Valoración Promedio
                </CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.averageRating}
                </div>
                <p className="text-xs text-muted-foreground">⭐ Excelente servicio</p>
              </CardContent>
            </Card>
          </div>

          {/* Sección principal de gestión */}
          <Card className="mb-8">
            <CardHeader>
              {/* Título y botones de acción principales */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div>
                  <CardTitle>Gestión de Clientes</CardTitle>
                  <CardDescription>Administra todos los clientes de tu negocio</CardDescription>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                  
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                        <Plus className="h-4 w-4 mr-2" />
                        Nuevo Cliente
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
                        <DialogDescription>
                          Completa la información del cliente para agregarlo al sistema.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">Nombre completo *</Label>
                          <Input 
                            id="name" 
                            placeholder="Ej: María González" 
                            className="col-span-3"
                          />
                        </div>
                        
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="email" className="text-right">Email *</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="maria@email.com" 
                            className="col-span-3"
                          />
                        </div>
                        
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="phone" className="text-right">Teléfono *</Label>
                          <Input 
                            id="phone" 
                            placeholder="+34 612 345 678" 
                            className="col-span-3"
                          />
                        </div>
                        
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="birthDate" className="text-right">Fecha de nacimiento</Label>
                          <Input 
                            id="birthDate" 
                            type="date" 
                            className="col-span-3"
                          />
                        </div>
                        
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="address" className="text-right">Dirección</Label>
                          <Input 
                            id="address" 
                            placeholder="Calle Mayor 123, Madrid" 
                            className="col-span-3"
                          />
                        </div>
                        
                        <div className="grid grid-cols-4 items-start gap-4">
                          <Label htmlFor="notes" className="text-right">Notas</Label>
                          <Textarea 
                            id="notes" 
                            placeholder="Información adicional sobre el cliente..." 
                            className="col-span-3"
                            rows={3}
                          />
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleAddClient}>
                          Guardar Cliente
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {/* Filtros y búsqueda */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar clientes..."
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
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="active">Activos</SelectItem>
                      <SelectItem value="inactive">Inactivos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* View Mode Toggle */}
                <ViewToggle />
              </div>

              {/* Results count */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Mostrando {clients.length} de {pagination.totalItems} clientes
                </p>
              </div>
              
              <DataView
                data={clients}
                fields={clientFields}
                actions={clientActions}
                viewMode={viewMode}
                emptyState={{
                  icon: <Users className="h-12 w-12 text-gray-400" />,
                  title: "No se encontraron clientes",
                  description: "No hay clientes que coincidan con los filtros seleccionados.",
                  action: (
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Primer Cliente
                    </Button>
                  ),
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}