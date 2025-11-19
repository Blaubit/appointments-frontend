"use client";

import type React from "react";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import type { Service, Client, User } from "@/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import create from "@/actions/appointments/create";
import { create as createClient } from "@/actions/clients/create";
import { appointmentSchema } from "@/lib/validations/appointments";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import ProfessionalSelectorCard from "@/components/professional-selector";
import { ClientSelectorCard } from "@/components/appointments/new/ClientSelector";
import { ServiceSelectorCard } from "@/components/appointments/new/ServiceSelector";
import { AppointmentSuccessDialog } from "@/components/appointments/new/appointmentSuccesDialog";
import { findProfessionalServices } from "@/actions/services/findProfessionalServices";
import { DateTimeSelectorCard } from "@/components/appointments/new/DateTimeSelector";
import formatCurrency from "@/utils/functions/formatCurrency";

type Props = {
  clients: Client[];
  professionals?: User[];
  userSession?: User;
};

export default function PageClient({
  clients,
  professionals,
  userSession,
}: Props) {
  const searchParams = useSearchParams();
  const clientIdFromUrl = searchParams.get("clientId") ?? "";
  const professionalIdFromUrl = searchParams.get("professionalId") ?? "";
  const fechaHoraFromUrl = searchParams.get("fechaHora"); // Ej: "2025-09-01T14:30"
  const router = useRouter();
  const horaFromUrl = fechaHoraFromUrl?.split("T")[1] ?? "";

  // Estados principales
  const [selectedClient, setSelectedClient] = useState(() => {
    if (!clientIdFromUrl) return null;
    return clients.find((client) => client.id === clientIdFromUrl) || null;
  });

  const [selectedProfessional, setSelectedProfessional] = useState<User | null>(
    null
  );
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [professionalSearch, setProfessionalSearch] = useState("");
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [initialTimeFromUrl, setInitialTimeFromUrl] = useState(horaFromUrl);
  // Servicios del profesional
  const [professionalServices, setProfessionalServices] = useState<Service[]>(
    []
  );
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);
  // Control de parámetros de URL
  const [urlParamsProcessed, setUrlParamsProcessed] = useState(false);

  const [formData, setFormData] = useState({
    clientName: "",
    pacientemail: "",
    clientPhone: "",
    professionalId: professionalIdFromUrl || "",
    duration: "",
    price: "",
    notes: "",
    date: "",
    time: "",
    status: "pending" as const,
  });

  // Obtener servicios del profesional - Mejorada con mejor manejo de errores
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
          console.error("Invalid services data structure:", result);
          setProfessionalServices([]);
          setServicesError(
            "No se pudieron cargar los servicios del profesional"
          );
        }
      } catch (error) {
        console.error("Error fetching professional services:", error);
        setProfessionalServices([]);
        setServicesError("Error al cargar los servicios del profesional");
      } finally {
        setIsLoadingServices(false);
      }
    },
    []
  );

  // Procesamiento de parámetros de URL y auto-selección profesional y fecha/hora
  useEffect(() => {
    if (!professionals || urlParamsProcessed) return;

    let professionalToSelect: User | null = null;

    if (professionalIdFromUrl) {
      professionalToSelect =
        professionals.find(
          (p) =>
            p.id === professionalIdFromUrl ||
            p.id.toString() === professionalIdFromUrl
        ) || null;
    } else if (userSession && userSession.role?.name === "profesional") {
      professionalToSelect =
        professionals.find(
          (p) =>
            p.id === userSession.id ||
            p.id.toString() === userSession.id.toString()
        ) || userSession;
    }

    if (professionalToSelect) {
      setSelectedProfessional(professionalToSelect);
      setFormData((prev) => ({
        ...prev,
        professionalId: professionalToSelect!.id.toString(),
      }));

      if (fechaHoraFromUrl) {
        const [fecha, hora] = fechaHoraFromUrl.split("T");
        if (fecha) {
          setSelectedDate(fecha);
          setFormData((prev) => ({ ...prev, date: fecha }));
          setUrlParamsProcessed(true);
          if (hora) {
            setTimeout(() => {
              setSelectedTime(hora);
              setFormData((prev) => ({ ...prev, time: hora }));
            }, 100);
          }
        }
      } else {
        setUrlParamsProcessed(true);
      }
    } else {
      setUrlParamsProcessed(true);
    }
  }, [
    professionals,
    professionalIdFromUrl,
    fechaHoraFromUrl,
    userSession,
    urlParamsProcessed,
  ]);

  // Cargar servicios cuando cambia el profesional - Corregido para usar Promise correctamente
  useEffect(() => {
    if (selectedProfessional) {
      fetchProfessionalServices(selectedProfessional.id.toString()).catch(
        (error) => {
          console.error("Failed to fetch professional services:", error);
          setServicesError("Error al cargar los servicios del profesional");
        }
      );
      setSelectedServices([]);
    } else {
      setProfessionalServices([]);
      setSelectedServices([]);
    }
  }, [selectedProfessional, fetchProfessionalServices]);

  // Para mostrar nombres de los servicios seleccionados
  const selectedServicesData = selectedServices.map(
    (id) => professionalServices.find((s) => s.id.toString() === id)?.name || ""
  );

  // Para mostrar totales
  const totalPrice = selectedServices.reduce((sum, id) => {
    const service = professionalServices.find((s) => s.id === id);
    return sum + (service ? Number(service.price) : 0);
  }, 0);

  const totalDuration = selectedServices.reduce((sum, id) => {
    const service = professionalServices.find((s) => s.id === id);
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

  const filteredProfessionals =
    professionals?.filter((professional) =>
      professional.fullName
        .toLowerCase()
        .includes(professionalSearch.toLowerCase())
    ) || [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".professional-dropdown-container")) {
        setProfessionalSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handlers
  const handleClientSelect = (client: any) => {
    setSelectedClient(client);
    setFormData({
      ...formData,
      clientName: client.fullName,
      pacientemail: client.email,
      clientPhone: client.phone,
    });
    setShowNewClientForm(false);
  };

  const handleProfessionalSelect = (professional: User | null) => {
    setSelectedProfessional(professional);
    setFormData({
      ...formData,
      professionalId: professional ? professional.id.toString() : "",
    });
    setProfessionalSearch("");
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

  // Función estable para recibir fecha y hora del selector
  const handleDateTimeChange = useCallback((date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setFormData((prev) => ({ ...prev, date, time }));
  }, []);

  // Submit (enviar todos los serviceId juntos!)
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
        const newClientData = {
          fullName: formData.clientName,
          email: formData.pacientemail || "",
          phone: formData.clientPhone,
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

      // Enviar UN solo objeto con todos los IDs de servicio
      const appointmentData = {
        clientId: clientId.toString(),
        professionalId: selectedProfessional.id.toString(),
        serviceId: selectedServices, // <-- Array aquí
        appointmentDate: selectedDate,
        startTime: selectedTime,
        status: "confirmed",
        notes: formData.notes || " ",
        amount: totalPrice,
      };

      const result = await create(appointmentData);

      if ("message" in result) {
        throw new Error(result.message || "Error creando la cita");
      }
      setSuccess(true);
      setOpenDialog(true);
      setTimeout(() => {
        router.push("/appointments");
      }, 1000);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        setError(error.errors.map((err: any) => err.message).join(", "));
      } else {
        setError(error.message || "Error inesperado en la validación");
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
        formData.clientPhone.trim());
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
        title="Nueva Cita"
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
              ¡Cita creada exitosamente! Redirigiendo...
            </AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-8">
          <ClientSelectorCard
            clients={clients}
            selectedClient={selectedClient}
            onSelect={handleClientSelect}
            clientIdFromUrl={clientIdFromUrl}
          />
          <ProfessionalSelectorCard
            professionals={filteredProfessionals}
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
            initialTime={initialTimeFromUrl}
            onChange={handleDateTimeChange}
            selectedServices={selectedServices}
            professionalServices={professionalServices}
          />

          <Card>
            <CardHeader>
              <CardTitle>Información Adicional</CardTitle>
              <CardDescription>
                Notas y detalles especiales para la cita
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                          {formatCurrency(
                            Number(
                              professionalServices.find(
                                (s) => s.name === service
                              )?.price || "0"
                            )
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 border-t pt-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Total:</span>
                      <span className="font-bold text-lg">
                        {formatCurrency(Number(totalPrice.toFixed(2)))}
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
            </CardContent>
          </Card>
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
                  Crear Cita
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
