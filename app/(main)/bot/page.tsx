"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { DataView, useDataView } from "@/components/data-view"
import {
  MessageSquare,
  Settings,
  BarChart3,
  Users,
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle,
  Bot,
  Calendar,
  Edit,
  Trash2,
  Plus,
  Play,
  Pause,
  Copy,
  QrCode,
  Workflow,
  TrendingUp,
  Activity,
  Smartphone,
  Star,
  DollarSign,
} from "lucide-react"
import { Header } from "@/components/header"

export default function Page() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(false)
  const [botEnabled, setBotEnabled] = useState(true)
  const [showFlowDialog, setShowFlowDialog] = useState(false)
  const [showMessageDialog, setShowMessageDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedFlow, setSelectedFlow] = useState<any>(null)
  const [selectedMessage, setSelectedMessage] = useState<any>(null)
  const [itemToDelete, setItemToDelete] = useState<any>(null)

  const { viewMode: flowViewMode, ViewToggle: FlowViewToggle } = useDataView("cards")
  const { viewMode: messageViewMode, ViewToggle: MessageViewToggle } = useDataView("table")

  // Bot Configuration
  const [botConfig, setBotConfig] = useState({
    name: "CitasFácil Bot",
    phoneNumber: "+52 55 1234 5678",
    status: "connected",
    qrCode:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
    autoReply: true,
    workingHours: {
      enabled: true,
      start: "08:00",
      end: "18:00",
      timezone: "America/Mexico_City",
    },
  })

  // Bot Statistics
  const [stats, setStats] = useState({
    totalMessages: 1247,
    messagesThisMonth: 342,
    activeChats: 23,
    appointmentsBooked: 89,
    responseRate: 94.5,
    averageResponseTime: "2.3 min",
    conversionRate: 12.8,
    totalFlows: 8,
    activeFlows: 6,
    monthlyGrowth: 15.2,
  })

  // Flows Data
  const [flows, setFlows] = useState([
    {
      id: "1",
      name: "Agendar Cita",
      description: "Flujo principal para agendar nuevas citas",
      trigger: "agendar|cita|appointment",
      status: "active",
      category: "appointment",
      steps: 5,
      completionRate: 87.5,
      totalUses: 234,
      lastUsed: "2024-01-16",
      createdAt: "2024-01-01",
      messages: ["welcome", "service_selection", "date_selection", "confirmation", "success"],
    },
    {
      id: "2",
      name: "Consultar Horarios",
      description: "Mostrar horarios disponibles",
      trigger: "horarios|disponibilidad|schedule",
      status: "active",
      category: "information",
      steps: 3,
      completionRate: 92.1,
      totalUses: 189,
      lastUsed: "2024-01-15",
      createdAt: "2024-01-05",
      messages: ["horarios_intro", "horarios_display", "horarios_outro"],
    },
    {
      id: "3",
      name: "Cancelar Cita",
      description: "Proceso para cancelar citas existentes",
      trigger: "cancelar|cancel",
      status: "active",
      category: "cancellation",
      steps: 4,
      completionRate: 78.3,
      totalUses: 67,
      lastUsed: "2024-01-14",
      createdAt: "2024-01-10",
      messages: ["cancel_intro", "appointment_lookup", "cancel_confirm", "cancel_success"],
    },
    {
      id: "4",
      name: "Información de Servicios",
      description: "Detalles sobre servicios disponibles",
      trigger: "servicios|services|precios",
      status: "draft",
      category: "information",
      steps: 3,
      completionRate: 0,
      totalUses: 0,
      lastUsed: null,
      createdAt: "2024-01-12",
      messages: ["services_intro", "services_list", "services_outro"],
    },
    {
      id: "5",
      name: "Soporte Técnico",
      description: "Ayuda y soporte para usuarios",
      trigger: "ayuda|help|soporte",
      status: "active",
      category: "support",
      steps: 2,
      completionRate: 95.2,
      totalUses: 156,
      lastUsed: "2024-01-16",
      createdAt: "2024-01-08",
      messages: ["support_intro", "support_options"],
    },
  ])

  // Messages Data
  const [messages, setMessages] = useState([
    {
      id: "1",
      name: "welcome",
      title: "Mensaje de Bienvenida",
      content: "¡Hola! 👋 Soy el asistente virtual de {{business}}. ¿En qué puedo ayudarte hoy?",
      type: "text",
      variables: ["business"],
      category: "greeting",
      usedInFlows: ["Agendar Cita", "Consultar Horarios"],
      lastModified: "2024-01-15",
      createdAt: "2024-01-01",
    },
    {
      id: "2",
      name: "service_selection",
      title: "Selección de Servicio",
      content:
        "Perfecto! Estos son nuestros servicios disponibles:\n\n1️⃣ Consulta General - $500\n2️⃣ Especialista - $800\n3️⃣ Urgencias - $1200\n\nResponde con el número del servicio que necesitas.",
      type: "interactive",
      variables: [],
      category: "appointment",
      usedInFlows: ["Agendar Cita"],
      lastModified: "2024-01-14",
      createdAt: "2024-01-02",
    },
    {
      id: "3",
      name: "date_selection",
      title: "Selección de Fecha",
      content:
        "Excelente elección! 📅\n\nEstos son los horarios disponibles para {{service}}:\n\n{{available_dates}}\n\nResponde con el número de tu horario preferido.",
      type: "interactive",
      variables: ["service", "available_dates"],
      category: "appointment",
      usedInFlows: ["Agendar Cita"],
      lastModified: "2024-01-13",
      createdAt: "2024-01-03",
    },
    {
      id: "4",
      name: "confirmation",
      title: "Confirmación de Cita",
      content:
        "¡Perfecto! 🎉\n\nTu cita está confirmada:\n📋 Servicio: {{service}}\n📅 Fecha: {{date}}\n🕐 Hora: {{time}}\n💰 Costo: {{price}}\n\n¿Confirmas estos datos? Responde SÍ o NO.",
      type: "confirmation",
      variables: ["service", "date", "time", "price"],
      category: "appointment",
      usedInFlows: ["Agendar Cita"],
      lastModified: "2024-01-12",
      createdAt: "2024-01-04",
    },
    {
      id: "5",
      name: "success",
      title: "Cita Agendada Exitosamente",
      content:
        "¡Listo! ✅ Tu cita ha sido agendada exitosamente.\n\nRecibirás un recordatorio 24 horas antes.\n\n¿Hay algo más en lo que pueda ayudarte?",
      type: "success",
      variables: [],
      category: "appointment",
      usedInFlows: ["Agendar Cita"],
      lastModified: "2024-01-11",
      createdAt: "2024-01-05",
    },
    {
      id: "6",
      name: "horarios_intro",
      title: "Introducción Horarios",
      content: "Te muestro nuestros horarios de atención: 🕐",
      type: "text",
      variables: [],
      category: "information",
      usedInFlows: ["Consultar Horarios"],
      lastModified: "2024-01-10",
      createdAt: "2024-01-06",
    },
  ])

  // Recent Conversations
  const [conversations, setConversations] = useState([
    {
      id: "1",
      contact: {
        name: "María González",
        phone: "+52 55 9876 5432",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      lastMessage: "Perfecto, confirmo mi cita para mañana",
      timestamp: "Hace 5 min",
      status: "completed",
      flow: "Agendar Cita",
      appointmentId: "APT-001",
    },
    {
      id: "2",
      contact: {
        name: "Carlos Rodríguez",
        phone: "+52 55 8765 4321",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      lastMessage: "¿Puedo cambiar mi cita del viernes?",
      timestamp: "Hace 12 min",
      status: "in_progress",
      flow: "Cancelar Cita",
      appointmentId: "APT-002",
    },
    {
      id: "3",
      contact: {
        name: "Ana Martínez",
        phone: "+52 55 7654 3210",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      lastMessage: "Gracias por la información",
      timestamp: "Hace 1 hora",
      status: "completed",
      flow: "Consultar Horarios",
      appointmentId: null,
    },
  ])

  // Field configurations for DataView
  const flowFields = [
    {
      key: "name",
      label: "Flujo",
      type: "custom" as const,
      primary: true,
      sortable: true,
      render: (value: string, flow: any) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Workflow className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-muted-foreground">{flow.description}</div>
          </div>
        </div>
      ),
    },
    {
      key: "trigger",
      label: "Palabras Clave",
      type: "custom" as const,
      render: (value: string) => (
        <div className="flex flex-wrap gap-1">
          {value.split("|").map((keyword) => (
            <Badge key={keyword} variant="outline" className="text-xs">
              {keyword}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: "steps",
      label: "Pasos",
      type: "number" as const,
      sortable: true,
    },
    {
      key: "completionRate",
      label: "Tasa de Éxito",
      type: "custom" as const,
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <div className="w-12 bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${value}%` }} />
          </div>
          <span className="text-sm font-medium">{value}%</span>
        </div>
      ),
    },
    {
      key: "totalUses",
      label: "Usos",
      type: "number" as const,
      sortable: true,
    },
    {
      key: "status",
      label: "Estado",
      type: "badge" as const,
      badgeConfig: {
        colors: {
          active: "bg-green-100 text-green-800",
          draft: "bg-yellow-100 text-yellow-800",
          inactive: "bg-gray-100 text-gray-800",
        },
        labels: {
          active: "Activo",
          draft: "Borrador",
          inactive: "Inactivo",
        },
      },
    },
    {
      key: "lastUsed",
      label: "Último Uso",
      type: "date" as const,
      sortable: true,
    },
  ]

  const messageFields = [
    {
      key: "title",
      label: "Mensaje",
      type: "custom" as const,
      primary: true,
      sortable: true,
      render: (value: string, message: any) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground">ID: {message.name}</div>
        </div>
      ),
    },
    {
      key: "content",
      label: "Contenido",
      type: "custom" as const,
      render: (value: string) => (
        <div className="max-w-xs">
          <p className="text-sm truncate">{value}</p>
        </div>
      ),
    },
    {
      key: "type",
      label: "Tipo",
      type: "badge" as const,
      badgeConfig: {
        colors: {
          text: "bg-blue-100 text-blue-800",
          interactive: "bg-purple-100 text-purple-800",
          confirmation: "bg-orange-100 text-orange-800",
          success: "bg-green-100 text-green-800",
        },
        labels: {
          text: "Texto",
          interactive: "Interactivo",
          confirmation: "Confirmación",
          success: "Éxito",
        },
      },
    },
    {
      key: "variables",
      label: "Variables",
      type: "custom" as const,
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value.map((variable) => (
            <Badge key={variable} variant="secondary" className="text-xs">
              {`{{${variable}}}`}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: "usedInFlows",
      label: "Usado en Flujos",
      type: "custom" as const,
      render: (value: string[]) => (
        <div className="text-sm">
          <span className="font-medium">{value.length}</span> flujo{value.length !== 1 ? "s" : ""}
        </div>
      ),
    },
    {
      key: "lastModified",
      label: "Modificado",
      type: "date" as const,
      sortable: true,
    },
  ]

  const flowActions = [
    {
      label: "Editar",
      icon: Edit,
      onClick: (flow: any) => {
        setSelectedFlow(flow)
        setShowFlowDialog(true)
      },
    },
    {
      label: "Probar",
      icon: Play,
      onClick: (flow: any) => console.log("Testing flow:", flow),
    },
    {
      label: "Duplicar",
      icon: Copy,
      onClick: (flow: any) => console.log("Duplicating flow:", flow),
    },
    {
      label: "Eliminar",
      icon: Trash2,
      onClick: (flow: any) => {
        setItemToDelete(flow)
        setShowDeleteDialog(true)
      },
      variant: "destructive" as const,
    },
  ]

  const messageActions = [
    {
      label: "Editar",
      icon: Edit,
      onClick: (message: any) => {
        setSelectedMessage(message)
        setShowMessageDialog(true)
      },
    },
    {
      label: "Duplicar",
      icon: Copy,
      onClick: (message: any) => console.log("Duplicating message:", message),
    },
    {
      label: "Eliminar",
      icon: Trash2,
      onClick: (message: any) => {
        setItemToDelete(message)
        setShowDeleteDialog(true)
      },
      variant: "destructive" as const,
    },
  ]

  const handleSaveConfig = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("Saving bot config:", botConfig)
    setIsLoading(false)
  }

  const handleTestConnection = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log("Testing WhatsApp connection...")
    setIsLoading(false)
  }

  const handleCreateFlow = () => {
    setSelectedFlow(null)
    setShowFlowDialog(true)
  }

  const handleCreateMessage = () => {
    setSelectedMessage(null)
    setShowMessageDialog(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
      case "active":
      case "completed":
        return "bg-green-100 text-green-800"
      case "draft":
      case "in_progress":
        return "bg-yellow-100 text-yellow-800"
      case "disconnected":
      case "inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
      case "active":
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "draft":
      case "in_progress":
        return <AlertCircle className="h-4 w-4" />
      case "disconnected":
      case "inactive":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header
        title="Bot"
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
        actions={
          <div className="flex items-center space-x-2">
            <Badge className={`${getStatusColor(botConfig.status)} flex items-center space-x-1`}>
              {getStatusIcon(botConfig.status)}
              <span className="capitalize">{botConfig.status === "connected" ? "Conectado" : "Desconectado"}</span>
            </Badge>
            <Button
              variant={botEnabled ? "destructive" : "default"}
              size="sm"
              onClick={() => setBotEnabled(!botEnabled)}
            >
              {botEnabled ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {botEnabled ? "Pausar Bot" : "Activar Bot"}
            </Button>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Resumen</span>
            </TabsTrigger>
            <TabsTrigger value="flows" className="flex items-center space-x-2">
              <Workflow className="h-4 w-4" />
              <span className="hidden sm:inline">Flujos</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Mensajes</span>
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Configuración</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Estadísticas</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Mensajes Totales</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalMessages.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <MessageSquare className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <p className="text-xs text-green-600">+{stats.monthlyGrowth}% este mes</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Chats Activos</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.activeChats}</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Conversaciones en curso</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Citas Agendadas</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.appointmentsBooked}</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Calendar className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <DollarSign className="h-3 w-3 text-green-500 mr-1" />
                    <p className="text-xs text-green-600">Conversión: {stats.conversionRate}%</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Tasa de Respuesta</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.responseRate}%</p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-full">
                      <Zap className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Tiempo promedio: {stats.averageResponseTime}</p>
                </CardContent>
              </Card>
            </div>

            {/* Bot Status & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bot Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bot className="h-5 w-5" />
                    <span>Estado del Bot</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3  rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">{botConfig.name}</p>
                        <p className="text-sm text-gray-500">{botConfig.phoneNumber}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(botConfig.status)}>
                      {getStatusIcon(botConfig.status)}
                      <span className="ml-1">Conectado</span>
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Flujos Activos</p>
                      <p className="font-medium">
                        {stats.activeFlows} de {stats.totalFlows}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Mensajes</p>
                      <p className="font-medium">{stats.totalMessages} plantillas</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Horarios de Atención</span>
                      <Switch checked={botConfig.workingHours.enabled} />
                    </div>
                    {botConfig.workingHours.enabled && (
                      <p className="text-xs text-gray-500">
                        {botConfig.workingHours.start} - {botConfig.workingHours.end}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Conversations */}
              <Card>
                <CardHeader>
                  <CardTitle>Conversaciones Recientes</CardTitle>
                  <CardDescription>Últimas interacciones con clientes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {conversations.slice(0, 4).map((conversation) => (
                      <div key={conversation.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                        <Avatar>
                          <AvatarImage src={conversation.contact.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {conversation.contact.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">{conversation.contact.name}</p>
                            <p className="text-xs text-gray-500">{conversation.timestamp}</p>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                          <div className="flex items-center justify-between mt-1">
                            <Badge variant="outline" className="text-xs">
                              {conversation.flow}
                            </Badge>
                            <Badge className={getStatusColor(conversation.status)}>
                              {conversation.status === "completed" ? "Completado" : "En Progreso"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Flows Tab */}
          <TabsContent value="flows" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Flujos Conversacionales</CardTitle>
                    <CardDescription>Gestiona los flujos de conversación del bot</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FlowViewToggle />
                    <Button onClick={handleCreateFlow}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Flujo
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <DataView
                  data={flows}
                  fields={flowFields}
                  actions={flowActions}
                  viewMode={flowViewMode}
                  emptyState={{
                    icon: <Workflow className="h-12 w-12 text-gray-400" />,
                    title: "No hay flujos configurados",
                    description: "Crea tu primer flujo conversacional para comenzar a automatizar las interacciones.",
                    action: (
                      <Button onClick={handleCreateFlow}>
                        <Plus className="h-4 w-4 mr-2" />
                        Crear Primer Flujo
                      </Button>
                    ),
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Biblioteca de Mensajes</CardTitle>
                    <CardDescription>Mensajes reutilizables para tus flujos conversacionales</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageViewToggle />
                    <Button onClick={handleCreateMessage}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Mensaje
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <DataView
                  data={messages}
                  fields={messageFields}
                  actions={messageActions}
                  viewMode={messageViewMode}
                  emptyState={{
                    icon: <MessageSquare className="h-12 w-12 text-gray-400" />,
                    title: "No hay mensajes configurados",
                    description: "Crea mensajes reutilizables para usar en tus flujos conversacionales.",
                    action: (
                      <Button onClick={handleCreateMessage}>
                        <Plus className="h-4 w-4 mr-2" />
                        Crear Primer Mensaje
                      </Button>
                    ),
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configuration Tab */}
          <TabsContent value="config" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* WhatsApp Connection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <QrCode className="h-5 w-5" />
                    <span>Conexión WhatsApp</span>
                  </CardTitle>
                  <CardDescription>Escanea el código QR para conectar tu WhatsApp</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-center">
                    <div className="p-4 bg-white border-2 border-dashed border-gray-300 rounded-lg">
                      <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                        <QrCode className="h-24 w-24 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-sm text-gray-600">
                      1. Abre WhatsApp en tu teléfono
                      <br />
                      2. Ve a Configuración {">"} Dispositivos vinculados
                      <br />
                      3. Escanea este código QR
                    </p>
                    <Button variant="outline" onClick={handleTestConnection} disabled={isLoading}>
                      {isLoading ? "Verificando..." : "Generar Nuevo QR"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Bot Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle>Configuración del Bot</CardTitle>
                  <CardDescription>Personaliza el comportamiento de tu bot</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="botName">Nombre del Bot</Label>
                      <Input
                        id="botName"
                        value={botConfig.name}
                        onChange={(e) => setBotConfig({ ...botConfig, name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Número de WhatsApp</Label>
                      <Input
                        id="phoneNumber"
                        value={botConfig.phoneNumber}
                        onChange={(e) => setBotConfig({ ...botConfig, phoneNumber: e.target.value })}
                        disabled
                      />
                      <p className="text-xs text-gray-500">Se asigna automáticamente al conectar</p>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Respuestas Automáticas</Label>
                          <p className="text-sm text-gray-500">Responder automáticamente fuera de horario</p>
                        </div>
                        <Switch
                          checked={botConfig.autoReply}
                          onCheckedChange={(checked) => setBotConfig({ ...botConfig, autoReply: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Horarios de Atención</Label>
                          <p className="text-sm text-gray-500">Configurar horarios de atención</p>
                        </div>
                        <Switch
                          checked={botConfig.workingHours.enabled}
                          onCheckedChange={(checked) =>
                            setBotConfig({
                              ...botConfig,
                              workingHours: { ...botConfig.workingHours, enabled: checked },
                            })
                          }
                        />
                      </div>

                      {botConfig.workingHours.enabled && (
                        <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-gray-200">
                          <div className="space-y-2">
                            <Label htmlFor="startTime">Hora de Inicio</Label>
                            <Input
                              id="startTime"
                              type="time"
                              value={botConfig.workingHours.start}
                              onChange={(e) =>
                                setBotConfig({
                                  ...botConfig,
                                  workingHours: { ...botConfig.workingHours, start: e.target.value },
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="endTime">Hora de Fin</Label>
                            <Input
                              id="endTime"
                              type="time"
                              value={botConfig.workingHours.end}
                              onChange={(e) =>
                                setBotConfig({
                                  ...botConfig,
                                  workingHours: { ...botConfig.workingHours, end: e.target.value },
                                })
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSaveConfig} disabled={isLoading}>
                      {isLoading ? "Guardando..." : "Guardar Configuración"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Rendimiento General</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tasa de Respuesta</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${stats.responseRate}%` }} />
                      </div>
                      <span className="text-sm font-medium">{stats.responseRate}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tasa de Conversión</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${stats.conversionRate * 5}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{stats.conversionRate}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tiempo de Respuesta</span>
                    <span className="text-sm font-medium">{stats.averageResponseTime}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Flow Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Flujos Más Usados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {flows
                      .sort((a, b) => b.totalUses - a.totalUses)
                      .slice(0, 4)
                      .map((flow) => (
                        <div key={flow.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            <span className="text-sm truncate">{flow.name}</span>
                          </div>
                          <span className="text-sm font-medium">{flow.totalUses}</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Hourly Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Actividad por Hora</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {["09:00-12:00", "12:00-15:00", "15:00-18:00", "18:00-21:00"].map((hour, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{hour}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${100 - index * 20}%` }} />
                          </div>
                          <span className="text-xs text-gray-500">{100 - index * 20}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Message Types */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Tipos de Consulta</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Agendar citas</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Consultar horarios</span>
                      <span className="text-sm font-medium">25%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Cancelaciones</span>
                      <span className="text-sm font-medium">20%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Información general</span>
                      <span className="text-sm font-medium">10%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Growth Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Crecimiento Mensual</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Nuevos usuarios</span>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="text-sm font-medium text-green-600">+{stats.monthlyGrowth}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mensajes enviados</span>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="text-sm font-medium text-green-600">+18.5%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Citas agendadas</span>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="text-sm font-medium text-green-600">+22.1%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Satisfaction */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Satisfacción del Usuario</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">4.8</div>
                      <div className="flex items-center justify-center space-x-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= 4.8 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Basado en 156 evaluaciones</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Muy satisfecho</span>
                        <span>78%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Satisfecho</span>
                        <span>18%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Neutral</span>
                        <span>3%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Insatisfecho</span>
                        <span>1%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Flow Dialog */}
      <Dialog open={showFlowDialog} onOpenChange={setShowFlowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedFlow ? "Editar Flujo" : "Nuevo Flujo"}</DialogTitle>
            <DialogDescription>
              {selectedFlow ? "Modifica el flujo conversacional" : "Crea un nuevo flujo conversacional"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="flowName">Nombre del Flujo</Label>
                <Input id="flowName" placeholder="Ej: Agendar Cita" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="flowCategory">Categoría</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="appointment">Citas</SelectItem>
                    <SelectItem value="information">Información</SelectItem>
                    <SelectItem value="support">Soporte</SelectItem>
                    <SelectItem value="cancellation">Cancelaciones</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="flowDescription">Descripción</Label>
              <Textarea id="flowDescription" placeholder="Describe el propósito de este flujo" rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="flowTrigger">Palabras Clave (separadas por |)</Label>
              <Input id="flowTrigger" placeholder="agendar|cita|appointment" />
            </div>
            <div className="space-y-2">
              <Label>Mensajes del Flujo</Label>
              <div className="border rounded-lg p-4 space-y-2">
                <p className="text-sm text-gray-500">Arrastra los mensajes para ordenar el flujo</p>
                <div className="space-y-2">
                  {["welcome", "service_selection", "date_selection", "confirmation", "success"].map((msg, index) => (
                    <div key={msg} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">{index + 1}.</span>
                      <span className="text-sm">{msg}</span>
                      <Button variant="ghost" size="sm" className="ml-auto">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Mensaje
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFlowDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setShowFlowDialog(false)}>{selectedFlow ? "Actualizar" : "Crear"} Flujo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedMessage ? "Editar Mensaje" : "Nuevo Mensaje"}</DialogTitle>
            <DialogDescription>
              {selectedMessage ? "Modifica el mensaje existente" : "Crea un nuevo mensaje reutilizable"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="messageName">ID del Mensaje</Label>
                <Input id="messageName" placeholder="welcome" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="messageTitle">Título</Label>
                <Input id="messageTitle" placeholder="Mensaje de Bienvenida" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="messageType">Tipo</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Texto</SelectItem>
                    <SelectItem value="interactive">Interactivo</SelectItem>
                    <SelectItem value="confirmation">Confirmación</SelectItem>
                    <SelectItem value="success">Éxito</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="messageCategory">Categoría</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="greeting">Saludo</SelectItem>
                    <SelectItem value="appointment">Citas</SelectItem>
                    <SelectItem value="information">Información</SelectItem>
                    <SelectItem value="support">Soporte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="messageContent">Contenido del Mensaje</Label>
              <Textarea
                id="messageContent"
                placeholder="Escribe tu mensaje aquí. Usa {{variable}} para variables dinámicas."
                rows={6}
              />
            </div>
            <div className="space-y-2">
              <Label>Variables Disponibles</Label>
              <div className="flex flex-wrap gap-2">
                {["name", "date", "time", "business", "service", "price"].map((variable) => (
                  <Badge key={variable} variant="outline" className="cursor-pointer">
                    {`{{${variable}}}`}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMessageDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setShowMessageDialog(false)}>
              {selectedMessage ? "Actualizar" : "Crear"} Mensaje
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el{" "}
              {itemToDelete?.name || itemToDelete?.title} y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                console.log("Deleting:", itemToDelete)
                setShowDeleteDialog(false)
                setItemToDelete(null)
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
