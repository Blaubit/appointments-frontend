"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DataView, useDataView } from "@/components/data-view"
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
} from "lucide-react"

// Datos de ejemplo para clientes
const mockClients = [
  {
    id: 1,
    name: "María González",
    email: "maria.gonzalez@email.com",
    phone: "+34 612 345 678",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "active",
    totalAppointments: 12,
    lastAppointment: "2024-01-15",
    nextAppointment: "2024-01-25",
    totalSpent: 850,
    rating: 4.8,
    notes: "Cliente preferencial, siempre puntual",
    address: "Calle Mayor 123, Madrid",
    birthDate: "1985-03-15",
    joinDate: "2023-06-10",
    preferredServices: ["Corte", "Tinte"],
    tags: ["VIP", "Frecuente"],
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@email.com",
    phone: "+34 687 654 321",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "active",
    totalAppointments: 8,
    lastAppointment: "2024-01-10",
    nextAppointment: null,
    totalSpent: 420,
    rating: 4.5,
    notes: "Prefiere citas por la mañana",
    address: "Avenida de la Paz 45, Barcelona",
    birthDate: "1990-07-22",
    joinDate: "2023-08-15",
    preferredServices: ["Corte", "Barba"],
    tags: ["Regular"],
  },
  {
    id: 3,
    name: "Ana Martín",
    email: "ana.martin@email.com",
    phone: "+34 654 987 321",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "inactive",
    totalAppointments: 3,
    lastAppointment: "2023-11-20",
    nextAppointment: null,
    totalSpent: 180,
    rating: 4.2,
    notes: "Cliente nueva, necesita seguimiento",
    address: "Plaza del Sol 8, Valencia",
    birthDate: "1992-12-03",
    joinDate: "2023-10-05",
    preferredServices: ["Manicura"],
    tags: ["Nuevo"],
  },
  {
    id: 4,
    name: "David López",
    email: "david.lopez@email.com",
    phone: "+34 698 123 456",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "active",
    totalAppointments: 15,
    lastAppointment: "2024-01-18",
    nextAppointment: "2024-01-28",
    totalSpent: 1200,
    rating: 5.0,
    notes: "Cliente muy satisfecho, recomienda a otros",
    address: "Calle de la Rosa 67, Sevilla",
    birthDate: "1988-05-10",
    joinDate: "2023-04-20",
    preferredServices: ["Corte", "Tratamiento"],
    tags: ["VIP", "Embajador"],
  },
]

const mockStats = {
  totalClients: 156,
  activeClients: 142,
  newThisMonth: 23,
  averageRating: 4.6,
}

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { viewMode, ViewToggle } = useDataView("cards")

  const filteredClients = mockClients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || client.status === statusFilter
    return matchesSearch && matchesStatus
  })

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
  ]

  // Configuración de acciones
  const clientActions = [
    {
      label: "Ver detalles",
      icon: Eye,
      onClick: (client: any) => console.log("Ver detalles", client),
    },
    {
      label: "Editar",
      icon: Edit,
      onClick: (client: any) => console.log("Editar", client),
    },
    {
      label: "Contactar",
      icon: MessageSquare,
      onClick: (client: any) => console.log("Contactar", client),
    },
    {
      label: "Eliminar",
      icon: Trash2,
      onClick: (client: any) => console.log("Eliminar", client),
      variant: "destructive" as const,
    },
  ]

  return (
 <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Header
        title="Clientes"
        showBackButton={true}
        backButtonText="Dashboard"
        backButtonHref="/dashboard"
      />
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="space-y-6">
      

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{mockStats.totalClients}</div>
            <p className="text-xs text-muted-foreground">+12% desde el mes pasado</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Clientes Activos</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{mockStats.activeClients}</div>
            <p className="text-xs text-muted-foreground">91% del total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Nuevos Este Mes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{mockStats.newThisMonth}</div>
            <p className="text-xs text-muted-foreground">+5 esta semana</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Valoración Promedio</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{mockStats.averageRating}</div>
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
                    <Button onClick={() => setIsAddDialogOpen(false)}>
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
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
              Mostrando {filteredClients.length} de {mockStats.totalClients} clientes
            </p>
          </div>
          
          <DataView
            data={filteredClients}
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
  )
}
