"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Bot, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Plus, 
  MessageSquare, 
  Settings, 
  BarChart3,
  Calendar,
  Menu,
  X,
  Bell,
  User,
  ArrowLeft
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function WhatsAppBotManager() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [botStatus, setBotStatus] = useState(true)
  const [flows, setFlows] = useState([
    {
      id: 1,
      name: "Agendar Cita",
      trigger: "agendar",
      active: true,
      steps: 3,
      description: "Flujo para agendar nuevas citas",
    },
    {
      id: 2,
      name: "Cancelar Cita",
      trigger: "cancelar",
      active: true,
      steps: 2,
      description: "Flujo para cancelar citas existentes",
    },
    {
      id: 3,
      name: "Consultar Disponibilidad",
      trigger: "disponibilidad",
      active: true,
      steps: 1,
      description: "Mostrar horarios disponibles",
    },
  ])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Planit
                </span>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-gray-400">
                <span>/</span>
                <span className="text-gray-600 dark:text-gray-300">Bot de WhatsApp</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                    3
                  </Badge>
                </Button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">DR</span>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Dr. Roberto Silva</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Médico General</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                  3
                </Badge>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="ghost" className="w-full justify-start">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <div className="flex items-center space-x-3 px-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">DR</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Dr. Roberto Silva</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Médico General</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Bot de{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                WhatsApp
              </span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Automatiza la gestión de citas con tu asistente virtual inteligente
            </p>
            <div className="flex items-center justify-center mt-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${botStatus ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {botStatus ? 'Bot Activo' : 'Bot Inactivo'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs principales */}
          <Tabs defaultValue="flows" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
              <TabsTrigger value="flows" className="text-xs sm:text-sm">
                <MessageSquare className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Flujos</span>
                <span className="sm:hidden">Flujos</span>
              </TabsTrigger>
              <TabsTrigger value="messages" className="text-xs sm:text-sm">
                <Edit className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Mensajes</span>
                <span className="sm:hidden">Msgs</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs sm:text-sm">
                <Settings className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Configuración</span>
                <span className="sm:hidden">Config</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs sm:text-sm">
                <BarChart3 className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Estadísticas</span>
                <span className="sm:hidden">Stats</span>
              </TabsTrigger>
            </TabsList>

            {/* Gestión de Flujos */}
            <TabsContent value="flows" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    Flujos de Conversación
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                    Gestiona las respuestas automáticas de tu bot
                  </p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Flujo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Crear Nuevo Flujo</DialogTitle>
                      <DialogDescription>Define un nuevo flujo de conversación para el bot</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="flow-name">Nombre del Flujo</Label>
                        <Input id="flow-name" placeholder="Ej: Reagendar Cita" />
                      </div>
                      <div>
                        <Label htmlFor="flow-trigger">Palabra Clave</Label>
                        <Input id="flow-trigger" placeholder="Ej: reagendar" />
                      </div>
                      <div>
                        <Label htmlFor="flow-description">Descripción</Label>
                        <Textarea id="flow-description" placeholder="Describe qué hace este flujo..." />
                      </div>
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                        Crear Flujo
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {flows.map((flow) => (
                  <Card key={flow.id} className="hover:shadow-lg transition-shadow h-full">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg sm:text-xl">{flow.name}</CardTitle>
                        <div className="flex items-center space-x-2">
                          {flow.active ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </div>
                      <CardDescription className="text-sm sm:text-base">{flow.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Palabra clave:</span>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                          {flow.trigger}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Pasos:</span>
                        <span className="font-medium">{flow.steps}</span>
                      </div>
                      <Separator />
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          Probar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Plantillas de Mensajes */}
            <TabsContent value="messages" className="space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Plantillas de Mensajes
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  Personaliza los mensajes que enviará tu bot
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                        <MessageSquare className="h-4 w-4 text-white" />
                      </div>
                      <span>Mensaje de Bienvenida</span>
                    </CardTitle>
                    <CardDescription>Primer mensaje que reciben los usuarios</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      rows={4}
                      defaultValue="¡Hola! 👋 Soy tu asistente virtual para agendar citas. 

Puedes escribir:
• 'agendar' para nueva cita
• 'cancelar' para cancelar
• 'disponibilidad' para ver horarios"
                    />
                    <Button size="sm" className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                      Guardar
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <span>Confirmación de Cita</span>
                    </CardTitle>
                    <CardDescription>Mensaje al confirmar una cita</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      rows={4}
                      defaultValue="✅ ¡Perfecto! Tu cita ha sido confirmada:

📅 Fecha: {fecha}
🕐 Hora: {hora}
👤 Cliente: {nombre}

Te enviaremos un recordatorio 24 horas antes."
                    />
                    <Button size="sm" className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                      Guardar
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                        <Bell className="h-4 w-4 text-white" />
                      </div>
                      <span>Recordatorio de Cita</span>
                    </CardTitle>
                    <CardDescription>Recordatorio automático</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      rows={4}
                      defaultValue="🔔 Recordatorio: Tienes una cita mañana {fecha} a las {hora}.

¿Confirmas tu asistencia?
• Responde 'SÍ' para confirmar
• Responde 'NO' para cancelar"
                    />
                    <Button size="sm" className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                      Guardar
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
                        <XCircle className="h-4 w-4 text-white" />
                      </div>
                      <span>Mensaje de Error</span>
                    </CardTitle>
                    <CardDescription>Cuando no se entiende la solicitud</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      rows={4}
                      defaultValue="❓ No entendí tu mensaje. 

Puedes escribir:
• 'agendar' - para nueva cita
• 'cancelar' - para cancelar cita
• 'ayuda' - para más opciones"
                    />
                    <Button size="sm" className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                      Guardar
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Configuración */}
            <TabsContent value="settings" className="space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Configuración del Bot
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  Conecta y configura tu bot de WhatsApp
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                        <Settings className="h-4 w-4 text-white" />
                      </div>
                      <span>Conexión WhatsApp</span>
                    </CardTitle>
                    <CardDescription>Configura la conexión con WhatsApp Business API</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="phone">Número de Teléfono</Label>
                      <Input id="phone" placeholder="+502 3247 0635" />
                    </div>
                    <div>
                      <Label htmlFor="token">Token de Acceso</Label>
                      <Input id="token" type="password" placeholder="••••••••••••" />
                    </div>
                    <div>
                      <Label htmlFor="webhook">URL del Webhook</Label>
                      <Input id="webhook" placeholder="https://tu-dominio.com/webhook" />
                    </div>
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                      Probar Conexión
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <span>Comportamiento del Bot</span>
                    </CardTitle>
                    <CardDescription>Personaliza cómo interactúa tu bot</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="bot-name">Nombre del Bot</Label>
                      <Input id="bot-name" defaultValue="Asistente Virtual" />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div>
                        <Label htmlFor="auto-reply" className="font-medium">Respuesta automática</Label>
                        <p className="text-xs text-gray-500">Responder automáticamente a los mensajes</p>
                      </div>
                      <Switch id="auto-reply" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div>
                        <Label htmlFor="typing-indicator" className="font-medium">Indicador de escritura</Label>
                        <p className="text-xs text-gray-500">Mostrar cuando el bot está escribiendo</p>
                      </div>
                      <Switch id="typing-indicator" defaultChecked />
                    </div>

                    <div>
                      <Label htmlFor="response-delay">Retraso de respuesta</Label>
                      <Select defaultValue="2">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 segundo</SelectItem>
                          <SelectItem value="2">2 segundos</SelectItem>
                          <SelectItem value="3">3 segundos</SelectItem>
                          <SelectItem value="5">5 segundos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                      Guardar Configuración
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Estadísticas */}
            <TabsContent value="analytics" className="space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Estadísticas del Bot
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  Analiza el rendimiento de tu asistente virtual
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-blue-600 mb-2">47</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Conversaciones hoy</p>
                    <p className="text-xs text-green-600 font-medium">+12% vs ayer</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-green-600 mb-2">23</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Citas agendadas</p>
                    <p className="text-xs text-green-600 font-medium">+8% vs ayer</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-purple-600 mb-2">94%</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tasa de éxito</p>
                    <p className="text-xs text-green-600 font-medium">+2% vs ayer</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Flujos Más Utilizados (Últimos 7 días)</span>
                  </CardTitle>
                  <CardDescription>Rendimiento de cada flujo de conversación</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {flows.map((flow) => {
                      const usage = Math.floor(Math.random() * 50) + 10
                      const percentage = Math.floor(Math.random() * 80) + 20
                      return (
                        <div key={flow.id} className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">{flow.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{usage} usos esta semana</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-10 text-right">
                              {percentage}%
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
