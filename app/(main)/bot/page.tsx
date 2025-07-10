import type { ReadonlyURLSearchParams } from "next/navigation"
import PageClient from "./page.client"
import type { BotFlow, BotMessage, BotConversation, BotStats, BotConfig, User } from "@/types"

type Props = {
  searchParams: ReadonlyURLSearchParams
}

export default async function WhatsAppBotPage({ searchParams }: Props) {
  //const params = new URLSearchParams(searchParams)

  // Mock data - in real app this would come from database
  const allFlows: BotFlow[] = [
    {
      id: "flow-1",
      name: "Agendar Cita",
      description: "Flujo completo para agendar una nueva cita médica",
      trigger: "agendar",
      status: "active",
      category: "appointment",
      steps: 5,
      completionRate: 85,
      totalUses: 234,
      lastUsed: "2024-01-15T10:30:00Z",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
      messages: ["msg-1", "msg-2", "msg-3"],
      isDefault: true,
      priority: 1,
    },
    {
      id: "flow-2",
      name: "Cancelar Cita",
      description: "Permite a los pacientes cancelar sus citas programadas",
      trigger: "cancelar",
      status: "active",
      category: "cancellation",
      steps: 3,
      completionRate: 92,
      totalUses: 89,
      lastUsed: "2024-01-14T15:20:00Z",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-14T15:20:00Z",
      messages: ["msg-4", "msg-5"],
      isDefault: true,
      priority: 2,
    },
    {
      id: "flow-3",
      name: "Información General",
      description: "Proporciona información sobre servicios y horarios",
      trigger: "info",
      status: "active",
      category: "information",
      steps: 2,
      completionRate: 78,
      totalUses: 156,
      lastUsed: "2024-01-15T09:45:00Z",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-15T09:45:00Z",
      messages: ["msg-6", "msg-7"],
      isDefault: false,
      priority: 3,
    },
    {
      id: "flow-4",
      name: "Soporte Técnico",
      description: "Ayuda con problemas técnicos y consultas",
      trigger: "ayuda",
      status: "draft",
      category: "support",
      steps: 4,
      completionRate: 0,
      totalUses: 0,
      lastUsed: null,
      createdAt: "2024-01-10T00:00:00Z",
      updatedAt: "2024-01-10T00:00:00Z",
      messages: ["msg-8"],
      isDefault: false,
      priority: 4,
    },
    {
      id: "flow-5",
      name: "Recordatorio de Cita",
      description: "Envía recordatorios automáticos antes de las citas",
      trigger: "recordatorio",
      status: "inactive",
      category: "appointment",
      steps: 1,
      completionRate: 95,
      totalUses: 445,
      lastUsed: "2024-01-12T08:00:00Z",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-12T08:00:00Z",
      messages: ["msg-9"],
      isDefault: false,
      priority: 5,
    },
  ]

  const allMessages: BotMessage[] = [
    {
      id: "msg-1",
      name: "Saludo Inicial",
      title: "Bienvenida al Sistema",
      content: "¡Hola {{nombre}}! 👋 Bienvenido a nuestro sistema de citas. ¿En qué puedo ayudarte hoy?",
      type: "text",
      variables: ["nombre"],
      category: "greeting",
      usedInFlows: ["flow-1", "flow-3"],
      lastModified: "2024-01-15T10:00:00Z",
      createdAt: "2024-01-01T00:00:00Z",
      isActive: true,
      language: "es",
    },
    {
      id: "msg-2",
      name: "Solicitar Fecha",
      title: "Selección de Fecha",
      content:
        "Perfecto {{nombre}}, vamos a agendar tu cita. ¿Qué fecha prefieres? Puedes escribir la fecha o elegir una de las opciones disponibles.",
      type: "interactive",
      variables: ["nombre"],
      category: "appointment",
      usedInFlows: ["flow-1"],
      lastModified: "2024-01-14T16:30:00Z",
      createdAt: "2024-01-01T00:00:00Z",
      isActive: true,
      language: "es",
    },
    {
      id: "msg-3",
      name: "Confirmación de Cita",
      title: "Cita Confirmada",
      content:
        "¡Excelente! Tu cita ha sido confirmada para el {{fecha}} a las {{hora}}. Te enviaremos un recordatorio 24 horas antes. ¿Necesitas algo más?",
      type: "confirmation",
      variables: ["fecha", "hora"],
      category: "appointment",
      usedInFlows: ["flow-1"],
      lastModified: "2024-01-13T11:15:00Z",
      createdAt: "2024-01-01T00:00:00Z",
      isActive: true,
      language: "es",
    },
    {
      id: "msg-4",
      name: "Cancelación de Cita",
      title: "Proceso de Cancelación",
      content: "Entiendo que necesitas cancelar tu cita. ¿Podrías confirmarme tu número de cita o la fecha programada?",
      type: "text",
      variables: [],
      category: "appointment",
      usedInFlows: ["flow-2"],
      lastModified: "2024-01-12T14:20:00Z",
      createdAt: "2024-01-01T00:00:00Z",
      isActive: true,
      language: "es",
    },
    {
      id: "msg-5",
      name: "Confirmación Cancelación",
      title: "Cita Cancelada",
      content:
        "Tu cita del {{fecha}} a las {{hora}} ha sido cancelada exitosamente. Si necesitas reagendar, estaré aquí para ayudarte.",
      type: "success",
      variables: ["fecha", "hora"],
      category: "appointment",
      usedInFlows: ["flow-2"],
      lastModified: "2024-01-11T09:45:00Z",
      createdAt: "2024-01-01T00:00:00Z",
      isActive: true,
      language: "es",
    },
    {
      id: "msg-6",
      name: "Información Horarios",
      title: "Horarios de Atención",
      content:
        "Nuestros horarios de atención son:\n🕘 Lunes a Viernes: 8:00 AM - 6:00 PM\n🕘 Sábados: 9:00 AM - 2:00 PM\n🕘 Domingos: Cerrado",
      type: "text",
      variables: [],
      category: "information",
      usedInFlows: ["flow-3"],
      lastModified: "2024-01-10T13:30:00Z",
      createdAt: "2024-01-01T00:00:00Z",
      isActive: true,
      language: "es",
    },
    {
      id: "msg-7",
      name: "Lista de Servicios",
      title: "Servicios Disponibles",
      content:
        "Ofrecemos los siguientes servicios:\n• Consulta General\n• Especialidades Médicas\n• Exámenes de Laboratorio\n• Procedimientos Menores\n\n¿Te interesa alguno en particular?",
      type: "text",
      variables: [],
      category: "information",
      usedInFlows: ["flow-3"],
      lastModified: "2024-01-09T15:45:00Z",
      createdAt: "2024-01-01T00:00:00Z",
      isActive: true,
      language: "es",
    },
    {
      id: "msg-8",
      name: "Soporte Técnico",
      title: "Ayuda Técnica",
      content:
        "Lamento que tengas problemas técnicos. Por favor describe tu situación y te ayudaré a resolverla lo antes posible.",
      type: "text",
      variables: [],
      category: "support",
      usedInFlows: ["flow-4"],
      lastModified: "2024-01-08T12:00:00Z",
      createdAt: "2024-01-01T00:00:00Z",
      isActive: false,
      language: "es",
    },
  ]

  const allConversations: BotConversation[] = [
    {
      id: "conv-1",
      contact: {
        name: "María González",
        phone: "+1234567890",
        avatar: "/Avatar1.png?height=40&width=40",
      },
      lastMessage: "Gracias, mi cita está confirmada para mañana a las 10:00 AM",
      timestamp: "2024-01-15T14:30:00Z",
      status: "completed",
      flow: "Agendar Cita",
      appointmentId: "apt-123",
      messagesCount: 8,
      duration: 180,
      satisfaction: 5,
    },
    {
      id: "conv-2",
      contact: {
        name: "Carlos Rodríguez",
        phone: "+1234567891",
        avatar: "/Avatar1.png?height=40&width=40",
      },
      lastMessage: "¿Podrían confirmarme los horarios disponibles para la próxima semana?",
      timestamp: "2024-01-15T13:45:00Z",
      status: "in_progress",
      flow: "Información General",
      appointmentId: null,
      messagesCount: 3,
      duration: 45,
    },
    {
      id: "conv-3",
      contact: {
        name: "Ana Martínez",
        phone: "+1234567892",
        avatar: "/Avatar1.png?height=40&width=40",
      },
      lastMessage: "Necesito cancelar mi cita del viernes",
      timestamp: "2024-01-15T12:20:00Z",
      status: "waiting",
      flow: "Cancelar Cita",
      appointmentId: "apt-456",
      messagesCount: 2,
      duration: 15,
    },
    {
      id: "conv-4",
      contact: {
        name: "Luis Fernández",
        phone: "+1234567893",
        avatar: "/Avatar1.png?height=40&width=40",
      },
      lastMessage: "Hola, quisiera información sobre sus servicios",
      timestamp: "2024-01-15T11:10:00Z",
      status: "abandoned",
      flow: "Información General",
      appointmentId: null,
      messagesCount: 1,
      duration: 5,
    },
    {
      id: "conv-5",
      contact: {
        name: "Carmen López",
        phone: "+1234567894",
        avatar: "/Avatar1.png?height=40&width=40",
      },
      lastMessage: "Perfecto, gracias por la ayuda",
      timestamp: "2024-01-15T10:55:00Z",
      status: "completed",
      flow: "Soporte Técnico",
      appointmentId: null,
      messagesCount: 12,
      duration: 300,
      satisfaction: 4,
    },
  ]

  const stats: BotStats = {
    totalMessages: 1247,
    messagesThisMonth: 456,
    messagesThisWeek: 123,
    messagesToday: 34,
    activeChats: 23,
    appointmentsBooked: 89,
    appointmentsThisMonth: 34,
    responseRate: 94.5,
    averageResponseTime: "2.3 min",
    conversionRate: 67.8,
    totalFlows: 5,
    activeFlows: 3,
    totalMessageTemplates: 8,
    monthlyGrowth: 12.5,
    satisfactionScore: 4.6,
    completedConversations: 234,
    abandonedConversations: 45,
  }

  const botConfig: BotConfig = {
    id: "bot-1",
    name: "Asistente Médico",
    phoneNumber: "+1 (555) 123-4567",
    status: "connected",
    qrCode:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
    autoReply: true,
    welcomeMessage: "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?",
    workingHours: {
      enabled: true,
      start: "08:00",
      end: "18:00",
      timezone: "America/Mexico_City",
      days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    },
    outOfHoursMessage:
      "Gracias por contactarnos. Nuestro horario de atención es de lunes a viernes de 8:00 AM a 6:00 PM. Te responderemos en cuanto abramos.",
    maxResponseTime: 300,
    language: "es",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  }

  const user: User = {
    id: "user-1",
    name: "Dr. Roberto Silva",
    email: "roberto.silva@email.com",
    role: "Médico General",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "DR",
    permissions: ["read", "write", "admin"],
    lastLogin: "2024-01-15T08:00:00Z",
    isActive: true,
  }

  // Apply server-side filters based on search params
  const searchTerm = ""
  const statusFilter =  "all"
  const categoryFilter =  "all"

  let filteredFlows = allFlows
  let filteredMessages = allMessages
  let filteredConversations = allConversations

  // Server-side search filtering for flows
  if (searchTerm) {
    filteredFlows = filteredFlows.filter(
      (flow) =>
        flow.name.toLowerCase().includes(searchTerm) ||
        flow.description.toLowerCase().includes(searchTerm),
    )
    filteredMessages = filteredMessages.filter(
      (message) =>
        message.name.toLowerCase().includes(searchTerm) ||
        message.content.toLowerCase().includes(searchTerm),
    )
    filteredConversations = filteredConversations.filter(
      (conversation) =>
        conversation.contact.name.toLowerCase().includes(searchTerm) ||
        conversation.lastMessage.toLowerCase().includes(searchTerm),
    )
  }

  // Server-side status filtering for flows
  if (statusFilter !== "all") {
    filteredFlows = filteredFlows.filter((flow) => flow.status === statusFilter)
  }

  // Server-side category filtering for flows
  if (categoryFilter !== "all") {
    filteredFlows = filteredFlows.filter((flow) => flow.category === categoryFilter)
    filteredMessages = filteredMessages.filter((message) => message.category === categoryFilter)
  }

  return (
    <PageClient
      flows={filteredFlows}
      messages={filteredMessages}
      conversations={filteredConversations}
      stats={stats}
      botConfig={botConfig}
      user={user}
    />
  )
}
