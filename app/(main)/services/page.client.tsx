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
import { Input } from "@/components/ui/input";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Header } from "@/components/header";
import { ServiceForm } from "@/components/service-form"; // Importa el nuevo componente
import {
  Edit,
  Trash2,
  Eye,
  EyeOff,
  MoreHorizontal,
  Plus,
  Search,
  Download,
  Grid3X3,
  List,
  Clock,
  DollarSign,
  Star,
} from "lucide-react";
import type { Service as ServiceType } from "@/types";
import deleteService from "@/actions/services/delete";
interface Pagination {
  totalItems: number;
  totalPages: number;
  page: number;
}

type Props = {
  services: ServiceType[];
  pagination: Pagination;
};

export default function PageClient({ services, pagination }: Props) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");

  // Estados para los diálogos del formulario
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(
    null,
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    if (value) params.set("search", value);
    else params.delete("search");
    router.push(`${url.pathname}?${params.toString()}`);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    if (value !== "all") params.set("status", value);
    else params.delete("status");
    router.push(`${url.pathname}?${params.toString()}`);
  };

  const filteredServices = services.filter((s) => {
    const matchesSearch = s.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && s) ||
      (statusFilter === "inactive" && !s);
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string) => {
    deleteService({ id });
    // Aquí implementarías la lógica para eliminar
  };

  const handleToggleStatus = (s: ServiceType) => {
    console.log("Toggle", s.id);
    // Aquí implementarías la lógica para cambiar estado
  };

  const handleCreateSuccess = () => {
    // Refrescar la página o actualizar los datos
    router.refresh();
  };

  const handleEditSuccess = () => {
    // Refrescar la página o actualizar los datos
    router.refresh();
  };

  const openEdit = (service: ServiceType) => {
    setSelectedService(service);
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setSelectedService(null);
    setIsEditDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        title="Servicios"
        showBackButton
        backButtonHref="/dashboard"
        backButtonText="Dashboard"
      />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Gestión de Servicios</CardTitle>
                <CardDescription>
                  Administra todos tus servicios
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" /> Exportar
                </Button>
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                >
                  <Plus className="h-4 w-4 mr-2" /> Nuevo Servicio
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-10"
                  placeholder="Buscar servicio..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48">
                <Select value={statusFilter} onValueChange={handleStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Activos</SelectItem>
                    <SelectItem value="inactive">Inactivos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === "cards" ? "default" : "ghost"}
                  onClick={() => setViewMode("cards")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  onClick={() => setViewMode("table")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Mostrando {filteredServices.length} de {services.length} servicios
            </p>
          </CardContent>
        </Card>

        {filteredServices.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              No hay servicios
            </CardContent>
          </Card>
        ) : viewMode === "cards" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((s) => (
              <Card key={s.id} className="hover:shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" /> {s.name}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="h-4 w-4" /> {s.durationMinutes}{" "}
                        minutos
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <DollarSign className="h-4 w-4" /> Q{s.price}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        {s ? (
                          <Eye className="h-4 w-4 text-green-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        )}
                        {s ? "Activo" : "Inactivo"}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(s)}>
                          <Edit className="h-4 w-4 mr-2" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(s)}>
                          {s ? (
                            <>
                              <EyeOff className="h-4 w-4 mr-2" /> Desactivar
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-2" /> Activar
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(s.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Duración</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>{s.name}</TableCell>
                      <TableCell>{s.durationMinutes} min</TableCell>
                      <TableCell>Q{s.price}</TableCell>
                      <TableCell>{s ? "Activo" : "Inactivo"}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEdit(s)}>
                              <Edit className="h-4 w-4 mr-2" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(s)}
                            >
                              {s ? (
                                <>
                                  <EyeOff className="h-4 w-4 mr-2" /> Desactivar
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4 mr-2" /> Activar
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(s.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Diálogos del formulario */}
        <ServiceForm
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onSuccess={handleCreateSuccess}
        />

        <ServiceForm
          isOpen={isEditDialogOpen}
          onClose={closeEditDialog}
          service={selectedService}
          onSuccess={handleEditSuccess}
        />
      </div>
    </div>
  );
}
