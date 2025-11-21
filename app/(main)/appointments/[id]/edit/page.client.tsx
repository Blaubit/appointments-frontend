"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Save, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { appointmentSchema } from "@/lib/validations/appointments";
import { z } from "zod";
import ProfessionalSelectorCard from "@/components/professional-selector";
import { ClientSelectorCard } from "@/components/appointments/new/ClientSelector";
import { ServiceSelectorCard } from "@/components/appointments/new/ServiceSelector";
import { DateTimeSelectorCard } from "@/components/appointments/new/DateTimeSelector";
import { AppointmentSuccessDialog } from "@/components/appointments/new/appointmentSuccesDialog";
import { findProfessionalServices } from "@/actions/services/findProfessionalServices";
import { create as createClient } from "@/actions/clients/create";
import updateAppointment from "@/actions/appointments/update";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
  Service,
  Client,
  User,
  Appointment,
  ClientFormData,
} from "@/types";

/*
  EditAppointmentClient

  Reutiliza los componentes de "new" para editar una cita existente.
  Principales cuidados implementados:
  - Lectura de servicios iniciales desde appointment.services (fallback a appointment.serviceId).
  - Normalización de startTime ("HH:MM:SS" -> "HH:MM") para permitir preselección.
  - Paso de appointment.id a DateTimeSelectorCard para que ignore la propia cita en occupiedSlots.
  - Sincronización de selectedServices con los servicios disponibles del profesional cuando se cargan.
  - Conversión de "HH:MM" -> "HH:MM:00" al enviar a la API.
  - UI del campo "Notas" igual que en la página de creación (Label + Textarea).
  - Ahora el payload de actualización envía los servicios como array (serviceId: string[]).
*/

type Props = {
  appointment: Appointment;
  clients: Client[];
  professionals?: User[];
  userSession?: User;
};

interface LocalFormData {
  clientName: string;
  pacientemail?: string;
  clientPhone?: string;
  professionalId: string;
  duration: string;
  price: string;
  notes: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
  status: string;
}

// Helper para obtener el nombre del cliente de forma segura
const getClientFullName = (client: any): string => {
  return client?.fullName || client?.name || client?.firstName || "";
};

// Helper para obtener el email del cliente de forma segura
const getClientEmail = (client: any): string => {
  return client?.email || "";
};

// Helper para obtener el teléfono del cliente de forma segura
const getClientPhone = (client: any): string => {
  return client?.phone || client?.phoneNumber || "";
};

