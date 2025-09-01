"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataView, useDataView } from "@/components/data-view";
import {
  MessageSquare,
  Bot,
  Settings,
  Search,
  Plus,
  Play,
  Edit,
  Copy,
  Trash2,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  Users,
  TrendingUp,
  Star,
  Phone,
  Zap,
  BarChart3,
  MessageCircle,
  Calendar,
} from "lucide-react";
import { Header } from "@/components/header";
import type {
  BotFlow,
  BotMessage,
  BotConversation,
  BotStats,
  BotConfig,
  User,
  DataViewField,
  DataViewAction,
} from "@/types";

type Props = {
  flows: BotFlow[];
  messages: BotMessage[];
  conversations: BotConversation[];
  stats: BotStats;
  botConfig: BotConfig;
  user: User;
};

export default function WhatsAppBotClient({
  flows,
  messages,
  conversations,
  stats,
  botConfig,
  user,
}: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showFlowDialog, setShowFlowDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [selectedFlow, setSelectedFlow] = useState<BotFlow | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<BotMessage | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const { viewMode, ViewToggle } = useDataView("cards");

  // Form data for flows
  const [flowFormData, setFlowFormData] = useState({
    name: "",
    description: "",
    trigger: "",
    category: "general" as const,
    messages: [] as string[],
    priority: 1,
  });

  // Form data for messages
  const [messageFormData, setMessageFormData] = useState({
    name: "",
    title: "",
    content: "",
    type: "text" as const,
    category: "greeting" as const,
    variables: [] as string[],
    language: "es",
  });

  // Bot configuration state
  const [configData, setConfigData] = useState({
    name: botConfig.name,
    autoReply: botConfig.autoReply,
    welcomeMessage: botConfig.welcomeMessage,
    workingHoursEnabled: botConfig.workingHours.enabled,
    workingHoursStart: botConfig.workingHours.start,
    workingHoursEnd: botConfig.workingHours.end,
    outOfHoursMessage: botConfig.outOfHoursMessage,
  });

  // Client-side filtering for immediate UI feedback
  const clientFilteredFlows = flows.filter((flow) => {
    const matchesSearch =
      flow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flow.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const clientFilteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const clientFilteredConversations = conversations.filter((conversation) => {
    const matchesSearch =
      conversation.contact.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Handle search with URL update for server-side filtering
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }

    router.push(`${url.pathname}?${params.toString()}`);
  };

  // Handle status filter with URL update
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

  // Handle category filter with URL update
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

  // Flow action handlers
  const handleTestFlow = (flow: BotFlow) => {
    console.log("Test flow:", flow);
    // TODO: Implement flow testing
  };

  const handleEditFlow = (flow: BotFlow) => {
    setSelectedFlow(flow);
    setFlowFormData({
      name: flow.name,
      description: flow.description,
      trigger: flow.trigger,
      category: flow.category,
      messages: flow.messages,
      priority: flow.priority,
    });
    setShowFlowDialog(true);
  };

  const handleDuplicateFlow = (flow: BotFlow) => {
    console.log("Duplicate flow:", flow);
    // TODO: Implement flow duplication
  };

  const handleDeleteFlow = (flow: BotFlow) => {
    console.log("Delete flow:", flow);
    // TODO: Show confirmation dialog and call API
  };

  const handleCreateFlow = () => {
    setSelectedFlow(null);
    setFlowFormData({
      name: "",
      description: "",
      trigger: "",
      category: "general",
      messages: [],
      priority: 1,
    });
    setShowFlowDialog(true);
  };

  // Message action handlers
  const handleEditMessage = (message: BotMessage) => {
    setSelectedMessage(message);
    setMessageFormData({
      name: message.name,
      title: message.title,
      content: message.content,
      type: message.type,
      category: message.category,
      variables: message.variables,
      language: message.language,
    });
    setShowMessageDialog(true);
  };

  const handleDeleteMessage = (message: BotMessage) => {
    console.log("Delete message:", message);
    // TODO: Show confirmation dialog and call API
  };

  const handleCreateMessage = () => {
    setSelectedMessage(null);
    setMessageFormData({
      name: "",
      title: "",
      content: "",
      type: "text",
      category: "greeting",
      variables: [],
      language: "es",
    });
    setShowMessageDialog(true);
  };

  // Form submission handlers
  const handleFlowSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log(selectedFlow ? "Update flow:" : "Create flow:", flowFormData);
    setIsLoading(false);
    setShowFlowDialog(false);
  };

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log(
      selectedMessage ? "Update message:" : "Create message:",
      messageFormData,
    );
    setIsLoading(false);
    setShowMessageDialog(false);
  };

  const handleConfigSave = async () => {
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Save config:", configData);
    setIsLoading(false);
  };

  // DataView field configurations
  const flowFields: DataViewField[] = [
    {
      key: "name",
      label: "Nombre",
      type: "text",
      primary: true,
      sortable: true,
    },
    {
      key: "description",
      label: "Descripción",
      type: "text",
      secondary: true,
      showInTable: false,
    },
    {
      key: "trigger",
      label: "Disparador",
      type: "custom",
      render: (value: string) => (
        <Badge variant="outline" className="font-mono">
          {value}
        </Badge>
      ),
    },
    {
      key: "category",
      label: "Categoría",
      type: "custom",
      sortable: true,
      render: (value: string) => {
        const categoryConfig = {
          appointment: { color: "bg-blue-100 text-blue-800", label: "Citas" },
          information: {
            color: "bg-green-100 text-green-800",
            label: "Información",
          },
          support: { color: "bg-purple-100 text-purple-800", label: "Soporte" },
          cancellation: {
            color: "bg-red-100 text-red-800",
            label: "Cancelación",
          },
          general: { color: "bg-gray-100 text-gray-800", label: "General" },
        };
        const config = categoryConfig[value as keyof typeof categoryConfig];
        return <Badge className={config.color}>{config.label}</Badge>;
      },
    },
    {
      key: "status",
      label: "Estado",
      type: "custom",
      sortable: true,
      render: (value: string) => {
        const statusConfig = {
          active: {
            color: "bg-green-100 text-green-800",
            icon: CheckCircle,
            label: "Activo",
          },
          draft: {
            color: "bg-yellow-100 text-yellow-800",
            icon: AlertCircle,
            label: "Borrador",
          },
          inactive: {
            color: "bg-red-100 text-red-800",
            icon: XCircle,
            label: "Inactivo",
          },
        };
        const config = statusConfig[value as keyof typeof statusConfig];
        const Icon = config.icon;
        return (
          <Badge className={config.color}>
            <Icon className="h-3 w-3 mr-1" />
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: "completionRate",
      label: "Tasa de Completado",
      type: "custom",
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center space-x-2">
          <Progress value={value} className="w-16" />
          <span className="text-sm font-medium">{value}%</span>
        </div>
      ),
    },
    {
      key: "totalUses",
      label: "Usos Totales",
      type: "number",
      sortable: true,
    },
  ];

  const flowActions: DataViewAction[] = [
    {
      label: "Probar",
      icon: Play,
      onClick: handleTestFlow,
    },
    {
      label: "Editar",
      icon: Edit,
      onClick: handleEditFlow,
    },
    {
      label: "Duplicar",
      icon: Copy,
      onClick: handleDuplicateFlow,
    },
    {
      label: "Eliminar",
      icon: Trash2,
      onClick: handleDeleteFlow,
      variant: "destructive",
    },
  ];

  const messageFields: DataViewField[] = [
    {
      key: "name",
      label: "Nombre",
      type: "text",
      primary: true,
      sortable: true,
    },
    {
      key: "title",
      label: "Título",
      type: "text",
      secondary: true,
      showInTable: false,
    },
    {
      key: "content",
      label: "Contenido",
      type: "custom",
      render: (value: string) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {value}
          </p>
        </div>
      ),
    },
    {
      key: "type",
      label: "Tipo",
      type: "custom",
      sortable: true,
      render: (value: string) => {
        const typeConfig = {
          text: { color: "bg-blue-100 text-blue-800", label: "Texto" },
          interactive: {
            color: "bg-purple-100 text-purple-800",
            label: "Interactivo",
          },
          confirmation: {
            color: "bg-green-100 text-green-800",
            label: "Confirmación",
          },
          success: { color: "bg-emerald-100 text-emerald-800", label: "Éxito" },
          error: { color: "bg-red-100 text-red-800", label: "Error" },
        };
        const config = typeConfig[value as keyof typeof typeConfig];
        return <Badge className={config.color}>{config.label}</Badge>;
      },
    },
    {
      key: "category",
      label: "Categoría",
      type: "custom",
      sortable: true,
      render: (value: string) => {
        const categoryConfig = {
          greeting: { color: "bg-yellow-100 text-yellow-800", label: "Saludo" },
          appointment: { color: "bg-blue-100 text-blue-800", label: "Citas" },
          information: {
            color: "bg-green-100 text-green-800",
            label: "Información",
          },
          support: { color: "bg-purple-100 text-purple-800", label: "Soporte" },
          farewell: { color: "bg-gray-100 text-gray-800", label: "Despedida" },
        };
        const config = categoryConfig[value as keyof typeof categoryConfig];
        return <Badge className={config.color}>{config.label}</Badge>;
      },
    },
    {
      key: "variables",
      label: "Variables",
      type: "custom",
      showInTable: false,
      render: (value: string[]) =>
        value.length > 0 ? (
          <div className="flex flex-wrap gap-1 mt-2">
            {value.map((variable) => (
              <Badge key={variable} variant="outline" className="text-xs">
                {`{{${variable}}}`}
              </Badge>
            ))}
          </div>
        ) : null,
    },
  ];

  const messageActions: DataViewAction[] = [
    {
      label: "Editar",
      icon: Edit,
      onClick: handleEditMessage,
    },
    {
      label: "Eliminar",
      icon: Trash2,
      onClick: handleDeleteMessage,
      variant: "destructive",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "waiting":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "abandoned":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-3 w-3" />;
      case "in_progress":
        return <Clock className="h-3 w-3" />;
      case "waiting":
        return <AlertCircle className="h-3 w-3" />;
      case "abandoned":
        return <XCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completado";
      case "in_progress":
        return "En progreso";
      case "waiting":
        return "Esperando";
      case "abandoned":
        return "Abandonado";
      default:
        return "Desconocido";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) {
      return "Hace unos minutos";
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} horas`;
    } else {
      return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header
        title="WhatsApp Bot"
        showBackButton={true}
        backButtonText="Dashboard"
        backButtonHref="/dashboard"
        user={user}
        notifications={{
          count: 3,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger
              value="overview"
              className="flex items-center space-x-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Resumen</span>
            </TabsTrigger>
            <TabsTrigger value="flows" className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>Flujos</span>
            </TabsTrigger>
            <TabsTrigger
              value="messages"
              className="flex items-center space-x-2"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Mensajes</span>
            </TabsTrigger>
            <TabsTrigger
              value="conversations"
              className="flex items-center space-x-2"
            >
              <Users className="h-4 w-4" />
              <span>Conversaciones</span>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>Configuración</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Bot Status */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Bot className="h-5 w-5" />
                      <span>Estado del Bot</span>
                    </CardTitle>
                    <CardDescription>
                      Información general del asistente de WhatsApp
                    </CardDescription>
                  </div>
                  <Badge
                    className={
                      botConfig.status === "connected"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    <div className="flex items-center space-x-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          botConfig.status === "connected"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      />
                      <span>
                        {botConfig.status === "connected"
                          ? "Conectado"
                          : "Desconectado"}
                      </span>
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Nombre del Bot
                    </p>
                    <p className="text-lg font-semibold">{botConfig.name}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Número de Teléfono
                    </p>
                    <p className="text-lg font-semibold flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {botConfig.phoneNumber}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Respuesta Automática
                    </p>
                    <p className="text-lg font-semibold">
                      {botConfig.autoReply ? "Activada" : "Desactivada"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Mensajes Totales
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {stats.totalMessages.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        +{stats.monthlyGrowth}% este mes
                      </p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Chats Activos
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {stats.activeChats}
                      </p>
                      <p className="text-xs text-gray-500">En tiempo real</p>
                    </div>
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Citas Agendadas
                      </p>
                      <p className="text-2xl font-bold text-purple-600">
                        {stats.appointmentsBooked}
                      </p>
                      <p className="text-xs text-gray-500">
                        {stats.appointmentsThisMonth} este mes
                      </p>
                    </div>
                    <Calendar className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Tasa de Respuesta
                      </p>
                      <p className="text-2xl font-bold text-orange-600">
                        {stats.responseRate}%
                      </p>
                      <p className="text-xs text-gray-500">
                        Promedio: {stats.averageResponseTime}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Conversations */}
            <Card>
              <CardHeader>
                <CardTitle>Conversaciones Recientes</CardTitle>
                <CardDescription>
                  Últimas interacciones con usuarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {conversations.slice(0, 5).map((conversation) => (
                    <div
                      key={conversation.id}
                      className="flex items-center space-x-4 p-4 border rounded-lg"
                    >
                      <Avatar>
                        <AvatarImage
                          src={conversation.contact.avatar || "/Avatar1.png"}
                        />
                        <AvatarFallback>
                          {conversation.contact.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {conversation.contact.name}
                          </p>
                          <Badge
                            className={getStatusColor(conversation.status)}
                          >
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(conversation.status)}
                              <span>{getStatusText(conversation.status)}</span>
                            </div>
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {conversation.lastMessage}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>{formatTimestamp(conversation.timestamp)}</span>
                          <span>{conversation.flow}</span>
                          <span>{conversation.messagesCount} mensajes</span>
                          {conversation.satisfaction && (
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{conversation.satisfaction}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Métricas de Rendimiento</CardTitle>
                  <CardDescription>Indicadores clave del bot</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tasa de Conversión</span>
                      <span className="font-medium">
                        {stats.conversionRate}%
                      </span>
                    </div>
                    <Progress value={stats.conversionRate} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Satisfacción del Usuario</span>
                      <span className="font-medium">
                        {stats.satisfactionScore}/5
                      </span>
                    </div>
                    <Progress value={(stats.satisfactionScore / 5) * 100} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Conversaciones Completadas</span>
                      <span className="font-medium">
                        {Math.round(
                          (stats.completedConversations /
                            (stats.completedConversations +
                              stats.abandonedConversations)) *
                            100,
                        )}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        (stats.completedConversations /
                          (stats.completedConversations +
                            stats.abandonedConversations)) *
                        100
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Flujos Más Utilizados</CardTitle>
                  <CardDescription>
                    Flujos ordenados por popularidad
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {flows
                      .sort((a, b) => b.totalUses - a.totalUses)
                      .slice(0, 5)
                      .map((flow) => (
                        <div
                          key={flow.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-sm">{flow.name}</p>
                            <p className="text-xs text-gray-500">
                              {flow.totalUses} usos
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Progress
                              value={flow.completionRate}
                              className="w-16"
                            />
                            <span className="text-xs font-medium w-8">
                              {flow.completionRate}%
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Flows Tab */}
          <TabsContent value="flows" className="space-y-8">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  <div>
                    <CardTitle>Flujos de Conversación</CardTitle>
                    <CardDescription>
                      Gestiona los flujos automatizados del bot
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar
                    </Button>
                    <Button onClick={handleCreateFlow}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Flujo
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  {/* Search */}
                  <div className="flex-1">
                    <Label htmlFor="search" className="sr-only">
                      Buscar
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Buscar flujos..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div className="w-full md:w-48">
                    <Select
                      value={statusFilter}
                      onValueChange={handleStatusFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="active">Activos</SelectItem>
                        <SelectItem value="draft">Borradores</SelectItem>
                        <SelectItem value="inactive">Inactivos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Category Filter */}
                  <div className="w-full md:w-48">
                    <Select
                      value={categoryFilter}
                      onValueChange={handleCategoryFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          Todas las categorías
                        </SelectItem>
                        <SelectItem value="appointment">Citas</SelectItem>
                        <SelectItem value="information">Información</SelectItem>
                        <SelectItem value="support">Soporte</SelectItem>
                        <SelectItem value="cancellation">
                          Cancelación
                        </SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* View Mode Toggle */}
                  <ViewToggle />
                </div>

                {/* Results count */}
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Mostrando {clientFilteredFlows.length} de {flows.length}{" "}
                    flujos
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Flows List */}
            <DataView
              data={clientFilteredFlows}
              fields={flowFields}
              actions={flowActions}
              viewMode={viewMode}
              emptyState={{
                icon: <Zap className="h-12 w-12 text-gray-400" />,
                title: "No se encontraron flujos",
                description:
                  "No hay flujos que coincidan con los filtros seleccionados.",
                action: (
                  <Button onClick={handleCreateFlow}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Nuevo Flujo
                  </Button>
                ),
              }}
            />
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-8">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  <div>
                    <CardTitle>Biblioteca de Mensajes</CardTitle>
                    <CardDescription>
                      Plantillas de mensajes reutilizables
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Importar
                    </Button>
                    <Button onClick={handleCreateMessage}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Mensaje
                    </Button>
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
                        placeholder="Buscar mensajes..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div className="w-full md:w-48">
                    <Select
                      value={categoryFilter}
                      onValueChange={handleCategoryFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          Todas las categorías
                        </SelectItem>
                        <SelectItem value="greeting">Saludo</SelectItem>
                        <SelectItem value="appointment">Citas</SelectItem>
                        <SelectItem value="information">Información</SelectItem>
                        <SelectItem value="support">Soporte</SelectItem>
                        <SelectItem value="farewell">Despedida</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* View Mode Toggle */}
                  <ViewToggle />
                </div>

                {/* Results count */}
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Mostrando {clientFilteredMessages.length} de{" "}
                    {messages.length} mensajes
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Messages List */}
            <DataView
              data={clientFilteredMessages}
              fields={messageFields}
              actions={messageActions}
              viewMode={viewMode}
              emptyState={{
                icon: <MessageCircle className="h-12 w-12 text-gray-400" />,
                title: "No se encontraron mensajes",
                description:
                  "No hay mensajes que coincidan con los filtros seleccionados.",
                action: (
                  <Button onClick={handleCreateMessage}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Nuevo Mensaje
                  </Button>
                ),
              }}
            />
          </TabsContent>

          {/* Conversations Tab */}
          <TabsContent value="conversations" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Conversaciones</CardTitle>
                <CardDescription>
                  Historial de interacciones con usuarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  {/* Search */}
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar conversaciones..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Conversations List */}
                <div className="space-y-4">
                  {clientFilteredConversations.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No hay conversaciones
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        No se encontraron conversaciones que coincidan con los
                        filtros.
                      </p>
                    </div>
                  ) : (
                    clientFilteredConversations.map((conversation) => (
                      <Card
                        key={conversation.id}
                        className="hover:shadow-lg transition-shadow"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage
                                src={
                                  conversation.contact.avatar || "/Avatar1.png"
                                }
                              />
                              <AvatarFallback>
                                {conversation.contact.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                                  {conversation.contact.name}
                                </h3>
                                <Badge
                                  className={getStatusColor(
                                    conversation.status,
                                  )}
                                >
                                  <div className="flex items-center space-x-1">
                                    {getStatusIcon(conversation.status)}
                                    <span>
                                      {getStatusText(conversation.status)}
                                    </span>
                                  </div>
                                </Badge>
                              </div>

                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 truncate">
                                {conversation.lastMessage}
                              </p>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>
                                    {formatTimestamp(conversation.timestamp)}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Zap className="h-4 w-4" />
                                  <span>{conversation.flow}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <MessageSquare className="h-4 w-4" />
                                  <span>
                                    {conversation.messagesCount} mensajes
                                  </span>
                                </div>
                                {conversation.satisfaction && (
                                  <div className="flex items-center space-x-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span>{conversation.satisfaction}/5</span>
                                  </div>
                                )}
                              </div>

                              {conversation.appointmentId && (
                                <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
                                  <strong>Cita vinculada:</strong>{" "}
                                  {conversation.appointmentId}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Bot Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle>Configuración del Bot</CardTitle>
                  <CardDescription>
                    Ajustes generales del asistente
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="botName">Nombre del Bot</Label>
                    <Input
                      id="botName"
                      value={configData.name}
                      onChange={(e) =>
                        setConfigData({ ...configData, name: e.target.value })
                      }
                      placeholder="Nombre del asistente"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Respuesta Automática</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Responder automáticamente a los mensajes
                      </p>
                    </div>
                    <Switch
                      checked={configData.autoReply}
                      onCheckedChange={(checked) =>
                        setConfigData({ ...configData, autoReply: checked })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="welcomeMessage">
                      Mensaje de Bienvenida
                    </Label>
                    <Textarea
                      id="welcomeMessage"
                      value={configData.welcomeMessage}
                      onChange={(e) =>
                        setConfigData({
                          ...configData,
                          welcomeMessage: e.target.value,
                        })
                      }
                      placeholder="Mensaje que se envía al iniciar una conversación"
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={handleConfigSave}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? "Guardando..." : "Guardar Configuración"}
                  </Button>
                </CardContent>
              </Card>

              {/* Working Hours */}
              <Card>
                <CardHeader>
                  <CardTitle>Horarios de Atención</CardTitle>
                  <CardDescription>
                    Configura cuando el bot debe responder
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Horarios Habilitados</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Activar horarios de atención específicos
                      </p>
                    </div>
                    <Switch
                      checked={configData.workingHoursEnabled}
                      onCheckedChange={(checked) =>
                        setConfigData({
                          ...configData,
                          workingHoursEnabled: checked,
                        })
                      }
                    />
                  </div>

                  {configData.workingHoursEnabled && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="startTime">Hora de Inicio</Label>
                          <Input
                            id="startTime"
                            type="time"
                            value={configData.workingHoursStart}
                            onChange={(e) =>
                              setConfigData({
                                ...configData,
                                workingHoursStart: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="endTime">Hora de Fin</Label>
                          <Input
                            id="endTime"
                            type="time"
                            value={configData.workingHoursEnd}
                            onChange={(e) =>
                              setConfigData({
                                ...configData,
                                workingHoursEnd: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="outOfHoursMessage">
                          Mensaje Fuera de Horario
                        </Label>
                        <Textarea
                          id="outOfHoursMessage"
                          value={configData.outOfHoursMessage}
                          onChange={(e) =>
                            setConfigData({
                              ...configData,
                              outOfHoursMessage: e.target.value,
                            })
                          }
                          placeholder="Mensaje que se envía fuera del horario de atención"
                          rows={3}
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Connection Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Estado de Conexión</CardTitle>
                  <CardDescription>
                    Información de la conexión con WhatsApp
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          botConfig.status === "connected"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      />
                      <div>
                        <p className="font-medium">
                          {botConfig.status === "connected"
                            ? "Conectado"
                            : "Desconectado"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {botConfig.phoneNumber}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      {botConfig.status === "connected"
                        ? "Desconectar"
                        : "Reconectar"}
                    </Button>
                  </div>

                  {botConfig.status !== "connected" && (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Escanea el código QR con WhatsApp para conectar el bot:
                      </p>
                      <div className="flex justify-center">
                        <div className="w-48 h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                          <img
                            src={botConfig.qrCode || "/Avatar1.png"}
                            alt="QR Code"
                            className="w-40 h-40"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              target.nextElementSibling?.classList.remove(
                                "hidden",
                              );
                            }}
                          />
                          <div className="hidden text-center">
                            <Bot className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">
                              Código QR no disponible
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Analytics Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Resumen de Analytics</CardTitle>
                  <CardDescription>
                    Métricas principales del bot
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">
                        {stats.totalFlows}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Flujos Totales
                      </p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {stats.activeFlows}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Flujos Activos
                      </p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">
                        {stats.totalMessageTemplates}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Plantillas
                      </p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">
                        {stats.satisfactionScore}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Satisfacción
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Tasa de Conversión</span>
                      <span className="font-medium">
                        {stats.conversionRate}%
                      </span>
                    </div>
                    <Progress value={stats.conversionRate} />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Tiempo de Respuesta</span>
                      <span className="font-medium">
                        {stats.averageResponseTime}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Promedio de respuesta del bot
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Flow Dialog */}
        <Dialog open={showFlowDialog} onOpenChange={setShowFlowDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <form onSubmit={handleFlowSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {selectedFlow ? "Editar Flujo" : "Nuevo Flujo"}
                </DialogTitle>
                <DialogDescription>
                  {selectedFlow
                    ? "Modifica la información del flujo"
                    : "Crea un nuevo flujo de conversación"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="flowName" className="text-right">
                    Nombre *
                  </Label>
                  <Input
                    id="flowName"
                    value={flowFormData.name}
                    onChange={(e) =>
                      setFlowFormData({ ...flowFormData, name: e.target.value })
                    }
                    className="col-span-3"
                    placeholder="Nombre del flujo"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="flowTrigger" className="text-right">
                    Disparador *
                  </Label>
                  <Input
                    id="flowTrigger"
                    value={flowFormData.trigger}
                    onChange={(e) =>
                      setFlowFormData({
                        ...flowFormData,
                        trigger: e.target.value,
                      })
                    }
                    className="col-span-3"
                    placeholder="Palabra clave que activa el flujo"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="flowCategory" className="text-right">
                    Categoría *
                  </Label>
                  <Select
                    value={flowFormData.category}
                    onValueChange={(value: any) =>
                      setFlowFormData({ ...flowFormData, category: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="appointment">Citas</SelectItem>
                      <SelectItem value="information">Información</SelectItem>
                      <SelectItem value="support">Soporte</SelectItem>
                      <SelectItem value="cancellation">Cancelación</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="flowDescription" className="text-right">
                    Descripción
                  </Label>
                  <Textarea
                    id="flowDescription"
                    value={flowFormData.description}
                    onChange={(e) =>
                      setFlowFormData({
                        ...flowFormData,
                        description: e.target.value,
                      })
                    }
                    className="col-span-3"
                    placeholder="Descripción del flujo..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowFlowDialog(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? "Guardando..."
                    : selectedFlow
                      ? "Guardar Cambios"
                      : "Crear Flujo"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Message Dialog */}
        <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <form onSubmit={handleMessageSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {selectedMessage ? "Editar Mensaje" : "Nuevo Mensaje"}
                </DialogTitle>
                <DialogDescription>
                  {selectedMessage
                    ? "Modifica la plantilla de mensaje"
                    : "Crea una nueva plantilla de mensaje"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="messageName" className="text-right">
                    Nombre *
                  </Label>
                  <Input
                    id="messageName"
                    value={messageFormData.name}
                    onChange={(e) =>
                      setMessageFormData({
                        ...messageFormData,
                        name: e.target.value,
                      })
                    }
                    className="col-span-3"
                    placeholder="Nombre del mensaje"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="messageTitle" className="text-right">
                    Título
                  </Label>
                  <Input
                    id="messageTitle"
                    value={messageFormData.title}
                    onChange={(e) =>
                      setMessageFormData({
                        ...messageFormData,
                        title: e.target.value,
                      })
                    }
                    className="col-span-3"
                    placeholder="Título del mensaje"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="messageType" className="text-right">
                    Tipo *
                  </Label>
                  <Select
                    value={messageFormData.type}
                    onValueChange={(value: any) =>
                      setMessageFormData({ ...messageFormData, type: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Tipo de mensaje" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Texto</SelectItem>
                      <SelectItem value="interactive">Interactivo</SelectItem>
                      <SelectItem value="confirmation">Confirmación</SelectItem>
                      <SelectItem value="success">Éxito</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="messageCategory" className="text-right">
                    Categoría *
                  </Label>
                  <Select
                    value={messageFormData.category}
                    onValueChange={(value: any) =>
                      setMessageFormData({
                        ...messageFormData,
                        category: value,
                      })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Categoría del mensaje" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="greeting">Saludo</SelectItem>
                      <SelectItem value="appointment">Citas</SelectItem>
                      <SelectItem value="information">Información</SelectItem>
                      <SelectItem value="support">Soporte</SelectItem>
                      <SelectItem value="farewell">Despedida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="messageContent" className="text-right">
                    Contenido *
                  </Label>
                  <Textarea
                    id="messageContent"
                    value={messageFormData.content}
                    onChange={(e) =>
                      setMessageFormData({
                        ...messageFormData,
                        content: e.target.value,
                      })
                    }
                    className="col-span-3"
                    placeholder="Contenido del mensaje... Usa {{variable}} para variables dinámicas"
                    rows={4}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowMessageDialog(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? "Guardando..."
                    : selectedMessage
                      ? "Guardar Cambios"
                      : "Crear Mensaje"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
