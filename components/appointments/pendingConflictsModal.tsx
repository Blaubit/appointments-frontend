"use client";

import { useState } from "react";
import {
  getPendingConflicts,
  Restriction,
  AffectedAppointment,
} from "@/actions/user/restriction/getPendingConflicts";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  User as UserIcon,
  AlertCircle,
  RefreshCw,
  AlertTriangle,
  Ban,
  FileText,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AppointmentDetailsDialog } from "@/components/appointment-details-dialog";

type PendingConflictsModalProps = {
  professionals: User[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function PendingConflictsModal({
  professionals,
  open,
  onOpenChange,
}: PendingConflictsModalProps) {
  const [selectedProfessional, setSelectedProfessional] = useState<string>("");
  const [restrictions, setRestrictions] = useState<Restriction[]>([]);
  const [totalConflicts, setTotalConflicts] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Estado para el dialog de detalles
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const handleSearch = async () => {
    if (!selectedProfessional) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const result = await getPendingConflicts(selectedProfessional);

      if ("data" in result) {
        setRestrictions(result.data.restrictions || []);
        setTotalConflicts(result.data.totalConflicts || 0);
      } else {
        setError(result.message || "Error al obtener conflictos");
        setRestrictions([]);
        setTotalConflicts(0);
      }
    } catch (err) {
      setError("Ocurrió un error inesperado");
      setRestrictions([]);
      setTotalConflicts(0);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedProfessional("");
    setRestrictions([]);
    setTotalConflicts(0);
    setError(null);
    setHasSearched(false);
  };

  const handleClose = () => {
    handleReset();
    onOpenChange(false);
  };

  const handleAppointmentClick = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setIsDetailsDialogOpen(true);
  };

  const formatTime = (time: string | null) => {
    if (!time) return "Todo el día";
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700";
      case "confirmed":
        return "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700";
      case "cancelled":
        return "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700";
      case "completed":
        return "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700";
      case "in_progress":
        return "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700";
      case "waitlist":
        return "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Pendiente",
      confirmed: "Confirmada",
      cancelled: "Cancelada",
      completed: "Completada",
      in_progress: "En Progreso",
      waitlist: "Lista de Espera",
    };
    return labels[status.toLowerCase()] || status;
  };

  const getTotalAffectedAppointments = () => {
    return restrictions.reduce(
      (total, restriction) => total + restriction.affectedAppointments.length,
      0
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-red-500" />
              Restricciones con Conflictos Pendientes
            </DialogTitle>
            <DialogDescription>
              Consulta las restricciones que tienen citas en conflicto por
              profesional
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="professional-conflicts">
                Seleccionar Profesional <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Select
                  value={selectedProfessional}
                  onValueChange={setSelectedProfessional}
                  disabled={loading}
                >
                  <SelectTrigger id="professional-conflicts" className="flex-1">
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
                <Button
                  onClick={handleSearch}
                  disabled={!selectedProfessional || loading}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Buscar Conflictos
                    </>
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {hasSearched && !loading && !error && (
              <>
                <Alert
                  className={`${
                    totalConflicts > 0
                      ? "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
                      : "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                  }`}
                >
                  <AlertCircle
                    className={`h-4 w-4 ${
                      totalConflicts > 0 ? "text-red-600" : "text-green-600"
                    }`}
                  />
                  <AlertTitle
                    className={`${
                      totalConflicts > 0
                        ? "text-red-800 dark:text-red-200"
                        : "text-green-800 dark:text-green-200"
                    }`}
                  >
                    {totalConflicts > 0
                      ? `⚠️ ${totalConflicts} Restricción${
                          totalConflicts !== 1 ? "es" : ""
                        } con Conflictos`
                      : "✓ Sin Conflictos"}
                  </AlertTitle>
                  <AlertDescription
                    className={`${
                      totalConflicts > 0
                        ? "text-red-700 dark:text-red-300"
                        : "text-green-700 dark:text-green-300"
                    }`}
                  >
                    {totalConflicts > 0
                      ? `${getTotalAffectedAppointments()} cita${
                          getTotalAffectedAppointments() !== 1 ? "s" : ""
                        } afectada${
                          getTotalAffectedAppointments() !== 1 ? "s" : ""
                        } por ${totalConflicts} restricción${
                          totalConflicts !== 1 ? "es" : ""
                        }. `
                      : "No hay restricciones con conflictos pendientes para este profesional."}
                  </AlertDescription>
                </Alert>

                {restrictions.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Ban className="h-4 w-4 text-red-500" />
                      Restricciones con Conflictos ({restrictions.length})
                    </h4>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                      {restrictions.map((restriction) => (
                        <Card
                          key={restriction.id}
                          className="border-2 border-red-200 dark:border-red-800"
                        >
                          <CardHeader className="bg-red-50 dark:bg-red-950/50 pb-3">
                            <CardTitle className="text-base flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Ban className="h-5 w-5 text-red-600" />
                                <div>
                                  <div className="font-semibold text-gray-900 dark:text-white">
                                    Restricción -{" "}
                                    {formatDate(restriction.restrictionDate)}
                                  </div>
                                  <div className="text-sm font-normal text-gray-600 dark:text-gray-400 mt-1">
                                    <Clock className="h-3 w-3 inline mr-1" />
                                    {restriction.startTime &&
                                    restriction.endTime
                                      ? `${formatTime(restriction.startTime)} - ${formatTime(restriction.endTime)}`
                                      : "Todo el día"}
                                  </div>
                                </div>
                              </div>
                              <Badge
                                variant="destructive"
                                className="text-xs font-semibold"
                              >
                                {restriction.affectedAppointments.length} cita
                                {restriction.affectedAppointments.length !== 1
                                  ? "s"
                                  : ""}
                              </Badge>
                            </CardTitle>

                            {(restriction.reason || restriction.notes) && (
                              <div className="mt-2 space-y-1">
                                {restriction.reason && (
                                  <div className="text-sm text-gray-600 dark:text-gray-400">
                                    <span className="font-medium">Razón:</span>{" "}
                                    {restriction.reason}
                                  </div>
                                )}
                                {restriction.notes && (
                                  <div className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-1">
                                    <FileText className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                    <span>{restriction.notes}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </CardHeader>

                          <CardContent className="pt-4">
                            <div className="space-y-3">
                              <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-orange-500" />
                                Citas Afectadas
                              </h5>

                              <div className="space-y-2">
                                {restriction.affectedAppointments.map(
                                  (appointment) => (
                                    <Card
                                      key={appointment.id}
                                      className="border-l-4 border-l-orange-500 hover:shadow-md transition-shadow cursor-pointer"
                                      onClick={() =>
                                        handleAppointmentClick(appointment.id)
                                      }
                                    >
                                      <CardContent className="p-3">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                          <div className="flex items-start gap-3 flex-1 min-w-0">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full flex-shrink-0">
                                              <UserIcon className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <h6 className="font-semibold text-gray-900 dark:text-white truncate">
                                                {appointment.clientName}
                                              </h6>
                                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1 text-xs text-gray-600 dark:text-gray-400">
                                                <div className="flex items-center gap-1">
                                                  <Calendar className="h-3 w-3" />
                                                  <span>
                                                    {formatDate(
                                                      appointment.date
                                                    )}
                                                  </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                  <Clock className="h-3 w-3" />
                                                  <span className="font-medium">
                                                    {formatTime(
                                                      appointment.startTime
                                                    )}{" "}
                                                    -{" "}
                                                    {formatTime(
                                                      appointment.endTime
                                                    )}
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>

                                          <div className="flex items-center gap-2 flex-shrink-0">
                                            <Badge
                                              variant="outline"
                                              className={`text-xs font-medium ${getStatusColor(
                                                appointment.status
                                              )}`}
                                            >
                                              {getStatusLabel(
                                                appointment.status
                                              )}
                                            </Badge>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
              <Button
                onClick={handleReset}
                variant="outline"
                disabled={loading}
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Nueva Búsqueda
              </Button>
              <Button
                onClick={handleClose}
                variant="ghost"
                disabled={loading}
                className="flex-1"
              >
                Cerrar
              </Button>
            </div>
          </div>
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
