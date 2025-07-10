"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataView, useDataView } from "@/components/data-view"
import { ClientForm } from "@/components/client-form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
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
} from "lucide-react"
import type { Client, ClientStats, Pagination, ClientFormData } from "@/app/types"

interface ClientsPageClientProps {
  clients: Client[]
  stats: ClientStats
  pagination: Pagination
}

export default function ClientsPageClient({ clients, stats, pagination }: ClientsPageClientProps) {
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [editingClient, setEditingClient] = useState<Client | null>(null)

  // Filtrar clientes
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm)

    const matchesStatus = statusFilter === "all" || client.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleCreateClient = (data: ClientFormData) => {
    console.log("Crear cliente:", data)
  }

  const handleEditClient = (data: ClientFormData) => {
    console.log("Editar cliente:", editingClient?.id, data)
    setEditingClient(null)
  }

  const handleDeleteClient = (client: Client) => {
    console.log("Eliminar cliente:", client.id)
  }

  const handleViewClient = (client: Client) => {
    console.log("Ver cliente:", client.id)
  }

  const handleCallClient = (client: Client) => {
    window.open(`tel:${client.phone}`, "_self")
  }

  const handleEmailClient = (client: Client) => {
    window.open(`mailto:${client.email}`, "_self")
  }

  const handleScheduleAppointment = (client: Client) => {
    console.log("Programar cita para:", client.id)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Activo", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" },
      inactive: { label: "Inactivo", className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300" },
      blocked: { label: "Bloqueado", className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" },
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getTagBadges = (tags: string[]) => {
    const colorMap = {
      VIP: "bg-purple-100 text-purple-800",
      Frecuente: "bg-blue-100 text-blue-800", 
      Nuevo: "bg-green-100 text-green-800",
      Regular: "bg-gray-100 text-gray-800",
      Leal: "bg-indigo-100 text-indigo-800",
      Joven: "bg-cyan-100 text-cyan-800",
      Problemático: "bg-red-100 text-red-800",
    }
    return tags.map(tag => (
      <Badge key={tag} className={`${colorMap[tag as keyof typeof colorMap] || "bg-gray-100 text-gray-800"} text-xs`}>
        {tag}
      </Badge>
    ))
  }

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 sm:h-4 sm:w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase()
  }

  const ActionsDropdown = ({ client }: { client: Client }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleViewClient(client)}>
          <Eye className="mr-2 h-4 w-4" />
          Ver Perfil
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setEditingClient(client)}>
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleCallClient(client)}>
          <Phone className="mr-2 h-4 w-4" />
          Llamar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleEmailClient(client)}>
          <Mail className="mr-2 h-4 w-4" />
          Enviar Email
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleScheduleAppointment(client)}>
          <Calendar className="mr-2 h-4 w-4" />
          Programar Cita
        </DropdownMenuItem>
        {client.status !== "active" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => handleDeleteClient(client)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )

  const ClientCard = ({ client }: { client: Client }) => (
    <Card className="card-hover transition-all duration-200 hover:shadow-lg">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
              <AvatarImage src={client.avatar} alt={client.name} />
              <AvatarFallback className="text-sm">{getInitials(client.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base sm:text-lg truncate">{client.name}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{client.email}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">{client.phone}</p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <ActionsDropdown client={client} />
          </div>
        </div>
        
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium">Estado:</span>
            {getStatusBadge(client.status)}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium">Citas:</span>
            <span className="text-xs sm:text-sm">{client.totalAppointments}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium">Total Gastado:</span>
            <span className="text-xs sm:text-sm font-semibold">€{client.totalSpent.toFixed(2)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium">Valoración:</span>
            <div className="flex items-center space-x-1">
              {getRatingStars(client.rating)}
            </div>
          </div>
          
          {client.tags && client.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {getTagBadges(client.tags)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  const ClientTable = () => (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                Contacto
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Citas
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                Valoración
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                Última Cita
              </th>
              <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredClients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 mr-2 sm:mr-3 flex-shrink-0">
                      <AvatarImage src={client.avatar} alt={client.name} />
                      <AvatarFallback className="text-xs">{getInitials(client.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {client.name}
                      </div>
                      <div className="sm:hidden text-xs text-gray-500 truncate">
                        {client.email}
                      </div>
                      {client.tags && client.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {getTagBadges(client.tags).slice(0, 2)}
                          {client.tags.length > 2 && (
                            <Badge className="bg-gray-100 text-gray-800 text-xs">
                              +{client.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                  <div className="text-xs sm:text-sm text-gray-900 dark:text-gray-100 truncate max-w-[150px]">
                    {client.email}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">{client.phone}</div>
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(client.status)}
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-gray-100 hidden md:table-cell">
                  {client.totalAppointments}
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">
                  €{client.totalSpent.toFixed(0)}
                  <span className="hidden sm:inline">.{client.totalSpent.toFixed(2).split('.')[1]}</span>
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                  <div className="flex items-center">
                    {getRatingStars(client.rating)}
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-gray-100 hidden xl:table-cell">
                  1-1-1
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                  <ActionsDropdown client={client} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mostrar información adicional en mobile cuando la tabla está oculta */}
      <div className="sm:hidden border-t bg-gray-50 dark:bg-gray-800 px-4 py-2">
        <p className="text-xs text-gray-500 text-center">
          Desliza horizontalmente para ver más información
        </p>
      </div>
    </div>
  )

  const ViewToggle = () => (
    <div className="flex items-center space-x-1 border rounded-lg p-1">
      <Button
        variant={viewMode === "cards" ? "default" : "ghost"}
        size="sm"
        onClick={() => setViewMode("cards")}
        className="text-xs sm:text-sm px-2 sm:px-3"
      >
        <Grid3X3 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
        <span className="hidden sm:inline">Tarjetas</span>
      </Button>
      <Button
        variant={viewMode === "table" ? "default" : "ghost"}
        size="sm"
        onClick={() => setViewMode("table")}
        className="text-xs sm:text-sm px-2 sm:px-3"
      >
        <List className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
        <span className="hidden sm:inline">Tabla</span>
      </Button>
    </div>
  )

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <ClientForm
            trigger={
              <Button className="btn-gradient-primary text-white text-xs sm:text-sm px-3 sm:px-4 py-2 flex-1 sm:flex-none">
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Nuevo Cliente</span>
                <span className="xs:hidden">Nuevo</span>
              </Button>
            }
            onSubmit={handleCreateClient}
          />
        </div>
        <ViewToggle />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Clientes</CardTitle>
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-muted-foreground">+{stats.newThisMonth} este mes</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Clientes Activos</CardTitle>
            <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-2xl font-bold">{stats.activeClients}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalClients > 0 ? Math.round((stats.activeClients / stats.totalClients) * 100) : 0}% del total
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Nuevos este Mes</CardTitle>
            <UserPlus className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-2xl font-bold">{stats.newThisMonth}</div>
            <p className="text-xs text-muted-foreground">Crecimiento mensual</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Valoración Promedio</CardTitle>
            <Star className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">De 5.0 estrellas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="px-4 sm:px-6 py-3 sm:py-6">
          <CardTitle className="text-sm sm:text-base">Filtros</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por nombre, email o teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="text-sm">
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

      {/* Clients Data */}
      <Card>
        <CardHeader className="px-4 sm:px-6 py-3 sm:py-6">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Users className="h-4 w-4 sm:h-5 sm:w-5" />
            Lista de Clientes
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
          {filteredClients.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <Users className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-semibold mb-2">No hay clientes</h3>
              <p className="text-sm text-muted-foreground mb-4 px-4">
                No se encontraron clientes que coincidan con los filtros aplicados.
              </p>
              <ClientForm
                trigger={
                  <Button className="text-sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Agregar Primer Cliente
                  </Button>
                }
                onSubmit={handleCreateClient}
              />
            </div>
          ) : (
            <>
              {viewMode === "cards" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
                  {filteredClients.map((client) => (
                    <ClientCard key={client.id} client={client} />
                  ))}
                </div>
              ) : (
                <ClientTable />
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Client Dialog */}
      {editingClient && (
        <ClientForm
          client={editingClient}
          trigger={<div />}
          onSubmit={handleEditClient}
          onCancel={() => setEditingClient(null)}
        />
      )}
    </div>
  )
}