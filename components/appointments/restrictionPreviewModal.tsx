"use client";

import { useState } from "react";
import {
  createRestriction,
  RestrictionPreviewFormData,
} from "@/actions/user/restriction/previewRestriction";
import { User } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  X,
  Plus,
  Calendar,
  Clock,
  User as UserIcon,
  AlertTriangle,
  Eye,
  Check,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { AppointmentDetailsDialog } from "@/components/appointment-details-dialog";

type RestrictionPreviewModalProps = {
  professionals: User[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type AffectedAppointment = {
  id: string;
  clientName: string;
  date: string;
  startTime: string;
  endTime: string;
};

type PreviewResponse = {
  affectedCount: number;
  appointments: AffectedAppointment[];
};

export default function RestrictionPreviewModal({
  professionals,
  open,
  onOpenChange,
}: RestrictionPreviewModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<RestrictionPreviewFormData>({
    professionalId: "",
    restrictionDate: [],
    startTime: "",
    endTime: "",
  });

  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [currentDate, setCurrentDate] = useState("");

  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<PreviewResponse | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Estado para el dialog de detalles
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const handleAddDate = () => {
    if (currentDate && !selectedDates.includes(currentDate)) {
      const newDates = [...selectedDates, currentDate].sort();
      setSelectedDates(newDates);
      setFormData({ ...formData, restrictionDate: newDates });
      setCurrentDate("");
    }
  };

  const handleRemoveDate = (dateToRemove: string) => {
    const newDates = selectedDates.filter((date) => date !== dateToRemove);
    setSelectedDates(newDates);
    setFormData({ ...formData, restrictionDate: newDates });
  };

  const handlePreview = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingPreview(true);
    setError(null);
    setPreviewData(null);
    setSuccessMessage(null);

    try {
      const result = await createRestriction({
        professionalId: formData.professionalId,
        restrictionDate: formData.restrictionDate,
        startTime: formData.startTime || undefined,
        endTime: formData.endTime || undefined,
        mode: "preview",
      });

      if ("data" in result) {
        setPreviewData(result.data as PreviewResponse);
      } else {
        setError(result.message || "An error occurred");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleCreate = async () => {
    setLoadingCreate(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await createRestriction({
        professionalId: formData.professionalId,
        restrictionDate: formData.restrictionDate,
        startTime: formData.startTime || undefined,
        endTime: formData.endTime || undefined,
        mode: "create",
      });

      if ("data" in result) {
        const data = result.data as PreviewResponse;
        setSuccessMessage(
          `✅ Restricción creada exitosamente. ${data.affectedCount} cita${data.affectedCount !== 1 ? "s" : ""} afectada${data.affectedCount !== 1 ? "s" : ""}. `
        );
        setPreviewData(data);

        setTimeout(() => {
          handleClose();
          router.refresh();
        }, 2000);
      } else {
        setError(result.message || "An error occurred");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleReset = () => {
    setFormData({
      professionalId: "",
      restrictionDate: [],
      startTime: "",
      endTime: "",
    });
    setSelectedDates([]);
    setCurrentDate("");
    setError(null);
    setPreviewData(null);
    setSuccessMessage(null);
  };

  const handleClose = () => {
    handleReset();
    onOpenChange(false);
  };

  const handleAppointmentClick = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setIsDetailsDialogOpen(true);
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const isFormValid = formData.professionalId && selectedDates.length > 0;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Calendar className="h-6 w-6 text-blue-500" />
              Crear Restricción de Disponibilidad
            </DialogTitle>
            <DialogDescription>
              Selecciona un profesional y las fechas para crear una restricción.
              Puedes previsualizarla antes de confirmar.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePreview} className="space-y-6 mt-4">
            {/* Professional Selection */}
            <div className="space-y-2">
              <Label htmlFor="professional">
                Profesional <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.professionalId}
                onValueChange={(value) =>
                  setFormData({ ...formData, professionalId: value })
                }
                disabled={loadingPreview || loadingCreate}
              >
                <SelectTrigger id="professional">
                  <SelectValue placeholder="Selecciona un profesional" />
                </SelectTrigger>
                <SelectContent>
                  {professionals?.map((prof) => (
                    <SelectItem key={prof.id} value={prof.id}>
                      {prof.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
              <Label htmlFor="date">
                Fechas de Restricción <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  id="date"
                  value={currentDate}
                  onChange={(e) => setCurrentDate(e.target.value)}
                  className="flex-1"
                  disabled={loadingPreview || loadingCreate}
                />
                <Button
                  type="button"
                  onClick={handleAddDate}
                  disabled={!currentDate || loadingPreview || loadingCreate}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar
                </Button>
              </div>

              {selectedDates.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedDates.map((date) => (
                    <span
                      key={date}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                    >
                      <Calendar className="h-3 w-3" />
                      {new Date(date + "T00:00:00").toLocaleDateString(
                        "es-ES",
                        {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        }
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveDate(date)}
                        className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0. 5"
                        disabled={loadingPreview || loadingCreate}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Time Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime" className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Hora Inicio (Opcional)
                </Label>
                <Input
                  type="time"
                  id="startTime"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  disabled={loadingPreview || loadingCreate}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime" className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Hora Fin (Opcional)
                </Label>
                <Input
                  type="time"
                  id="endTime"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  disabled={loadingPreview || loadingCreate}
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                <Check className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  {successMessage}
                </AlertDescription>
              </Alert>
            )}

            {previewData && !successMessage && (
              <div className="space-y-4">
                <Alert
                  className={`${
                    previewData.affectedCount > 0
                      ? "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800"
                      : "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                  }`}
                >
                  <AlertTriangle
                    className={`h-4 w-4 ${
                      previewData.affectedCount > 0
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-semibold ${
                          previewData.affectedCount > 0
                            ? "text-yellow-800 dark:text-yellow-200"
                            : "text-green-800 dark:text-green-200"
                        }`}
                      >
                        {previewData.affectedCount > 0
                          ? `⚠️ ${previewData.affectedCount} cita${previewData.affectedCount !== 1 ? "s" : ""} será${previewData.affectedCount !== 1 ? "n" : ""} afectada${previewData.affectedCount !== 1 ? "s" : ""}`
                          : "✓ No hay citas afectadas"}
                      </span>
                    </div>
                  </AlertDescription>
                </Alert>

                {previewData.appointments &&
                  previewData.appointments.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                        Citas que serán afectadas:
                      </h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                        {previewData.appointments.map((appointment) => (
                          <Card
                            key={appointment.id}
                            className="border-l-4 border-l-orange-500 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() =>
                              handleAppointmentClick(appointment.id)
                            }
                          >
                            <CardContent className="p-4">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div className="flex items-start gap-3 flex-1">
                                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                                    <UserIcon className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-semibold text-gray-900 dark:text-white truncate">
                                      {appointment.clientName}
                                    </h5>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1 text-sm text-gray-600 dark:text-gray-400">
                                      <div className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        <span>
                                          {formatDate(appointment.date)}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        <span className="font-medium">
                                          {formatTime(appointment.startTime)} -{" "}
                                          {formatTime(appointment.endTime)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 text-xs font-medium rounded-full">
                                    Conflicto
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
              <Button
                type="submit"
                disabled={!isFormValid || loadingPreview || loadingCreate}
                variant="outline"
                className="flex-1"
              >
                {loadingPreview ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Previsualizando...
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Vista Previa
                  </>
                )}
              </Button>

              <Button
                type="button"
                onClick={handleCreate}
                disabled={
                  !previewData ||
                  loadingPreview ||
                  loadingCreate ||
                  !!successMessage
                }
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                {loadingCreate ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Creando...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Confirmar Restricción
                  </>
                )}
              </Button>

              <Button
                type="button"
                onClick={handleReset}
                variant="ghost"
                disabled={loadingPreview || loadingCreate}
                className="sm:w-auto"
              >
                Limpiar
              </Button>

              <Button
                type="button"
                onClick={handleClose}
                variant="ghost"
                disabled={loadingCreate}
                className="sm:w-auto"
              >
                Cerrar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de detalles de la cita */}
      {selectedAppointmentId && (
        <AppointmentDetailsDialog
          appointmentId={selectedAppointmentId}
          isOpen={isDetailsDialogOpen}
          onClose={() => {
            setIsDetailsDialogOpen(false);
            setSelectedAppointmentId(null);
          }}
          onCancel={() => {}}
          onDelete={() => {}}
          onCall={() => {}}
          onEmail={() => {}}
        />
      )}
    </>
  );
}
