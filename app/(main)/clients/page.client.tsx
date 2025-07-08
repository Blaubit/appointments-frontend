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
      <Badge key={tag} className={colorMap[tag as keyof typeof colorMap] || "bg-gray-100 text-gray-800"}>
        {tag}
      </Badge>
    ))
  }

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
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
      <DropdownMenuContent align="end">
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
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={client.avatar} alt={client.name} />
              <AvatarFallback>{getInitials(client.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{client.name}</h3>
              <p className="text-sm text-muted-foreground">{client.email}</p>
              <p className="text-sm text-muted-foreground">{client.phone}</p>
            </div>
          </div>
          <ActionsDropdown client={client} />
        </div>
        
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Estado:</span>
            {getStatusBadge(client.status)}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Citas:</span>
            <span className="text-sm">{client.totalAppointments}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Gastado:</span>
            <span className="text-sm font-semibold">€{client.totalSpent.toFixed(2)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Valoración:</span>
            <div className="flex items-center">
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
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contacto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Citas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Gastado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valoración
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Última Cita
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredClients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={client.avatar} alt={client.name} />
                      <AvatarFallback>{getInitials(client.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {client.name}
                      </div>
                      {client.tags && client.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {getTagBadges(client.tags)}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-gray-100">{client.email}</div>
                  <div className="text-sm text-gray-500">{client.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(client.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {client.totalAppointments}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  €{client.totalSpent.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getRatingStars(client.rating)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                 1-1-1
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <ActionsDropdown client={client} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const ViewToggle = () => (
    <div className="flex items-center space-x-2 border rounded-lg p-1">
      <Button
        variant={viewMode === "cards" ? "default" : "ghost"}
        size="sm"
        onClick={() => setViewMode("cards")}
      >
        <Grid3X3 className="h-4 w-4 mr-1" />
        Tarjetas
      </Button>
      <Button
        variant={viewMode === "table" ? "default" : "ghost"}
        size="sm"
        onClick={() => setViewMode("table")}
      >
        <List className="h-4 w-4 mr-1" />
        Tabla
      </Button>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
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
        <ViewToggle />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-muted-foreground">+{stats.newThisMonth} este mes</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeClients}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalClients > 0 ? Math.round((stats.activeClients / stats.totalClients) * 100) : 0}% del total
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nuevos este Mes</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newThisMonth}</div>
            <p className="text-xs text-muted-foreground">Crecimiento mensual</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valoración Promedio</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">De 5.0 estrellas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por nombre, email o teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
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

      {/* Clients Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Clientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredClients.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay clientes</h3>
              <p className="text-muted-foreground mb-4">
                No se encontraron clientes que coincidan con los filtros aplicados.
              </p>
              <ClientForm
                trigger={
                  <Button>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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