"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  Calendar,
  Clock,
  DollarSign,
  Search,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Eye,
  EyeOff,
  Star,
  Grid3X3,
  List,
  Download,
  Stethoscope,
  Scissors,
  Wrench,
  GraduationCap,
  Heart,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Form data for create/edit
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    duration: "",
    price: "",
    color: "#3B82F6",
    isActive: true,
  })

  // Mock data - in real app this would come from API
  const services = [
    {
      id: 1,
      name: "Consulta General",
      description: "Consulta médica general para diagnóstico y seguimiento de pacientes",
      category: "medical",
      duration: 30,
      price: 50,
      color: "#3B82F6",
      isActive: true,
      totalAppointments: 156,
      totalRevenue: 7800,
      averageRating: 4.8,
      lastUsed: "2024-01-15",
      icon: Stethoscope,
    },
    {
      id: 2,
      name: "Limpieza Dental",
      description: "Limpieza profesional y revisión dental completa",
      category: "dental",
      duration: 45,
      price: 75,
      color: "#10B981",
      isActive: true,
      totalAppointments: 89,
      totalRevenue: 6675,
      averageRating: 4.9,
      lastUsed: "2024-01-14",
      icon: Stethoscope,
    },
    {
      id: 3,
      name: "Corte y Peinado",
      description: "Corte de cabello y peinado profesional para hombres y mujeres",
      category: "beauty",
      duration: 60,
      price: 40,
      color: "#F59E0B",
      isActive: true,
      totalAppointments: 234,
      totalRevenue: 9360,
      averageRating: 4.7,
      lastUsed: "2024-01-15",
      icon: Scissors,
    },
    {
      id: 4,
      name: "Terapia Física",
      description: "Sesión de rehabilitación y terapia física especializada",
      category: "therapy",
      duration: 90,
      price: 100,
      color: "#8B5CF6",
      isActive: true,
      totalAppointments: 67,
      totalRevenue: 6700,
      averageRating: 4.9,
      lastUsed: "2024-01-13",
      icon: Heart,
    },
    {
      id: 5,
      name: "Consulta Especializada",
      description: "Consulta con especialista para casos complejos",
      category: "medical",
      duration: 45,
      price: 120,
      color: "#EF4444",
      isActive: true,
      totalAppointments: 43,
      totalRevenue: 5160,
      averageRating: 4.8,
      lastUsed: "2024-01-12",
      icon: Stethoscope,
    },
    {
      id: 6,
      name: "Revisión Rutinaria",
      description: "Chequeo médico rutinario y preventivo",
      category: "medical",
      duration: 30,
      price: 60,
      color: "#06B6D4",
      isActive: false,
      totalAppointments: 28,
      totalRevenue: 1680,
      averageRating: 4.6,
      lastUsed: "2024-01-08",
      icon: Stethoscope,
    },
    {
      id: 7,
      name: "Manicure y Pedicure",
      description: "Cuidado completo de uñas de manos y pies",
      category: "beauty",
      duration: 75,
      price: 35,
      color: "#EC4899",
      isActive: true,
      totalAppointments: 145,
      totalRevenue: 5075,
      averageRating: 4.8,
      lastUsed: "2024-01-14",
      icon: Scissors,
    },
    {
      id: 8,
      name: "Reparación Express",
      description: "Servicio rápido de reparación y mantenimiento",
      category: "maintenance",
      duration: 45,
      price: 80,
      color: "#F97316",
      isActive: true,
      totalAppointments: 92,
      totalRevenue: 7360,
      averageRating: 4.5,
      lastUsed: "2024-01-15",
      icon: Wrench,
    },
  ]

  const categories = [
    { id: "medical", name: "Médico", icon: Stethoscope, color: "text-blue-600" },
    { id: "dental", name: "Dental", icon: Stethoscope, color: "text-green-600" },
    { id: "beauty", name: "Belleza", icon: Scissors, color: "text-pink-600" },
    { id: "therapy", name: "Terapia", icon: Heart, color: "text-purple-600" },
    { id: "maintenance", name: "Mantenimiento", icon: Wrench, color: "text-orange-600" },
    { id: "education", name: "Educación", icon: GraduationCap, color: "text-indigo-600" },
  ]

  // Filter services
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || service.category === categoryFilter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && service.isActive) ||
      (statusFilter === "inactive" && !service.isActive)

    return matchesSearch && matchesCategory && matchesStatus
  })

  // Stats
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
      value: services.reduce((sum, s) => sum + s.totalAppointments, 0).toString(),
      icon: Calendar,
      color: "text-orange-600",
    },
  ]

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("Creating service:", formData)
    setIsLoading(false)
    setIsCreateDialogOpen(false)
    resetForm()
  }

  const handleEditService = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("Editing service:", { id: selectedService?.id, ...formData })
    setIsLoading(false)
    setIsEditDialogOpen(false)
    resetForm()
  }

  const handleDeleteService = async (serviceId: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este servicio?")) {
      console.log("Deleting service:", serviceId)
    }
  }

  const handleToggleStatus = async (serviceId: number) => {
    console.log("Toggling status for service:", serviceId)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      duration: "",
      price: "",
      color: "#3B82F6",
      isActive: true,
    })
    setSelectedService(null)
  }

  const openEditDialog = (service: any) => {
    setSelectedService(service)
    setFormData({
      name: service.name,
      description: service.description,
      category: service.category,
      duration: service.duration.toString(),
      price: service.price.toString(),
      color: service.color,
      isActive: service.isActive,
    })
    setIsEditDialogOpen(true)
  }

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || categoryId
  }

  const getCategoryIcon = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.icon || Zap
  }

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
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-800 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
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
                <CardTitle>Gestión de Servicios</CardTitle>
                <CardDescription>Administra todos los servicios de tu negocio</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Servicio
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <form onSubmit={handleCreateService}>
                      <DialogHeader>
                        <DialogTitle>Crear Nuevo Servicio</DialogTitle>
                        <DialogDescription>Completa la información del nuevo servicio</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Nombre *
                          </Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="col-span-3"
                            placeholder="Nombre del servicio"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="category" className="text-right">
                            Categoría *
                          </Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) => setFormData({ ...formData, category: value })}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Seleccionar categoría" />
                            </SelectTrigger>
                            <SelectContent>
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
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="duration" className="text-right">
                            Duración *
                          </Label>
                          <Input
                            id="duration"
                            type="number"
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            className="col-span-3"
                            placeholder="Minutos"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="price" className="text-right">
                            Precio *
                          </Label>
                          <Input
                            id="price"
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="col-span-3"
                            placeholder="0.00"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="color" className="text-right">
                            Color
                          </Label>
                          <Input
                            id="color"
                            type="color"
                            value={formData.color}
                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                            className="col-span-3 h-10"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4">
                          <Label htmlFor="description" className="text-right">
                            Descripción
                          </Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="col-span-3"
                            placeholder="Descripción del servicio"
                            rows={3}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? "Creando..." : "Crear Servicio"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar servicios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="w-full md:w-48">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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
              <div className="w-full md:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
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
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Mostrando {filteredServices.length} de {services.length} servicios
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Services Grid/List */}
        {filteredServices.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No se encontraron servicios</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No hay servicios que coincidan con los filtros seleccionados.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primer Servicio
              </Button>
            </CardContent>
          </Card>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => {
              const IconComponent = getCategoryIcon(service.category)
              return (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: `${service.color}20`, color: service.color }}
                        >
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                          <Badge variant="secondary" className="text-xs">
                            {getCategoryName(service.category)}
                          </Badge>
                        </div>
                      </div>
                      <Badge variant={service.isActive ? "default" : "secondary"}>
                        {service.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{service.description}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{service.duration} min</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span>${service.price}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                      <div className="text-center">
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {service.totalAppointments}
                        </p>
                        <p className="text-xs text-gray-500">Citas</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-green-600">${service.totalRevenue.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Ingresos</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-semibold">{service.averageRating}</span>
                        </div>
                        <p className="text-xs text-gray-500">Rating</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-gray-500">Último uso: {service.lastUsed}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => openEditDialog(service)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(service.id)}>
                            {service.isActive ? (
                              <>
                                <EyeOff className="h-4 w-4 mr-2" />
                                Desactivar
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4 mr-2" />
                                Activar
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteService(service.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredServices.map((service) => {
              const IconComponent = getCategoryIcon(service.category)
              return (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: `${service.color}20`, color: service.color }}
                      >
                        <IconComponent className="h-6 w-6" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">{service.name}</h3>
                          <Badge variant={service.isActive ? "default" : "secondary"}>
                            {service.isActive ? "Activo" : "Inactivo"}
                          </Badge>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{service.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Categoría:</span>
                            <p className="font-medium">{getCategoryName(service.category)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Duración:</span>
                            <p className="font-medium">{service.duration} min</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Precio:</span>
                            <p className="font-medium">${service.price}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Citas:</span>
                            <p className="font-medium">{service.totalAppointments}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Ingresos:</span>
                            <p className="font-medium text-green-600">${service.totalRevenue.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Rating:</span>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="font-medium">{service.averageRating}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(service)}>
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
                            <DropdownMenuItem onClick={() => handleToggleStatus(service.id)}>
                              {service.isActive ? (
                                <>
                                  <EyeOff className="h-4 w-4 mr-2" />
                                  Desactivar
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Activar
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteService(service.id)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleEditService}>
              <DialogHeader>
                <DialogTitle>Editar Servicio</DialogTitle>
                <DialogDescription>Modifica la información del servicio</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Nombre *
                  </Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-category" className="text-right">
                    Categoría *
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
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
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-duration" className="text-right">
                    Duración *
                  </Label>
                  <Input
                    id="edit-duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-price" className="text-right">
                    Precio *
                  </Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-color" className="text-right">
                    Color
                  </Label>
                  <Input
                    id="edit-color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="col-span-3 h-10"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="edit-description" className="text-right">
                    Descripción
                  </Label>
                  <Textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
