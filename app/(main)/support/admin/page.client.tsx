"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUp,
  Minus,
  User,
  Building,
  Calendar,
  Send,
  Eye,
  BarChart3,
  TrendingUp,
  Users,
  Timer,
} from "lucide-react"
import type { Ticket, TicketStatus, TicketPriority, TicketStats } from "@/types/support"

// Mock data expandido
const mockStats: TicketStats = {
  total: 156,
  open: 23,
  inProgress: 18,
  waitingResponse: 12,
  resolved: 89,
  closed: 14,
  averageResponseTime: 45,
  averageResolutionTime: 180,
  satisfactionScore: 4.3,
}

const mockTickets: Ticket[] = [
  {
    id: "TK-001",
    title: "Error al cargar el calendario de citas",
    description:
      "El calendario no muestra las citas programadas para esta semana. Aparece un error 500 cuando intento acceder.",
    status: "open",
    priority: "high",
    category: "technical_issue",
    userId: "user-1",
    userName: "Dr. María González",
    userEmail: "maria.gonzalez@clinica.com",
    companyId: "comp-1",
    companyName: "Clínica San Rafael",
    attachments: [],
    comments: [
      {
        id: "comment-1",
        ticketId: "TK-001",
        authorId: "user-1",
        authorName: "Dr. María González",
        authorRole: "user",
        content: "El problema persiste desde ayer. Mis pacientes no pueden ver sus citas programadas.",
        isInternal: false,
        createdAt: "2024-01-15T11:30:00Z",
        updatedAt: "2024-01-15T11:30:00Z",
      },
    ],
    tags: ["calendario", "error-500", "urgente"],
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T11:30:00Z",
    lastResponseAt: "2024-01-15T11:30:00Z",
  },
  {
    id: "TK-002",
    title: "Consulta sobre facturación mensual",
    description: "Necesito información sobre los cargos del mes pasado. No recibí la factura por email.",
    status: "in_progress",
    priority: "medium",
    category: "billing",
    userId: "user-2",
    userName: "Dra. Ana Morales",
    userEmail: "ana.morales@consultorio.com",
    assignedToName: "Carlos Support",
    companyId: "comp-2",
    companyName: "Consultorio Morales",
    attachments: [],
    comments: [
      {
        id: "comment-2",
        ticketId: "TK-002",
        authorId: "support-1",
        authorName: "Carlos Support",
        authorRole: "support_agent",
        content: "Hola Dra. Morales, estoy revisando su facturación. Le enviaré los detalles en las próximas 2 horas.",
        isInternal: false,
        createdAt: "2024-01-14T14:20:00Z",
        updatedAt: "2024-01-14T14:20:00Z",
      },
    ],
    tags: ["facturación", "email"],
    createdAt: "2024-01-14T09:15:00Z",
    updatedAt: "2024-01-14T14:20:00Z",
    lastResponseAt: "2024-01-14T14:20:00Z",
  },
  {
    id: "TK-003",
    title: "Solicitud: Recordatorios por WhatsApp",
    description:
      "Me gustaría que se agregue la función de enviar recordatorios automáticos por WhatsApp a mis pacientes.",
    status: "waiting_response",
    priority: "low",
    category: "feature_request",
    userId: "user-3",
    userName: "Dr. Roberto Castillo",
    userEmail: "roberto.castillo@dental.com",
    assignedToName: "Laura Product",
    companyId: "comp-3",
    companyName: "Clínica Dental Castillo",
    attachments: [],
    comments: [
      {
        id: "comment-3",
        ticketId: "TK-003",
        authorId: "support-2",
        authorName: "Laura Product",
        authorRole: "support_agent",
        content:
          "Hola Dr. Castillo, esta función está en nuestro roadmap. ¿Podría decirnos qué tipo de recordatorios le gustaría enviar?",
        isInternal: false,
        createdAt: "2024-01-13T10:30:00Z",
        updatedAt: "2024-01-13T10:30:00Z",
      },
    ],
    tags: ["whatsapp", "recordatorios", "feature"],
    createdAt: "2024-01-13T16:45:00Z",
    updatedAt: "2024-01-14T11:30:00Z",
    lastResponseAt: "2024-01-13T10:30:00Z",
  },
  {
    id: "TK-004",
    title: "Error 500 al generar reportes",
    description: "Cuando intento generar el reporte mensual de pacientes, aparece un error 500 en la página.",
    status: "resolved",
    priority: "urgent",
    category: "bug_report",
    userId: "user-4",
    userName: "Dra. Patricia Herrera",
    userEmail: "patricia.herrera@medica.com",
    assignedToName: "Miguel Tech",
    companyId: "comp-4",
    companyName: "Centro Médico Herrera",
    attachments: [],
    comments: [
      {
        id: "comment-4",
        ticketId: "TK-004",
        authorId: "support-3",
        authorName: "Miguel Tech",
        authorRole: "support_agent",
        content: "Problema resuelto. Era un error en la consulta de base de datos. Ya está funcionando correctamente.",
        isInternal: false,
        createdAt: "2024-01-13T15:45:00Z",
        updatedAt: "2024-01-13T15:45:00Z",
      },
    ],
    tags: ["error-500", "reportes", "resuelto"],
    createdAt: "2024-01-12T08:20:00Z",
    updatedAt: "2024-01-13T15:45:00Z",
    resolvedAt: "2024-01-13T15:45:00Z",
    responseTime: 120,
    resolutionTime: 1905,
  },
]

