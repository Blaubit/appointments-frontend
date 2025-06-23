"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { DataView, useDataView } from "@/components/data-view"
import {
  Search,
  Plus,
  Filter,
  Download,
  MoreHorizontal,
  Phone,
  Mail,
  Calendar,
  User,
  Users,
  TrendingUp,
  Star,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Activo"
      case "inactive":
        return "Inactivo"
      default:
        return status
    }
  }

  // Componente de tarjeta para cada cliente
  const ClientCard = (client: any) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={client.avatar || "/placeholder.svg"} alt={client.name} />
              <AvatarFallback>
                {client.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{client.name}</CardTitle>
              <CardDescription className="text-sm">{client.totalAppointments} citas</CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                Ver detalles
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageSquare className="h-4 w-4 mr-2" />
                Contactar
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge className={getStatusColor(client.status)}>{getStatusText(client.status)}</Badge>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{client.rating}</span>
          </div>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Mail className="h-3 w-3" />
            <span className="truncate">{client.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-3 w-3" />
            <span>{client.phone}</span>
          </div>
          {client.nextAppointment && (
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              <span>Próxima: {new Date(client.nextAppointment).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1">
          {client.tags.map((tag: string) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <Separator />

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total gastado:</span>
          <span className="font-medium">€{client.totalSpent}</span>
        </div>
      </CardContent>
    </Card>
  )

  // Definición de columnas para la tabla
  const columns = [
    {
      key: "name",
      label: "Cliente",
      sortable: true,
      render: (client: any) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={client.avatar || "/placeholder.svg"} alt={client.name} />
            <AvatarFallback className="text-xs">
              {client.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{client.name}</div>
            <div className="text-sm text-muted-foreground">
              Cliente desde {new Date(client.joinDate).toLocaleDateString()}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      label: "Contacto",
      render: (client: any) => (
        <div className="space-y-1">
          <div className="text-sm">{client.email}</div>
          <div className="text-sm text-muted-foreground">{client.phone}</div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Estado",
      sortable: true,
      render: (client: any) => <Badge className={getStatusColor(client.status)}>{getStatusText(client.status)}</Badge>,
    },
    {
      key: "totalAppointments",
      label: "Citas",
      sortable: true,
      render: (client: any) => (
        <div className="text-sm">
          <div>{client.totalAppointments} total</div>
          {client.nextAppointment && (
            <div className="text-muted-foreground">
              Próxima: {new Date(client.nextAppointment).toLocaleDateString()}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "totalSpent",
      label: "Total",
      sortable: true,
      render: (client: any) => <div className="font-medium">€{client.totalSpent}</div>,
    },
    {
      key: "rating",
      label: "Valoración",
      sortable: true,
      render: (client: any) => (
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className="text-sm">{client.rating}</span>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Acciones",
      render: (client: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="h-4 w-4 mr-2" />
              Ver detalles
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MessageSquare className="h-4 w-4 mr-2" />
              Contactar
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <Header
        title="Clientes"
        subtitle="Gestiona tu base de clientes"
        showBackButton={true}
        backButtonText="Dashboard"
        backButtonHref="/dashboard"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Cliente
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
                  <DialogDescription>Completa la información del cliente para agregarlo al sistema.</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input id="name" placeholder="Ej: María González" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="maria@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" placeholder="+34 612 345 678" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Fecha de nacimiento</Label>
                    <Input id="birthDate" type="date" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input id="address" placeholder="Calle Mayor 123, Madrid" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="notes">Notas</Label>
                    <Textarea id="notes" placeholder="Información adicional sobre el cliente..." />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setIsAddDialogOpen(false)}>Guardar Cliente</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalClients}</div>
            <p className="text-xs text-muted-foreground">+12% desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.activeClients}</div>
            <p className="text-xs text-muted-foreground">91% del total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nuevos Este Mes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.newThisMonth}</div>
            <p className="text-xs text-muted-foreground">+5 esta semana</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valoración Promedio</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.averageRating}</div>
            <p className="text-xs text-muted-foreground">⭐ Excelente servicio</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar clientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ViewToggle />
          </div>
        </CardHeader>
        <CardContent>
          <DataView
            data={filteredClients}
            viewMode={viewMode}
            columns={columns}
            cardComponent={ClientCard}
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
  )
}
