"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import {
  Client,
  ClinicalHistoryResponse,
  ChronicDisease,
  Allergy,
  Hospitalization,
  Medication,
  FamilyHistory,
  Habit,
} from "@/types";
import {
  User,
  Calendar,
  MapPin,
  Briefcase,
  Heart,
  AlertTriangle,
  Hospital,
  Pill,
  Users,
  Activity,
  Loader2,
  Plus,
  Edit,
  Phone,
  Trash2,
  FileText,
} from "lucide-react";
import { getClinicalHistory } from "@/actions/clients/findClinicalHistory";
import { toast } from "sonner";
import { openWhatsApp } from "@/utils/functions/openWhatsapp";
import WhatsappIcon from "@/components/icons/whatsapp-icon";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ClinicalHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client;
  // Handlers opcionales para delegado desde el padre (si el padre quiere controlar)
  onEdit?: (client: Client) => void;
  onDelete?: (client: Client) => void;
  onCall?: (client: Client) => void;
  onEmail?: (client: Client) => void;
  onSchedule?: (client: Client) => void;
  onWhatsApp?: (phone: string, message: string) => void;
}

const getSeverityColor = (severity: string) => {
  switch (severity?.toLowerCase()) {
    case "leve":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "moderada":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    case "grave":
    case "severa":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
  }
};

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export function ClinicalHistoryDialog({
  open,
  onOpenChange,
  client,
  onEdit,
  onDelete,
  onCall,
  onEmail,
  onSchedule,
  onWhatsApp,
}: ClinicalHistoryDialogProps) {
  const router = useRouter();
  const [clinicalData, setClinicalData] = useState<
    ClinicalHistoryResponse["data"] | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasHistory, setHasHistory] = useState(false);

  useEffect(() => {
    const fetchClinicalHistory = async () => {
      if (!open) {
        setClinicalData(null);
        setHasHistory(false);
        return;
      }

      setIsLoading(true);

      try {
        const response = await getClinicalHistory(client.id);

        if ("data" in response && response.status === 200) {
          setClinicalData(response.data);
          setHasHistory(true);
        } else {
          // No tiene historial clínico
          setHasHistory(false);
          setClinicalData(null);
        }
      } catch (error) {
        setHasHistory(false);
        setClinicalData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClinicalHistory();
  }, [open, client.id]);

  const handleCreateHistory = () => {
    router.push(`/clients/${client.id}/clinical-history`);
    onOpenChange(false);
  };

  const handleEditHistory = () => {
    router.push(`/clients/${client.id}/clinical-history/edit`);
    onOpenChange(false);
  };

  // ACTIONS: si el padre ha pasado un handler, lo usamos; si no, hacemos un fallback
  const handleEditClient = () => {
    if (onEdit) {
      onEdit(client);
    } else {
      // fallback: navegar a una ruta de edición si existe
      router.push(`/clients/${client.id}/edit`);
    }
    onOpenChange(false);
  };

  const handleDeleteClient = () => {
    if (onDelete) {
      onDelete(client);
      onOpenChange(false);
    } else {
      toast.error("No hay handler de eliminación configurado.");
    }
  };

  const handleCallClient = () => {
    if (onCall) {
      onCall(client);
    } else {
      window.open(`tel:${client.phone}`, "_self");
    }
  };

  const handleViewClientHistory = () => {
    if (onEmail) {
      onEmail(client);
    } else {
      // fallback: navegar a la vista de historial (ruta utilizada en el proyecto)
      router.push(`/clients/${client.id}/history`);
    }
    onOpenChange(false);
  };

  const handleScheduleAppointment = () => {
    if (onSchedule) {
      onSchedule(client);
    } else {
      router.push(`/appointments/new?clientId=${client.id}`);
    }
    onOpenChange(false);
  };

  const handleWhatsApp = () => {
    const message = "Buen dia";
    if (onWhatsApp) {
      onWhatsApp(client.phone, message);
    } else {
      // fallback: abrir WhatsApp web / app
      openWhatsApp(client.phone, message);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Información básica */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={client.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {client.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <div className="text-sm text-muted-foreground">Nombre</div>
                    <div className="font-medium">{client.fullName}</div>

                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="text-muted-foreground">Teléfono</div>
                        <div className="font-medium">{client.phone || "-"}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Correo</div>
                        <div className="font-medium">{client.email || "-"}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botones de acción dentro de la card.
                    Agrego el botón "Editar Historial" aquí, pero solo si existe historial.
                    Si no hay historial se mostrará el botón "Crear Historial" más abajo. */}
                <div className="flex flex-wrap items-center gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleEditClient}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>

                  <Button size="sm" variant="ghost" onClick={handleCallClient}>
                    <Phone className="w-4 h-4 mr-2" />
                    Llamar
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleViewClientHistory}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Ver historial
                  </Button>

                  <Button size="sm" variant="ghost" onClick={handleWhatsApp}>
                    <WhatsappIcon width={16} height={16} className="mr-2" />
                    WhatsApp
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleScheduleAppointment}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Agendar
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleDeleteClient}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar
                  </Button>

                  {/* Editar Historial solo aparece si ya existe historial */}
                  {hasHistory && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={handleEditHistory}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar Historial
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </DialogHeader>

        {/* Card que contiene la información inicial + botones */}
        <div className="px-4"></div>

        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Cargando historial clínico...
              </p>
            </div>
          </div>
        ) : !hasHistory ? (
          <div className="flex flex-col items-center justify-center h-[400px] gap-4 px-4">
            <div className="text-center space-y-2">
              <p className="text-lg font-medium">
                Este paciente no tiene historial clínico
              </p>
              <p className="text-sm text-muted-foreground">
                Crea un nuevo historial clínico para comenzar a registrar
                información médica
              </p>
            </div>
            <Button onClick={handleCreateHistory} size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Crear Historial Clínico
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="h-[calc(90vh-260px)] pr-4">
              <div className="space-y-6 px-4">
                {/* Información Personal */}
                <section>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Información Personal
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-muted/50 p-4 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">DPI</p>
                      <p className="font-medium">
                        {clinicalData?.personalInfo.nationalId || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Género</p>
                      <p className="font-medium">
                        {clinicalData?.personalInfo.gender || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Edad</p>
                      <p className="font-medium">
                        {clinicalData?.personalInfo.age
                          ? `${clinicalData.personalInfo.age} años`
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Fecha de Nacimiento
                      </p>
                      <p className="font-medium flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {clinicalData?.personalInfo.birthDate
                          ? formatDate(clinicalData.personalInfo.birthDate)
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Lugar de Nacimiento
                      </p>
                      <p className="font-medium flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {clinicalData?.personalInfo.birthPlace || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Estado Civil
                      </p>
                      <p className="font-medium">
                        {clinicalData?.personalInfo.maritalStatus || "-"}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Dirección</p>
                      <p className="font-medium">
                        {clinicalData?.personalInfo.address || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ocupación</p>
                      <p className="font-medium flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {clinicalData?.personalInfo.occupation || "-"}
                      </p>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Enfermedades Crónicas */}
                {clinicalData &&
                  clinicalData.clinicalHistory.chronicDiseases.length > 0 && (
                    <section>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-500" />
                        Enfermedades Crónicas
                      </h3>
                      <div className="space-y-3">
                        {clinicalData.clinicalHistory.chronicDiseases.map(
                          (disease: ChronicDisease) => (
                            <div
                              key={disease.id}
                              className="border rounded-lg p-4"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-semibold text-base">
                                  {disease.diseaseName}
                                </h4>
                                <Badge
                                  className={getSeverityColor(disease.severity)}
                                >
                                  {disease.severity}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                  <p className="text-muted-foreground">
                                    Fecha de Diagnóstico
                                  </p>
                                  <p>{formatDate(disease.diagnosisDate)}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">
                                    Tratamiento
                                  </p>
                                  <p>{disease.treatment}</p>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </section>
                  )}

                {/* Alergias */}
                {clinicalData &&
                  clinicalData.clinicalHistory.allergies.length > 0 && (
                    <>
                      <Separator />
                      <section>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-yellow-600" />
                          Alergias
                        </h3>
                        <div className="space-y-3">
                          {clinicalData.clinicalHistory.allergies.map(
                            (allergy: Allergy) => (
                              <div
                                key={allergy.id}
                                className="border border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950 rounded-lg p-4"
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-semibold text-base">
                                    {allergy.allergen}
                                  </h4>
                                  <Badge
                                    className={getSeverityColor(
                                      allergy.severity
                                    )}
                                  >
                                    {allergy.severity}
                                  </Badge>
                                </div>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">
                                      Tipo de Reacción
                                    </p>
                                    <p className="font-medium">
                                      {allergy.reactionType}
                                    </p>
                                  </div>
                                  {allergy.notes && (
                                    <div>
                                      <p className="text-muted-foreground">
                                        Notas
                                      </p>
                                      <p>{allergy.notes}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </section>
                    </>
                  )}

                {/* Hospitalizaciones */}
                {clinicalData &&
                  clinicalData.clinicalHistory.hospitalizations.length > 0 && (
                    <>
                      <Separator />
                      <section>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Hospital className="w-5 h-5 text-blue-500" />
                          Hospitalizaciones
                        </h3>
                        <div className="space-y-3">
                          {clinicalData.clinicalHistory.hospitalizations.map(
                            (hosp: Hospitalization) => (
                              <div
                                key={hosp.id}
                                className="border rounded-lg p-4"
                              >
                                <h4 className="font-semibold text-base mb-2">
                                  {hosp.hospital}
                                </h4>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">
                                      Fecha de Ingreso
                                    </p>
                                    <p>{formatDate(hosp.admissionDate)}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">
                                      Fecha de Alta
                                    </p>
                                    <p>{formatDate(hosp.dischargeDate)}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">
                                      Motivo
                                    </p>
                                    <p>{hosp.reason}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">
                                      Diagnóstico
                                    </p>
                                    <p>{hosp.diagnosis}</p>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </section>
                    </>
                  )}

                {/* Medicamentos Actuales */}
                {clinicalData &&
                  clinicalData.clinicalHistory.currentMedications.length >
                    0 && (
                    <>
                      <Separator />
                      <section>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Pill className="w-5 h-5 text-purple-500" />
                          Medicamentos Actuales
                        </h3>
                        <div className="space-y-3">
                          {clinicalData.clinicalHistory.currentMedications.map(
                            (med: Medication) => (
                              <div
                                key={med.id}
                                className="border rounded-lg p-4"
                              >
                                <h4 className="font-semibold text-base mb-2">
                                  {med.medicationName}
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">
                                      Dosis
                                    </p>
                                    <p>{med.dosage}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">
                                      Frecuencia
                                    </p>
                                    <p>{med.frequency}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">
                                      Médico Prescriptor
                                    </p>
                                    <p>{med.prescribingDoctor}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <p className="text-muted-foreground">
                                      Propósito
                                    </p>
                                    <p>{med.purpose}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">
                                      Fecha de Prescripción
                                    </p>
                                    <p>{formatDate(med.prescriptionDate)}</p>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </section>
                    </>
                  )}

                {/* Historial Familiar */}
                {clinicalData &&
                  clinicalData.clinicalHistory.familyHistory.length > 0 && (
                    <>
                      <Separator />
                      <section>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Users className="w-5 h-5 text-green-500" />
                          Historial Familiar
                        </h3>
                        <div className="space-y-3">
                          {clinicalData.clinicalHistory.familyHistory.map(
                            (history: FamilyHistory) => (
                              <div
                                key={history.id}
                                className="border rounded-lg p-4"
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-semibold text-base">
                                    {history.relative}
                                  </h4>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">
                                      Enfermedad
                                    </p>
                                    <p>{history.diseaseName}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">
                                      Edad al Diagnóstico
                                    </p>
                                    <p>{history.ageAtDiagnosis} años</p>
                                  </div>
                                  {history.notes && (
                                    <div className="col-span-2">
                                      <p className="text-muted-foreground">
                                        Notas
                                      </p>
                                      <p>{history.notes}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </section>
                    </>
                  )}

                {/* Hábitos */}
                {clinicalData &&
                  clinicalData.clinicalHistory.habits.length > 0 && (
                    <>
                      <Separator />
                      <section>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Activity className="w-5 h-5 text-indigo-500" />
                          Hábitos
                        </h3>
                        <div className="space-y-3">
                          {clinicalData.clinicalHistory.habits.map(
                            (habit: Habit) => (
                              <div
                                key={habit.id}
                                className="border rounded-lg p-4"
                              >
                                <h4 className="font-semibold text-base mb-2">
                                  {habit.habitType}
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">
                                      Frecuencia
                                    </p>
                                    <p>{habit.frequency}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">
                                      Cantidad
                                    </p>
                                    <p>{habit.quantity}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">
                                      Fecha de Inicio
                                    </p>
                                    <p>{formatDate(habit.startDate)}</p>
                                  </div>
                                  {habit.description && (
                                    <div className="col-span-2">
                                      <p className="text-muted-foreground">
                                        Descripción
                                      </p>
                                      <p>{habit.description}</p>
                                    </div>
                                  )}
                                  {habit.notes && (
                                    <div className="col-span-3">
                                      <p className="text-muted-foreground">
                                        Notas
                                      </p>
                                      <p>{habit.notes}</p>
                                    </div>
                                  )}
                                  {habit.endDate && (
                                    <div>
                                      <p className="text-muted-foreground">
                                        Fecha de Fin
                                      </p>
                                      <p>{formatDate(habit.endDate)}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </section>
                    </>
                  )}
              </div>
            </ScrollArea>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