const statusConfig = {
  open: { label: "Abierto", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300", icon: AlertCircle },
  in_progress: {
    label: "En Progreso",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    icon: Clock,
  },
  waiting_response: {
    label: "Esperando Respuesta",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    icon: MessageSquare,
  },
  resolved: {
    label: "Resuelto",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    icon: CheckCircle,
  },
  closed: { label: "Cerrado", color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300", icon: XCircle },
}

const priorityConfig = {
  low: { label: "Baja", color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300", icon: Minus },
  medium: { label: "Media", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300", icon: Minus },
  high: {
    label: "Alta",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    icon: ArrowUp,
  },
  urgent: { label: "Urgente", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300", icon: ArrowUp },
}

export default function AdminSupportPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all")
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | "all">("all")
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [newComment, setNewComment] = useState("")
  const [newStatus, setNewStatus] = useState<TicketStatus>("open")

  const filteredTickets = useMemo(() => {
    return mockTickets.filter((ticket) => {
      const matchesSearch =
        searchTerm === "" ||
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
      const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [searchTerm, statusFilter, priorityFilter])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-GT", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleStatusChange = (ticketId: string, newStatus: TicketStatus) => {
    // Aquí iría la lógica para actualizar el estado del ticket
    console.log(`Cambiando estado del ticket ${ticketId} a ${newStatus}`)
  }

  const handleAddComment = () => {
    if (!selectedTicket || !newComment.trim()) return

    // Aquí iría la lógica para agregar el comentario
    console.log(`Agregando comentario al ticket ${selectedTicket.id}: ${newComment}`)
    setNewComment("")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Panel de Administración - Tickets</h1>
          <p className="text-muted-foreground">Gestiona todos los tickets de soporte de tus clientes</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="overview" className="data-[state=active]:bg-background">
              <BarChart3 className="h-4 w-4 mr-2" />
              Resumen
            </TabsTrigger>
            <TabsTrigger value="tickets" className="data-[state=active]:bg-background">
              <MessageSquare className="h-4 w-4 mr-2" />
              Tickets
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-background">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analíticas
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Tickets</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{mockStats.total}</div>
                  <p className="text-xs text-muted-foreground">+12% desde el mes pasado</p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pendientes</CardTitle>
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {mockStats.open + mockStats.inProgress + mockStats.waitingResponse}
                  </div>
                  <p className="text-xs text-muted-foreground">Requieren atención</p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Tiempo Respuesta</CardTitle>
                  <Timer className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{mockStats.averageResponseTime}min</div>
                  <p className="text-xs text-muted-foreground">Promedio</p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Satisfacción</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{mockStats.satisfactionScore}/5</div>
                  <p className="text-xs text-muted-foreground">Puntuación promedio</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Tickets Recientes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockTickets.slice(0, 5).map((ticket) => {
                    const StatusIcon = statusConfig[ticket.status].icon
                    return (
                      <div key={ticket.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <StatusIcon className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-foreground text-sm">{ticket.title}</p>
                            <p className="text-xs text-muted-foreground">{ticket.userName}</p>
                          </div>
                        </div>
                        <Badge className={statusConfig[ticket.status].color}>{statusConfig[ticket.status].label}</Badge>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Distribución por Estado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-foreground">Abiertos</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">{mockStats.open}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm text-foreground">En Progreso</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">{mockStats.inProgress}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="text-sm text-foreground">Esperando</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">{mockStats.waitingResponse}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-foreground">Resueltos</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">{mockStats.resolved}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tickets Tab */}
          <TabsContent value="tickets" className="space-y-6">
            {/* Filters */}
            <Card className="border-border">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar tickets, clientes, empresas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-background border-border"
                    />
                  </div>

                  <Select
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value as TicketStatus | "all")}
                  >
                    <SelectTrigger className="w-[140px] bg-background border-border">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="open">Abierto</SelectItem>
                      <SelectItem value="in_progress">En Progreso</SelectItem>
                      <SelectItem value="waiting_response">Esperando</SelectItem>
                      <SelectItem value="resolved">Resuelto</SelectItem>
                      <SelectItem value="closed">Cerrado</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={priorityFilter}
                    onValueChange={(value) => setPriorityFilter(value as TicketPriority | "all")}
                  >
                    <SelectTrigger className="w-[140px] bg-background border-border">
                      <SelectValue placeholder="Prioridad" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="low">Baja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Tickets List */}
            <div className="space-y-4">
              {filteredTickets.length === 0 ? (
                <Card className="border-border">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No se encontraron tickets</h3>
                    <p className="text-muted-foreground text-center">
                      No hay tickets que coincidan con los filtros seleccionados.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredTickets.map((ticket) => {
                  const StatusIcon = statusConfig[ticket.status].icon
                  const PriorityIcon = priorityConfig[ticket.priority].icon

                  return (
                    <Card key={ticket.id} className="border-border hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-foreground text-lg">{ticket.title}</h3>
                                <p className="text-sm text-muted-foreground">#{ticket.id}</p>
                              </div>
                              <div className="flex gap-2">
                                <Badge className={statusConfig[ticket.status].color}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {statusConfig[ticket.status].label}
                                </Badge>
                                <Badge className={priorityConfig[ticket.priority].color}>
                                  <PriorityIcon className="h-3 w-3 mr-1" />
                                  {priorityConfig[ticket.priority].label}
                                </Badge>
                              </div>
                            </div>

                            <p className="text-muted-foreground line-clamp-2">{ticket.description}</p>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {ticket.userName}
                              </div>
                              <div className="flex items-center gap-1">
                                <Building className="h-4 w-4" />
                                {ticket.companyName}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(ticket.createdAt)}
                              </div>
                              {ticket.comments.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="h-4 w-4" />
                                  {ticket.comments.length} comentarios
                                </div>
                              )}
                              {ticket.assignedToName && (
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  Asignado a: {ticket.assignedToName}
                                </div>
                              )}
                            </div>

                            {ticket.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {ticket.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedTicket(ticket)}
                                  className="border-border"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Ver Detalles
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-background border-border">
                                <DialogHeader>
                                  <DialogTitle className="text-foreground">
                                    {selectedTicket?.title} - #{selectedTicket?.id}
                                  </DialogTitle>
                                </DialogHeader>
                                {selectedTicket && (
                                  <div className="space-y-6">
                                    {/* Ticket Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-foreground">Cliente</Label>
                                        <p className="text-muted-foreground">{selectedTicket.userName}</p>
                                        <p className="text-sm text-muted-foreground">{selectedTicket.userEmail}</p>
                                      </div>
                                      <div>
                                        <Label className="text-foreground">Empresa</Label>
                                        <p className="text-muted-foreground">{selectedTicket.companyName}</p>
                                      </div>
                                      <div>
                                        <Label className="text-foreground">Estado Actual</Label>
                                        <div className="mt-1">
                                          <Select
                                            value={selectedTicket.status}
                                            onValueChange={(value) =>
                                              handleStatusChange(selectedTicket.id, value as TicketStatus)
                                            }
                                          >
                                            <SelectTrigger className="w-full bg-background border-border">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-background border-border">
                                              <SelectItem value="open">Abierto</SelectItem>
                                              <SelectItem value="in_progress">En Progreso</SelectItem>
                                              <SelectItem value="waiting_response">Esperando Respuesta</SelectItem>
                                              <SelectItem value="resolved">Resuelto</SelectItem>
                                              <SelectItem value="closed">Cerrado</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                      <div>
                                        <Label className="text-foreground">Prioridad</Label>
                                        <Badge className={priorityConfig[selectedTicket.priority].color}>
                                          {priorityConfig[selectedTicket.priority].label}
                                        </Badge>
                                      </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                      <Label className="text-foreground">Descripción</Label>
                                      <div className="mt-2 p-4 bg-muted rounded-lg">
                                        <p className="text-foreground whitespace-pre-wrap">
                                          {selectedTicket.description}
                                        </p>
                                      </div>
                                    </div>

                                    {/* Comments */}
                                    <div>
                                      <Label className="text-foreground">Comentarios</Label>
                                      <div className="mt-2 space-y-4">
                                        {selectedTicket.comments.map((comment) => (
                                          <div key={comment.id} className="p-4 bg-muted rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                              <div className="flex items-center gap-2">
                                                <span className="font-medium text-foreground">
                                                  {comment.authorName}
                                                </span>
                                                <Badge
                                                  variant={comment.authorRole === "user" ? "secondary" : "default"}
                                                  className="text-xs"
                                                >
                                                  {comment.authorRole === "user" ? "Cliente" : "Soporte"}
                                                </Badge>
                                              </div>
                                              <span className="text-xs text-muted-foreground">
                                                {formatDate(comment.createdAt)}
                                              </span>
                                            </div>
                                            <p className="text-foreground">{comment.content}</p>
                                          </div>
                                        ))}

                                        {/* Add Comment */}
                                        <div className="space-y-2">
                                          <Label htmlFor="new-comment" className="text-foreground">
                                            Agregar Comentario
                                          </Label>
                                          <Textarea
                                            id="new-comment"
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Escribe tu respuesta..."
                                            className="bg-background border-border"
                                          />
                                          <Button onClick={handleAddComment} size="sm">
                                            <Send className="h-4 w-4 mr-2" />
                                            Enviar Respuesta
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>

                            <Select
                              value={ticket.status}
                              onValueChange={(value) => handleStatusChange(ticket.id, value as TicketStatus)}
                            >
                              <SelectTrigger className="w-full sm:w-32 lg:w-full bg-background border-border">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-background border-border">
                                <SelectItem value="open">Abierto</SelectItem>
                                <SelectItem value="in_progress">En Progreso</SelectItem>
                                <SelectItem value="waiting_response">Esperando</SelectItem>
                                <SelectItem value="resolved">Resuelto</SelectItem>
                                <SelectItem value="closed">Cerrado</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Métricas de Rendimiento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tiempo promedio de respuesta</span>
                    <span className="font-bold text-foreground">{mockStats.averageResponseTime} min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tiempo promedio de resolución</span>
                    <span className="font-bold text-foreground">{mockStats.averageResolutionTime} min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Puntuación de satisfacción</span>
                    <span className="font-bold text-foreground">{mockStats.satisfactionScore}/5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tasa de resolución</span>
                    <span className="font-bold text-foreground">
                      {Math.round((mockStats.resolved / mockStats.total) * 100)}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Tickets por Categoría</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Problemas Técnicos</span>
                    <span className="font-bold text-foreground">45%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Facturación</span>
                    <span className="font-bold text-foreground">25%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Solicitudes de Función</span>
                    <span className="font-bold text-foreground">15%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Reportes de Error</span>
                    <span className="font-bold text-foreground">10%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Otros</span>
                    <span className="font-bold text-foreground">5%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