export default function EditAppointmentClient({
  appointment,
  clients,
  professionals,
  userSession,
}: Props) {
  const router = useRouter();
  // --- Helpers / normalizaciones ---
  const normalizeToHHMM = (timeRaw?: string | null) => {
    if (!timeRaw) return "";
    // timeRaw could be "09:30:00" or "09:30"
    const parts = timeRaw.split(":");
    if (parts.length >= 2) {
      const hh = parts[0].padStart(2, "0");
      const mm = parts[1].padStart(2, "0");
      return `${hh}:${mm}`;
    }
    return String(timeRaw);
  };

  const normalizeToHHMMSS = (hhmm?: string) => {
    if (!hhmm) return "";
    const parts = hhmm.split(":");
    if (parts.length === 3) return hhmm;
    if (parts.length === 2) return `${hhmm}:00`;
    return hhmm;
  };

  // --- initial service ids: prefer appointment.services, fallback a appointment.serviceId (legacy) ---
  const initialServiceIds: string[] =
    Array.isArray((appointment as any).services) &&
    (appointment as any).services.length > 0
      ? (appointment as any).services.map((s: any) => String(s.id))
      : Array.isArray((appointment as any).serviceId)
        ? (appointment as any).serviceId.map((s: any) => String(s))
        : (appointment as any).serviceId
          ? [String((appointment as any).serviceId)]
          : [];

  // --- selected client (match por id) ---
  const [selectedClient, setSelectedClient] = useState<Client | null>(() => {
    // Primero intentar encontrar el cliente en la lista 'clients' (puede venir paginada)
    const appointmentClientId = String(appointment.client?.id ?? "");
    const found = clients.find((c) => String(c.id) === appointmentClientId);
    // Si no lo encontramos en la lista, usar appointment.client directamente (debe contener los datos)
    return found ?? (appointment.client as Client) ?? null;
  });

  // --- selected professional (match por id) ---
  const [selectedProfessional, setSelectedProfessional] = useState<User | null>(
    () => {
      const apptProfId = String(appointment.professional?.id ?? "");
      return professionals?.find((p) => String(p.id) === apptProfId) || null;
    }
  );

  // --- selected services (ids normalizados a string) ---
  const [selectedServices, setSelectedServices] =
    useState<string[]>(initialServiceIds);

  // --- selected date/time (date string YYYY-MM-DD, time "HH:MM") ---
  const [selectedDate, setSelectedDate] = useState<string>(
    appointment.appointmentDate
      ? typeof appointment.appointmentDate === "string"
        ? appointment.appointmentDate
        : appointment.appointmentDate.toISOString().split("T")[0]
      : ""
  );

  const [selectedTime, setSelectedTime] = useState<string>(
    normalizeToHHMM(appointment.startTime)
  );

  const [professionalSearch, setProfessionalSearch] = useState("");
  const [showNewClientForm, setShowNewClientForm] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  // --- professional services ---
  const [professionalServices, setProfessionalServices] = useState<Service[]>(
    []
  );
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);

  // --- formData local (strings) ---
  const [formData, setFormData] = useState<LocalFormData>({
    clientName: getClientFullName(selectedClient || appointment.client),
    pacientemail: getClientEmail(selectedClient || appointment.client),
    clientPhone: getClientPhone(selectedClient || appointment.client),
    professionalId:
      selectedProfessional?.id?.toString() ||
      appointment.professional.id?.toString() ||
      "",
    duration: "",
    price:
      appointment.payment && appointment.payment.amount
        ? String(appointment.payment.amount)
        : "",
    notes: appointment.notes || "",
    date: selectedDate,
    time: selectedTime,
    status: appointment.status || "pending",
  });

  // --- fetch professional services ---
  const fetchProfessionalServices = useCallback(
    async (professionalId: string) => {
      if (!professionalId) {
        setProfessionalServices([]);
        return;
      }
      setIsLoadingServices(true);
      setServicesError(null);
      try {
        const result = await findProfessionalServices(professionalId);
        if (
          result &&
          "data" in result &&
          result.data &&
          Array.isArray(result.data)
        ) {
          setProfessionalServices(result.data);
        } else {
          setProfessionalServices([]);
          setServicesError(
            "No se pudieron cargar los servicios del profesional"
          );
        }
      } catch (err) {
        console.error("Error fetching professional services:", err);
        setProfessionalServices([]);
        setServicesError("Error al cargar los servicios del profesional");
      } finally {
        setIsLoadingServices(false);
      }
    },
    []
  );

  // load services when professional changes
  useEffect(() => {
    if (selectedProfessional) {
      fetchProfessionalServices(selectedProfessional.id.toString()).catch(
        (err) => {
          console.error("Failed to fetch services:", err);
          setServicesError("Error al cargar los servicios del profesional");
        }
      );
    } else {
      setProfessionalServices([]);
    }
  }, [selectedProfessional, fetchProfessionalServices]);

  // When professionalServices are loaded, try to auto-select appointment services that belong to this professional
  useEffect(() => {
    if (!professionalServices || professionalServices.length === 0) return;

    const profIds = new Set(professionalServices.map((s) => String(s.id)));

    // appointment services ids (source of truth)
    const apptServiceIds: string[] = Array.isArray(
      (appointment as any).services
    )
      ? (appointment as any).services.map((s: any) => String(s.id))
      : Array.isArray((appointment as any).serviceId)
        ? (appointment as any).serviceId.map((s: any) => String(s))
        : (appointment as any).serviceId
          ? [String((appointment as any).serviceId)]
          : [];

    const filtered = apptServiceIds.filter((id) => profIds.has(id));

    if (filtered.length > 0) {
      setSelectedServices(filtered);
    }
    // if none matched, do not override user's current selection
  }, [professionalServices, appointment]);

  // --- derived UIs ---
  const selectedServicesData = selectedServices.map(
    (id) => professionalServices.find((s) => s.id.toString() === id)?.name || ""
  );

  const totalPrice = selectedServices.reduce((sum, id) => {
    const service = professionalServices.find((s) => s.id.toString() === id);
    return sum + (service ? Number(service.price) : 0);
  }, 0);

  const totalDuration = selectedServices.reduce((sum, id) => {
    const service = professionalServices.find((s) => s.id.toString() === id);
    return sum + (service ? Number(service.durationMinutes) : 0);
  }, 0);

  const formatDuration = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours === 0) {
      return `${minutes} min`;
    } else if (minutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${minutes}min`;
    }
  };

  // --- handlers ---
  const handleClientSelect = (client: any) => {
    setSelectedClient(client);
    setFormData((prev) => ({
      ...prev,
      clientName: getClientFullName(client),
      pacientemail: getClientEmail(client),
      clientPhone: getClientPhone(client),
    }));
    setShowNewClientForm(false);
  };

  const handleProfessionalSelect = (professional: User | null) => {
    setSelectedProfessional(professional);
    setFormData((prev) => ({
      ...prev,
      professionalId: professional ? professional.id.toString() : "",
    }));
    setProfessionalSearch("");
    // reset services/time because professional changed
    setSelectedServices([]);
    setSelectedTime("");
    setFormData((prev) => ({ ...prev, time: "" }));
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleDateTimeChange = useCallback((date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setFormData((prev) => ({ ...prev, date, time }));
  }, []);

  // --- submit (update appointment) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const dataToValidate = {
      clientName: formData.clientName,
      pacientemail: formData.pacientemail,
      clientPhone: formData.clientPhone,
      professionalId: formData.professionalId,
      selectedServices,
      date: selectedDate,
      time: selectedTime,
      notes: formData.notes,
      status: formData.status,
    };

    try {
      appointmentSchema.parse(dataToValidate);

      let clientId = selectedClient?.id;
      if (!clientId || clientId === "temp") {
        const newClientData: ClientFormData = {
          fullName: formData.clientName,
          email: formData.pacientemail || "",
          phone: formData.clientPhone || "",
        };
        const clientResult = await createClient(newClientData);
        if ("data" in clientResult) {
          clientId = clientResult.data.id;
        } else {
          throw new Error(clientResult.message || "Error creating client");
        }
      }

      if (!clientId || clientId === "temp") {
        throw new Error("Debe seleccionar o crear un paciente");
      }
      if (!selectedProfessional) {
        throw new Error("Debe seleccionar un profesional");
      }
      if (selectedServices.length === 0) {
        throw new Error("Debe seleccionar al menos un servicio");
      }
      if (!selectedDate) {
        throw new Error("Debe seleccionar una fecha");
      }
      if (!selectedTime) {
        throw new Error("Debe seleccionar una hora");
      }

      // IMPORTANT: backend now accepts string[] for services — send array
      const normalizedStartTime = normalizeToHHMM(selectedTime); // ensure HH:MM
      const appointmentData: any = {
        id: appointment.id,
        clientId: clientId.toString(),
        professionalId: selectedProfessional.id.toString(),
        // send array of service ids
        serviceId: selectedServices,
        appointmentDate: selectedDate,
        startTime: normalizedStartTime,
        status: formData.status || "confirmed",
        notes: formData.notes || " ",
        amount: totalPrice,
      };
      const result = await updateAppointment(appointmentData);

      if ("message" in result) {
        throw new Error(result.message || "Error actualizando la cita");
      }

      setSuccess(true);
      setOpenDialog(true);
      setTimeout(() => {
        router.push("/appointments");
      }, 1000);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setError(err.errors.map((e: any) => e.message).join(", "));
      } else {
        setError(err.message || "Error inesperado en la validación");
      }
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    const hasClient =
      selectedClient ||
      (showNewClientForm &&
        formData.clientName.trim() &&
        formData.clientPhone?.trim());
    const hasProfessional = selectedProfessional;
    const hasServices = selectedServices.length > 0;
    const hasDateTime = selectedDate && selectedTime;

    return (
      hasClient && hasProfessional && hasServices && hasDateTime && !isLoading
    );
  };

  const isProfessionalUser = userSession?.role?.name === "profesional";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        title="Editar Cita"
        showBackButton={true}
        backButtonText="Citas"
        backButtonHref="/appointments"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert className="mb-6" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mb-6" variant="default">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              ¡Cita actualizada exitosamente! Redirigiendo...
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <ClientSelectorCard
            clients={clients}
            selectedClient={selectedClient}
            onSelect={handleClientSelect}
            // Pasamos el id del cliente de la cita para forzar la preselección incluso si
            // el cliente no está en la página actual de 'clients' (paginación)
            clientIdFromUrl={String(
              selectedClient?.id ?? appointment.client?.id ?? ""
            )}
          />

          <ProfessionalSelectorCard
            professionals={professionals || []}
            selectedProfessional={selectedProfessional}
            onSelectionChange={handleProfessionalSelect}
            title="Seleccionar Profesional"
            description="Elige el profesional que atenderá la cita"
            className="mb-6 sm:mb-8"
            isLocked={isProfessionalUser}
          />

          <ServiceSelectorCard
            services={professionalServices}
            selectedServices={selectedServices}
            onSelectService={handleServiceSelect}
            isLoading={isLoadingServices}
            error={servicesError}
            isLocked={false}
          />

          <DateTimeSelectorCard
            selectedProfessional={selectedProfessional}
            selectedDate={selectedDate}
            initialTime={selectedTime}
            onChange={handleDateTimeChange}
            selectedServices={selectedServices}
            professionalServices={professionalServices}
            appointmentId={appointment.id} // <-- permite ignore de la propia cita en occupiedSlots
          />

          <div className="space-y-4">
            <div>
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Información adicional, instrucciones especiales, etc."
                rows={3}
              />
            </div>

            {selectedServicesData.length > 0 && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Servicios Seleccionados
                </h4>
                <ul className="space-y-2">
                  {selectedServicesData.map((service, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span>{service}</span>
                      <span className="text-sm text-gray-500">
                        $
                        {professionalServices.find((s) => s.name === service)
                          ?.price || "0"}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 border-t pt-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold text-lg">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span>Duración Total:</span>
                    <span className="font-medium">
                      {formatDuration(totalDuration)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <Link href="/appointments">
              <Button type="button" variant="outline" disabled={isLoading}>
                Cancelar
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={!isFormValid()}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Actualizar Cita
                </>
              )}
            </Button>
          </div>

          <AppointmentSuccessDialog
            isOpen={openDialog}
            onClose={() => setOpenDialog(false)}
            onGoToAppointments={() => router.push("/appointments")}
          />
        </form>
      </div>
    </div>
  );
}
