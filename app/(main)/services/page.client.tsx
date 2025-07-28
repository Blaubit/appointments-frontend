"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { DataView, useDataView } from "@/components/data-view";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  DollarSign,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Download,
  Stethoscope,
  Scissors,
  Wrench,
  GraduationCap,
  Heart,
  Zap,
  Filter,
  X,
} from "lucide-react";
import { Header } from "@/components/header";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type Service = {
  id: number;
  name: string;
  description: string;
  category: string;
  duration: number;
  price: number;
  color: string;
  isActive: boolean;
  totalAppointments: number;
  totalRevenue: number;
  averageRating: number;
  lastUsed: string;
};

type Pagination = {
  totalItems: number;
  totalPages: number;
  page: number;
};

type Props = {
  services: Service[];
  pagination?: Pagination;
};

export default function PageClient({
  services,
  pagination = {
    totalItems: 1,
    totalPages: 1,
    page: 1,
  },
}: Props) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const { viewMode, ViewToggle } = useDataView("cards");

  // Form data for create/edit
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    duration: "",
    price: "",
    color: "#3B82F6",
    isActive: true,
  });

  const categories = [
    {
      id: "medical",
      name: "Médico",
      icon: Stethoscope,
      color: "text-blue-600",
    },
    {
      id: "dental",
      name: "Dental",
      icon: Stethoscope,
      color: "text-green-600",
    },
    { id: "beauty", name: "Belleza", icon: Scissors, color: "text-pink-600" },
    { id: "therapy", name: "Terapia", icon: Heart, color: "text-purple-600" },
    {
      id: "maintenance",
      name: "Mantenimiento",
      icon: Wrench,
      color: "text-orange-600",
    },
    {
      id: "education",
      name: "Educación",
      icon: GraduationCap,
      color: "text-indigo-600",
    },
  ];

  // Stats calculated from services
  const stats = [
    {
      title: "Total Servicios",
      value: services.length.toString(),
      icon: Zap,
      color: "text-blue-600",
    },
    {
      title: "Servicios Activos",
      value: services.filter((s) => s.isActive).length.toString(),
      icon: Eye,
      color: "text-green-600",
    },
    {
      title: "Ingresos Totales",
      value: `$${services.reduce((sum, s) => sum + s.totalRevenue, 0).toLocaleString()}`,
      icon: DollarSign,
      color: "text-purple-600",
    },
    {
      title: "Citas Totales",
      value: services
        .reduce((sum, s) => sum + s.totalAppointments, 0)
        .toString(),
      icon: Calendar,
      color: "text-orange-600",
    },
  ];

  // Client-side filtering for immediate feedback
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || service.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && service.isActive) ||
      (statusFilter === "inactive" && !service.isActive);

    return matchesSearch && matchesCategory && matchesStatus;
  });

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

  const handleCategoryFilter = (value: string) => {
    setCategoryFilter(value);
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    if (value !== "all") {
      params.set("category", value);
    } else {
      params.delete("category");
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

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Creating service:", formData);
    setIsLoading(false);
    setIsCreateDialogOpen(false);
    resetForm();
    // In real app, would refresh data or optimistically update
    router.refresh();
  };

  const handleEditService = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Editing service:", { id: selectedService?.id, ...formData });
    setIsLoading(false);
    setIsEditDialogOpen(false);
    resetForm();
    router.refresh();
  };

  const handleDeleteService = async (serviceId: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este servicio?")) {
      console.log("Deleting service:", serviceId);
      router.refresh();
    }
  };

  const handleToggleStatus = async (serviceId: number) => {
    console.log("Toggling status for service:", serviceId);
    router.refresh();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      duration: "",
      price: "",
      color: "#3B82F6",
      isActive: true,
    });
    setSelectedService(null);
  };

  const openEditDialog = (service: any) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      description: service.description,
      category: service.category,
      duration: service.duration.toString(),
      price: service.price.toString(),
      color: service.color,
      isActive: service.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || categoryId;
  };

  const getCategoryIcon = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.icon || Zap;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setStatusFilter("all");
    const url = new URL(window.location.href);
    const params = new URLSearchParams();
    router.push(`${url.pathname}?${params.toString()}`);
  };

  const hasActiveFilters =
    searchTerm || categoryFilter !== "all" || statusFilter !== "all";

  // Mobile filters content
  const FiltersContent = () => (
    <div className="space-y-4">
      {/* Search */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Buscar</Label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar servicios..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Categoría</Label>
        <Select value={categoryFilter} onValueChange={handleCategoryFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-center space-x-2">
                  <category.icon className={`h-4 w-4 ${category.color}`} />
                  <span>{category.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status Filter */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Estado</Label>
        <Select value={statusFilter} onValueChange={handleStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="active">Activos</SelectItem>
            <SelectItem value="inactive">Inactivos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          <X className="h-4 w-4 mr-2" />
          Limpiar filtros
        </Button>
      )}
    </div>
  );

  // Configuración de campos para DataView
  const serviceFields = [
    {
      key: "name",
      label: "Servicio",
      type: "custom" as const,
      primary: true,
      sortable: true,
      render: (value: any, service: any) => {
        const IconComponent = getCategoryIcon(service.category);
        return (
          <div className="flex items-center space-x-3">
            <div
              className="flex-shrink-0 p-2 rounded-lg"
              style={{
                backgroundColor: `${service.color}20`,
                color: service.color,
              }}
            >
              <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-sm sm:text-base truncate">
                {service.name}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground truncate">
                {getCategoryName(service.category)}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "description",
      label: "Descripción",
      type: "custom" as const,
      showInCard: false,
      render: (value: any) => (
        <div className="max-w-xs">
          <p className="text-sm line-clamp-2">{value}</p>
        </div>
      ),
    },
    {
      key: "category",
      label: "Categoría",
      type: "custom" as const,
      showInTable: false,
      render: (value: string) => {
        const category = categories.find((c) => c.id === value);
        if (!category) return <span className="text-sm">{value}</span>;

        return (
          <Badge
            className={`${category.color.replace("text-", "bg-").replace("-600", "-100")} ${category.color.replace("-600", "-800")} text-xs`}
          >
            {category.name}
          </Badge>
        );
      },
    },
    {
      key: "duration",
      label: "Duración",
      type: "duration" as const,
      sortable: true,
    },
    {
      key: "price",
      label: "Precio",
      type: "currency" as const,
      sortable: true,
    },
    {
      key: "totalAppointments",
      label: "Citas",
      type: "custom" as const,
      sortable: true,
      render: (value: any) => (
        <div className="text-center">
          <div className="font-medium text-sm">{value}</div>
          <div className="text-xs text-muted-foreground">total</div>
        </div>
      ),
    },
    {
      key: "totalRevenue",
      label: "Ingresos",
      type: "currency" as const,
      sortable: true,
      showInTable: false,
    },
    {
      key: "averageRating",
      label: "Rating",
      type: "rating" as const,
      sortable: true,
    },
    {
      key: "isActive",
      label: "Estado",
      type: "badge" as const,
      sortable: true,
      render: (value: boolean) => (
        <Badge
          className={`text-xs ${value ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
        >
          {value ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
    {
      key: "lastUsed",
      label: "Último uso",
      type: "date" as const,
      showInCard: true,
      showInTable: false,
    },
  ];

  // Configuración de acciones
  const serviceActions = [
    {
      label: "Editar",
      icon: Edit,
      onClick: (service: any) => openEditDialog(service),
    },
    {
      label: "Activar",
      icon: Eye,
      onClick: (service: any) => handleToggleStatus(service.id),
      show: (service: any) => !service.isActive,
    },
    {
      label: "Desactivar",
      icon: EyeOff,
      onClick: (service: any) => handleToggleStatus(service.id),
      show: (service: any) => service.isActive,
    },
    {
      label: "Eliminar",
      icon: Trash2,
      onClick: (service: any) => handleDeleteService(service.id),
      variant: "destructive" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header
        title="Servicios"
        showBackButton={true}
        backButtonText="Dashboard"
        backButtonHref="/dashboard"
        user={{
          name: "Dr. Roberto Silva",
          email: "roberto.silva@email.com",
          role: "Médico General",
          avatar: "/Avatar1.png?height=32&width=32",
          initials: "DR",
        }}
        notifications={{
          count: 3,
        }}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                      {stat.title}
                    </p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white truncate">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`flex-shrink-0 p-2 sm:p-3 rounded-full bg-gray-100 dark:bg-gray-800 ${stat.color} ml-2`}
                  >
                    <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Card */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div className="min-w-0 flex-1">
                <CardTitle className="text-lg sm:text-xl lg:text-2xl">
                  Gestión de Servicios
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Administra todos los servicios de tu negocio
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  <Download className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Exportar</span>
                  <span className="sm:hidden">Export</span>
                </Button>
                <Dialog
                  open={isCreateDialogOpen}
                  onOpenChange={setIsCreateDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Nuevo Servicio</span>
                      <span className="sm:hidden">Nuevo</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto">
                    <form onSubmit={handleCreateService}>
                      <DialogHeader>
                        <DialogTitle>Crear Nuevo Servicio</DialogTitle>
                        <DialogDescription>
                          Completa la información del nuevo servicio
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                          <Label
                            htmlFor="name"
                            className="sm:text-right text-sm font-medium"
                          >
                            Nombre *
                          </Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            className="sm:col-span-3"
                            placeholder="Nombre del servicio"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                          <Label
                            htmlFor="category"
                            className="sm:text-right text-sm font-medium"
                          >
                            Categoría *
                          </Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) =>
                              setFormData({ ...formData, category: value })
                            }
                          >
                            <SelectTrigger className="sm:col-span-3">
                              <SelectValue placeholder="Seleccionar categoría" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                >
                                  <div className="flex items-center space-x-2">
                                    <category.icon
                                      className={`h-4 w-4 ${category.color}`}
                                    />
                                    <span>{category.name}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                          <Label
                            htmlFor="duration"
                            className="sm:text-right text-sm font-medium"
                          >
                            Duración *
                          </Label>
                          <Input
                            id="duration"
                            type="number"
                            value={formData.duration}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                duration: e.target.value,
                              })
                            }
                            className="sm:col-span-3"
                            placeholder="Minutos"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                          <Label
                            htmlFor="price"
                            className="sm:text-right text-sm font-medium"
                          >
                            Precio *
                          </Label>
                          <Input
                            id="price"
                            type="number"
                            value={formData.price}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                price: e.target.value,
                              })
                            }
                            className="sm:col-span-3"
                            placeholder="0.00"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                          <Label
                            htmlFor="color"
                            className="sm:text-right text-sm font-medium"
                          >
                            Color
                          </Label>
                          <Input
                            id="color"
                            type="color"
                            value={formData.color}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                color: e.target.value,
                              })
                            }
                            className="sm:col-span-3 h-10"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-2 sm:gap-4">
                          <Label
                            htmlFor="description"
                            className="sm:text-right text-sm font-medium"
                          >
                            Descripción
                          </Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                description: e.target.value,
                              })
                            }
                            className="sm:col-span-3"
                            placeholder="Descripción del servicio"
                            rows={3}
                          />
                        </div>
                      </div>
                      <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsCreateDialogOpen(false)}
                          className="w-full sm:w-auto"
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full sm:w-auto"
                        >
                          {isLoading ? "Creando..." : "Crear Servicio"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            {/* Desktop Filters */}
            <div className="hidden lg:flex gap-4 mb-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar servicios..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="w-48">
                <Select
                  value={categoryFilter}
                  onValueChange={handleCategoryFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center space-x-2">
                          <category.icon
                            className={`h-4 w-4 ${category.color}`}
                          />
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="w-48">
                <Select value={statusFilter} onValueChange={handleStatusFilter}>
                  <SelectTrigger>
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

            {/* Mobile Filters */}
            <div className="lg:hidden mb-4">
              <div className="flex gap-2">
                {/* Mobile Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Mobile Filters Sheet */}
                <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filtros
                      {hasActiveFilters && (
                        <span className="ml-1 bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5">
                          {
                            [
                              searchTerm,
                              categoryFilter !== "all",
                              statusFilter !== "all",
                            ].filter(Boolean).length
                          }
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px]">
                    <SheetHeader>
                      <SheetTitle>Filtros</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FiltersContent />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Mobile View Toggle */}
                <ViewToggle />
              </div>
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <span className="hidden sm:inline">Mostrando </span>
                {filteredServices.length} de {services.length} servicios
              </p>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs sm:text-sm"
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Limpiar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Services Grid/List */}
        <DataView
          data={filteredServices}
          fields={serviceFields}
          actions={serviceActions}
          viewMode={viewMode}
          emptyState={{
            icon: <Zap className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />,
            title: "No se encontraron servicios",
            description:
              "No hay servicios que coincidan con los filtros seleccionados.",
            action: (
              <Button onClick={() => setIsCreateDialogOpen(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Crear Primer Servicio
              </Button>
            ),
          }}
        />

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleEditService}>
              <DialogHeader>
                <DialogTitle>Editar Servicio</DialogTitle>
                <DialogDescription>
                  Modifica la información del servicio
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label
                    htmlFor="edit-name"
                    className="sm:text-right text-sm font-medium"
                  >
                    Nombre *
                  </Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="sm:col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label
                    htmlFor="edit-category"
                    className="sm:text-right text-sm font-medium"
                  >
                    Categoría *
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger className="sm:col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center space-x-2">
                            <category.icon
                              className={`h-4 w-4 ${category.color}`}
                            />
                            <span>{category.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label
                    htmlFor="edit-duration"
                    className="sm:text-right text-sm font-medium"
                  >
                    Duración *
                  </Label>
                  <Input
                    id="edit-duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    className="sm:col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label
                    htmlFor="edit-price"
                    className="sm:text-right text-sm font-medium"
                  >
                    Precio *
                  </Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="sm:col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label
                    htmlFor="edit-color"
                    className="sm:text-right text-sm font-medium"
                  >
                    Color
                  </Label>
                  <Input
                    id="edit-color"
                    type="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className="sm:col-span-3 h-10"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-2 sm:gap-4">
                  <Label
                    htmlFor="edit-description"
                    className="sm:text-right text-sm font-medium"
                  >
                    Descripción
                  </Label>
                  <Textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="sm:col-span-3"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="w-full sm:w-auto"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  {isLoading ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
