"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataView, useDataView } from "@/components/data-view"
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
} from "lucide-react"
import { Header } from "@/components/header"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

type Service = {
  id: number
  name: string
  description: string
  category: string
  duration: number
  price: number
  color: string
  isActive: boolean
  totalAppointments: number
  totalRevenue: number
  averageRating: number
  lastUsed: string
}

type Pagination = {
  totalItems: number
  totalPages: number
  page: number
}

type Props = {
  services: Service[]
  pagination?: Pagination
}

export default function PageClient({
  services,
  pagination = {
    totalItems: 1,
    totalPages: 1,
    page: 1,
  },
}: Props) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { viewMode, ViewToggle } = useDataView("cards")

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

  const categories = [
    { id: "medical", name: "Médico", icon: Stethoscope, color: "text-blue-600" },
    { id: "dental", name: "Dental", icon: Stethoscope, color: "text-green-600" },
    { id: "beauty", name: "Belleza", icon: Scissors, color: "text-pink-600" },
    { id: "therapy", name: "Terapia", icon: Heart, color: "text-purple-600" },
    { id: "maintenance", name: "Mantenimiento", icon: Wrench, color: "text-orange-600" },
    { id: "education", name: "Educación", icon: GraduationCap, color: "text-indigo-600" },
  ]

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
      value: services.reduce((sum, s) => sum + s.totalAppointments, 0).toString(),
      icon: Calendar,
      color: "text-orange-600",
    },
  ]

  // Client-side filtering for immediate feedback
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

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    const url = new URL(window.location.href)
    const params = new URLSearchParams(url.search)
    if (value) {
      params.set("search", value)
    } else {
      params.delete("search")
    }
    router.push(`${url.pathname}?${params.toString()}`)
  }

  const handleCategoryFilter = (value: string) => {
    setCategoryFilter(value)
    const url = new URL(window.location.href)
    const params = new URLSearchParams(url.search)
    if (value !== "all") {
      params.set("category", value)
    } else {
      params.delete("category")
    }
    router.push(`${url.pathname}?${params.toString()}`)
  }

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)
    const url = new URL(window.location.href)
    const params = new URLSearchParams(url.search)
    if (value !== "all") {
      params.set("status", value)
    } else {
      params.delete("status")
    }
    router.push(`${url.pathname}?${params.toString()}`)
  }

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("Creating service:", formData)
    setIsLoading(false)
    setIsCreateDialogOpen(false)
    resetForm()
    // In real app, would refresh data or optimistically update
    router.refresh()
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
    router.refresh()
  }

  const handleDeleteService = async (serviceId: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este servicio?")) {
      console.log("Deleting service:", serviceId)
      router.refresh()
    }
  }

  const handleToggleStatus = async (serviceId: number) => {
    console.log("Toggling status for service:", serviceId)
    router.refresh()
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

  // Configuración de campos para DataView
  const serviceFields = [
    {
      key: "name",
      label: "Servicio",
      type: "custom" as const,
      primary: true,
      sortable: true,
      render: (value: any, service: any) => {
        const IconComponent = getCategoryIcon(service.category)
        return (
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${service.color}20`, color: service.color }}>
              <IconComponent className="h-5 w-5" />
            </div>
            <div>
              <div className="font-medium">{service.name}</div>
              <div className="text-sm text-muted-foreground">{getCategoryName(service.category)}</div>
            </div>
          </div>
        )
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
        const category = categories.find((c) => c.id === value)
        if (!category) return <span>{value}</span>

        return (
          <Badge
            className={`${category.color.replace("text-", "bg-").replace("-600", "-100")} ${category.color.replace("-600", "-800")}`}
          >
            {category.name}
          </Badge>
        )
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
          <div className="font-medium">{value}</div>
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
        <Badge className={value ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
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
  ]

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
  ]

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
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="w-full md:w-48">
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
              <div className="w-full md:w-48">
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

            {/* Results count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Mostrando {filteredServices.length} de {services.length} servicios
              </p>
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
            icon: <Zap className="h-12 w-12 text-gray-400" />,
            title: "No se encontraron servicios",
            description: "No hay servicios que coincidan con los filtros seleccionados.",
            action: (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primer Servicio
              </Button>
            ),
          }}
        />

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
