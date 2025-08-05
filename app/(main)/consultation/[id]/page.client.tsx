"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  History,
  AlertTriangle,
  Heart,
  Pill,
  Activity,
  Save,
  CheckCircle,
  Timer,
  Stethoscope,
  ClipboardList,
  UserCheck,
  Star,
} from "lucide-react"
import Link from "next/link"
import type { Appointment } from "@/types/appointments"

interface ConsultationPageClientProps {
  appointment: Appointment
  recentHistory: Appointment[]
}

export default function ConsultationPageClient({ appointment, recentHistory }: ConsultationPageClientProps) {
  const [consultationNotes, setConsultationNotes] = useState("")
  const [diagnosis, setDiagnosis] = useState("")
  const [treatment, setTreatment] = useState("")
  const [nextAppointment, setNextAppointment] = useState("")
  const [isCompleting, setIsCompleting] = useState(false)

  const client = appointment.client

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }

    return age
  }

  const handleCompleteConsultation = async () => {
    setIsCompleting(true)

    // Simular guardado
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Consulta completada:", {
      appointmentId: appointment.id,
      notes: consultationNotes,
      diagnosis,
      treatment,
      nextAppointment,
    })

    setIsCompleting(false)
    // Aquí se redirigiría a la página de citas o dashboard
  }

  const handleCallClient = () => {
    window.open(`tel:${client.phone}`)
  }

  const handleEmailClient = () => {
    window.open(`mailto:${client.email}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header de la Consulta */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/appointments">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a Citas
                </Button>
              </Link>

              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={client.avatar || "/placeholder.svg"} alt={client.fullName} />
                  <AvatarFallback className="text-lg">{getInitials(client.fullName)}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">{client.fullName}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>{appointment.service.name}</span>
                    <span>•</span>
                    <span>{appointment.appointmentDate.toLocaleString()}</span>
                    <span>•</span>
                    <span>{appointment.startTime}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <Activity className="h-3 w-3 mr-1" />
                En Consulta
              </Badge>

              <Button asChild variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100">
                <Link href={`/clients/${client.id}/history`}>
                  <History className="h-4 w-4 mr-2" />
                  Ver Historial Completo
                </Link>
              </Button>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleCallClient}>
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleEmailClient}>
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenido Principal - Consulta Activa */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información de la Cita Actual */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-blue-600" />
                  Consulta en Progreso
                </CardTitle>
                <CardDescription>
                  {appointment.service.name} - {appointment.service.durationMinutes} minutos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{appointment.appointmentDate.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{appointment.startTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{appointment.company.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>{appointment.professional.fullName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <Timer className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-100">Consulta iniciada</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Tiempo transcurrido:{" "}
                      {new Date().toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notas de la Consulta */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Notas de la Consulta
                </CardTitle>
                <CardDescription>Registra los detalles de la consulta actual</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="consultation-notes">Observaciones y Síntomas</Label>
                  <Textarea
                    id="consultation-notes"
                    placeholder="Describe los síntomas del paciente, observaciones durante la consulta, signos vitales, etc."
                    value={consultationNotes}
                    onChange={(e) => setConsultationNotes(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="diagnosis">Diagnóstico</Label>
                    <Input
                      id="diagnosis"
                      placeholder="Diagnóstico principal"
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="treatment">Tratamiento</Label>
                    <Input
                      id="treatment"
                      placeholder="Tratamiento prescrito"
                      value={treatment}
                      onChange={(e) => setTreatment(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="next-appointment">Próxima Cita (Opcional)</Label>
                  <Input
                    id="next-appointment"
                    type="datetime-local"
                    value={nextAppointment}
                    onChange={(e) => setNextAppointment(e.target.value)}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleCompleteConsultation}
                    disabled={isCompleting}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {isCompleting ? (
                      <>
                        <Activity className="h-4 w-4 mr-2 animate-spin" />
                        Completando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Completar Consulta
                      </>
                    )}
                  </Button>
                  <Button variant="outline">
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Borrador
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Información del Paciente */}
          <div className="space-y-6">
            {/* Información Personal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información del Paciente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={client.avatar || "/placeholder.svg"} alt={client.fullName} />
                    <AvatarFallback>{getInitials(client.fullName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{client.fullName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {`tenemos que guardar los años años`}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Email:</span>
                    <span className="font-medium">{client.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Teléfono:</span>
                    <span className="font-medium">{client.phone}</span>
                  </div>
                  {client.fullName && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Emergencia:</span>
                      <span className="font-medium">{client.phone}</span>
                    </div>
                  )}
                </div>

                {client.tags && client.tags.length > 0 && (
                  <>
                    <Separator />
                    <div className="flex flex-wrap gap-1">
                      {client.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Información Médica Importante */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Información Médica
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 
                vamos a poner info medica????
                {client.allergies && client.allergies.length > 0 && (
                  <Alert className="border-red-200 bg-red-50 dark:bg-red-950">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800 dark:text-red-200">
                      <strong>Alergias:</strong> {client.allergies.join(", ")}
                    </AlertDescription>
                  </Alert>
                )}

                {client.medicalHistory && client.medicalHistory.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <ClipboardList className="h-4 w-4" />
                      Historial Médico
                    </h4>
                    <ul className="text-sm space-y-1">
                      {client.medicalHistory.map((condition, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                          {condition}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {client.medications && client.medications.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <Pill className="h-4 w-4" />
                      Medicación Actual
                    </h4>
                    <ul className="text-sm space-y-1">
                      {client.medications.map((medication, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                          {medication}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            */}
              </CardContent>
            </Card>

            {/* Historial Reciente */}
            {/*
            cuando este el endpoint de historial de citas
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Últimas Citas
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/clients/${client.id}/history`}>Ver Todo</Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentHistory.slice(0, 3).map((pastAppointment) => (
                  <div key={pastAppointment.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-sm">{pastAppointment.service.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{formatDate(pastAppointment.date)}</p>
                      </div>
                      {pastAppointment.rating && pastAppointment.rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{pastAppointment.rating}</span>
                        </div>
                      )}
                    </div>
                    {pastAppointment.notes && (
                      <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">{pastAppointment.notes}</p>
                    )}
                  </div>
                ))}

                <Button asChild variant="outline" className="w-full bg-transparent" size="sm">
                  <Link href={`/clients/${client.id}/history`}>
                    <History className="h-4 w-4 mr-2" />
                    Ver Historial Completo
                  </Link>
                </Button>
              </CardContent>
                </Card>
              */
            }
            

            {/* Estadísticas Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Resumen del Cliente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{client.totalAppointments}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Total Citas</div>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">{client.rating}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Valoración</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
