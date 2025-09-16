"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  User,
  MapPin,
  Calendar,
  FileText,
  History,
  Heart,
  Activity,
  Save,
  CheckCircle,
  Timer,
  Stethoscope,
  UserCheck,
  Target,
  Zap,
} from "lucide-react";
import Link from "next/link";
import type { Appointment } from "@/types";
import { Header } from "@/components/header";
import { update } from "@/actions/appointments/appointmentStatus";
import { useRouter } from "next/navigation";
interface ConsultationPageClientProps {
  appointment: Appointment;
  recentHistory: Appointment[];
}

export default function ConsultationPageClient({
  appointment,
  recentHistory,
}: ConsultationPageClientProps) {
  const router = useRouter();
  const [consultationNotes, setConsultationNotes] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [nextAppointment, setNextAppointment] = useState("");
  const [isCompleting, setIsCompleting] = useState(false);
  const [startTime] = useState(new Date());

  const client = appointment.client;
  // services is now an array
  const services = appointment.services || [];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString: string | Date) => {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const getElapsedTime = () => {
    const now = new Date();
    const elapsed = Math.floor(
      (now.getTime() - startTime.getTime()) / 1000 / 60
    );
    return elapsed;
  };

  const handleCompleteConsultation = async () => {
    setIsCompleting(true);
    try {
      await update({
        appointmentId: appointment.id,
        status: "completed",
      });
    } catch (err) {
      // Aquí puedes manejar el error si lo deseas, por ejemplo mostrar un mensaje
      console.error("Error actualizando el estado de la cita:", err);
    }
    // Simular guardado
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Consulta completada:", {
      appointmentId: appointment.id,
      servicesIds: services.map((s) => s.id),
      servicesNames: services.map((s) => s.name),
      notes: consultationNotes,
      diagnosis,
      treatment,
      nextAppointment,
      duration: getElapsedTime(),
    });

    setIsCompleting(false);
    // redirigir a dashboard
    router.push(`/dashboard`);
    // Aquí se redirigiría a la página de citas o dashboard
  };

  const handleCallClient = () => {
    window.open(`tel:${client.phone}`);
  };

  const handleEmailClient = () => {
    window.open(`mailto:${client.email}`);
  };

  const getServiceCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Medicina General":
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      Especialidad:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      Laboratorio: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      Diagnóstico:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      Terapia:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    };
    return (
      colors[category] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    );
  };

  // Helpers para mostrar los servicios
  const renderServicesSummary = (services: any[]) => {
    if (!Array.isArray(services) || services.length === 0)
      return "Sin servicios";
    return services.map((service, idx) => (
      <span key={service.id || idx}>
        {service.name}
        {service.durationMinutes ? ` (${service.durationMinutes} min)` : ""}
        {idx < services.length - 1 ? ", " : ""}
      </span>
    ));
  };
  const renderServicesDetails = (services: any[]) => {
    if (!Array.isArray(services) || services.length === 0)
      return <span>Sin servicios</span>;
    return (
      <ul className="space-y-1">
        {services.map((service, idx) => (
          <li key={service.id || idx}>
            <strong>{service.name}</strong> - {service.durationMinutes} min - €
            {service.price}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header de la Consulta */}
      <Header
        title={`Consulta`}
        showBackButton={true}
        backButtonText="clients"
        backButtonHref="/clients"
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-3 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenido Principal - Consulta Activa */}
          <div className="lg:col-span-2 space-y-10">
            {/* Información de los Servicios y Cita Actual */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Stethoscope className="h-5 w-5 text-blue-600" />
                      {renderServicesSummary(services)}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {services.map((s) => (
                        <span key={s.id} className="block text-xs">
                          {"descripcion de servicio"}
                        </span>
                      ))}
                    </CardDescription>
                  </div>
                  {/* Si tienes categoría en el servicio puedes mostrarla aquí */}
                  <Badge className={getServiceCategoryColor("General")}>
                    {"General"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Detalles de los Servicios */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  {services.map((service, idx) => (
                    <div
                      className="flex items-center gap-2"
                      key={service.id || idx}
                    >
                      <Clock className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                          {service.name}
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          {service.durationMinutes} min
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          Precio: €{service.price || "N/A"}
                        </p>
                      </div>
                    </div>
                  ))}
                  {/* Ubicación y Doctor, solo una vez */}
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Ubicación
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        {appointment.company?.address || "Oficina"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Doctor
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        {appointment.professional?.fullName || "Doctor"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Estado de la Consulta */}
                <div className="flex items-center gap-4 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                  <Timer className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium text-green-900 dark:text-green-100">
                      Consulta en Progreso
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Iniciada a las{" "}
                      {startTime.toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      • Tiempo transcurrido: {getElapsedTime()} min
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Tiempo estimado
                    </p>
                    <p className="font-medium text-green-900 dark:text-green-100">
                      {services.reduce(
                        (sum, s) => sum + (s.durationMinutes || 0),
                        0
                      )}{" "}
                      min
                    </p>
                  </div>
                </div>

                {/* Información de la Cita */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{formatDate(appointment.appointmentDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{appointment.startTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-gray-500" />
                    <Badge variant="outline" className="text-xs">
                      {appointment.status === "paid" ? "Pagado" : "Pendiente"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notas de la Consulta */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Registro de la Consulta
                </CardTitle>
                <CardDescription>
                  Documenta los detalles específicos de esta consulta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="consultation-notes">
                    Observaciones y Hallazgos
                  </Label>
                  <Textarea
                    id="consultation-notes"
                    placeholder={`Registra los hallazgos específicos: síntomas, signos vitales, observaciones durante el examen, etc.`}
                    value={consultationNotes}
                    onChange={(e) => setConsultationNotes(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <div className="grid grid-cols-1  gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="diagnosis">Diagnóstico</Label>
                    <Input
                      id="diagnosis"
                      placeholder="Diagnóstico principal o impresión clínica"
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="treatment">Tratamiento/Plan</Label>
                    <Input
                      id="treatment"
                      placeholder="Tratamiento prescrito o plan de acción"
                      value={treatment}
                      onChange={(e) => setTreatment(e.target.value)}
                    />
                  </div>
                </div>

                {/* Resumen de los Servicios */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Resumen de la Consulta
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="col-span-2">
                      <span className="text-gray-600 dark:text-gray-400">
                        Servicios:
                      </span>
                      {renderServicesDetails(services)}
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">
                        Duración Total Programada:
                      </span>
                      <p className="font-medium">
                        {services.reduce(
                          (sum, s) => sum + (s.durationMinutes || 0),
                          0
                        )}{" "}
                        minutos
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">
                        Precio Total:
                      </span>
                      <p className="font-medium">
                        €
                        {services.reduce(
                          (sum, s) => sum + (Number(s.price) || 0),
                          0
                        )}
                      </p>
                    </div>
                  </div>
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
                    <AvatarImage
                      src={client.avatar || "/placeholder.svg"}
                      alt={client.fullName}
                    />
                    <AvatarFallback>
                      {getInitials(client.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{client.fullName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {`0`} años
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Email:
                    </span>
                    <span className="font-medium">{client.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Teléfono:
                    </span>
                    <span className="font-medium">{client.phone}</span>
                  </div>
                </div>

                {client.tags && client.tags.length > 0 && (
                  <>
                    <Separator />
                    <div className="flex flex-wrap gap-1">
                      {client.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Información Médica Importante 
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Información Médica
                </CardTitle>
              </CardHeader>
            </Card>

            {/* Historial Reciente */}
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
                {recentHistory.map((pastAppointment) => (
                  <div
                    key={pastAppointment.id}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        {/* Mostrar todos los servicios en la cita pasada */}
                        <p className="font-medium text-sm">
                          {renderServicesSummary(pastAppointment.services)}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {formatDate(pastAppointment.appointmentDate)}
                        </p>
                        <Badge
                          variant="outline"
                          className={`text-xs mt-1 ${getServiceCategoryColor("General")}`}
                        ></Badge>
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  asChild
                  variant="outline"
                  className="w-full bg-transparent"
                  size="sm"
                >
                  <Link href={`/clients/${client.id}/history`}>
                    <History className="h-4 w-4 mr-2" />
                    Ver Historial Completo
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Estadísticas Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Resumen del Cliente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {client.totalAppointments || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Total Citas
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {client.rating || "N/A"}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Valoración
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      €{client.totalSpent || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Total Gastado
                    </div>
                  </div>
                  <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                    <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                      {0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Puntos
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
