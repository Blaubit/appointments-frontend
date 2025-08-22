"use client";

import type React from "react";

import { useEffect, useState } from "react";
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
import {
  Clock,
  Save,
  CheckCircle,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import type { Service, Client, User, SercviceProfessional } from "@/types";
import { CalendarCard } from "@/components/calendar-card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import create from "@/actions/appointments/create";
import { create as createClient } from "@/actions/clients/create";
import { appointmentSchema } from "@/lib/validations/appointments";
import { findPeriod } from "@/actions/calendar/findPeriod";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import ProfessionalSelectorCard from "@/components/professional-selector";
import { ClientSelectorCard } from "@/components/appointments/new/ClientSelector";
import { AppointmentSuccessDialog } from "@/components/appointments/new/appointmentSuccesDialog";
import { findProfessionalServices } from "@/actions/services/findProfessionalServices";

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

  // Estados existentes
  const [selectedClient, setSelectedClient] = useState(() => {
    if (!clientIdFromUrl) return null;
    return clients.find((client) => client.id === clientIdFromUrl) || null;
  });

  const [selectedProfessional, setSelectedProfessional] = useState<User | null>(
    null,
  );
  const [selectedService, setSelectedService] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [clientSearch, setClientSearch] = useState("");
  const [professionalSearch, setProfessionalSearch] = useState("");
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  // Nuevos estados para servicios del profesional
  const [professionalServices, setProfessionalServices] = useState<Service[]>(
    [],
  );
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);

  // Nuevos estados para horarios disponibles
  const [availableHours, setAvailableHours] = useState<string[]>([]);
  const [isLoadingHours, setIsLoadingHours] = useState(false);
  const [hoursError, setHoursError] = useState<string | null>(null);

  // Estado para controlar si ya se procesaron los parámetros de URL
  const [urlParamsProcessed, setUrlParamsProcessed] = useState(false);

  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    professionalId: professionalIdFromUrl || "",
    service: "",
    date: "",
    time: "",
    duration: "",
    price: "",
    notes: "",
    status: "pending" as const,
  });

  // Función para obtener servicios del profesional
  const fetchProfessionalServices = async (professionalId: string) => {
    if (!professionalId) {
      setProfessionalServices([]);
      return;
    }

    setIsLoadingServices(true);
    setServicesError(null);

    try {
      const result = await findProfessionalServices(professionalId);

      if ("data" in result && result.data) {
        // Extraer los servicios del array de SercviceProfessional
        const services = result.data.map(
          (item: SercviceProfessional) => item.service,
        );
        setProfessionalServices(services);
      } else {
        setProfessionalServices([]);
        setServicesError("Error al cargar los servicios del profesional");
      }
    } catch (error) {
      console.error("Error fetching professional services:", error);
      setProfessionalServices([]);
      setServicesError("Error al cargar los servicios del profesional");
    } finally {
      setIsLoadingServices(false);
    }
  };

  // Efecto principal para procesar parámetros de URL y preseleccionar profesional
  useEffect(() => {
    if (!professionals || urlParamsProcessed) return;

    // Debug: Imprimir información de la sesión del usuario
    console.log("UserSession:", userSession);
    console.log("UserSession role:", userSession?.role);
    console.log("UserSession role name:", userSession?.role?.name);
    console.log("Professionals array:", professionals);

    // 1. Primero seleccionar profesional si viene en la URL
    let professionalToSelect: User | null = null;

    if (professionalIdFromUrl) {
      professionalToSelect =
        professionals.find(
          (p) =>
            p.id === professionalIdFromUrl ||
            p.id.toString() === professionalIdFromUrl,
        ) || null;
      console.log("Professional selected from URL:", professionalToSelect);
    } else if (userSession && userSession.role?.name === "profesional") {
      // Auto-seleccionar si es profesional logueado y no hay professionalId en URL
      // Primero intentamos encontrar el usuario en la lista de profesionales
      professionalToSelect = professionals.find(
        (p) => p.id === userSession.id || p.id.toString() === userSession.id.toString()
      ) || userSession;
      console.log("Professional auto-selected from session:", professionalToSelect);
    }

    if (professionalToSelect) {
      console.log("Setting selected professional:", professionalToSelect);
      setSelectedProfessional(professionalToSelect);
      setFormData((prev) => ({
        ...prev,
        professionalId: professionalToSelect!.id.toString(),
      }));

      // 2. Después de seleccionar el profesional, procesar fecha/hora si vienen en URL
      if (fechaHoraFromUrl) {
        const [fecha, hora] = fechaHoraFromUrl.split("T");
        if (fecha) {
          setSelectedDate(fecha);
          setFormData((prev) => ({ ...prev, date: fecha }));

          // Marcar que los parámetros han sido procesados
          setUrlParamsProcessed(true);

          // Fetch available hours y luego seleccionar la hora
          fetchAvailableHours(professionalToSelect.id.toString(), fecha).then(
            () => {
              if (hora) {
                // Usar setTimeout para asegurar que availableHours se haya actualizado
                setTimeout(() => {
                  setSelectedTime(hora);
                  setFormData((prev) => ({ ...prev, time: hora }));
                }, 100);
              }
            },
          );
        }
      } else {
        setUrlParamsProcessed(true);
      }
    } else {
      console.log("No professional was selected");
      setUrlParamsProcessed(true);
    }
  }, [
    professionals,
    professionalIdFromUrl,
    fechaHoraFromUrl,
    userSession,
    urlParamsProcessed,
  ]);

  // Efecto para cargar servicios cuando cambia el profesional
  useEffect(() => {
    if (selectedProfessional) {
      fetchProfessionalServices(selectedProfessional.id.toString());
      // Limpiar servicios seleccionados cuando cambia el profesional
      setSelectedServices([]);
    } else {
      setProfessionalServices([]);
      setSelectedServices([]);
    }
  }, [selectedProfessional]);

  // Función para obtener horarios disponibles
  const fetchAvailableHours = async (professionalId: string, date: string) => {
    if (!professionalId || !date) {
      setAvailableHours([]);
      return;
    }

    setIsLoadingHours(true);
    setHoursError(null);

    try {
      const result = await findPeriod(professionalId, date, "day");

      if ("data" in result && result.data) {
        // Buscar el día específico en el schedule
        const daySchedule = result.data.schedule.find(
          (day: any) => day.date === date,
        );

        if (daySchedule && daySchedule.availableHours) {
          setAvailableHours(daySchedule.availableHours);
        } else {
          setAvailableHours([]);
          setHoursError("No hay horarios disponibles para este día");
        }
      } else {
        setAvailableHours([]);
        setHoursError("Error al cargar los horarios disponibles");
      }
    } catch (error) {
      console.error("Error fetching available hours:", error);
      setAvailableHours([]);
      setHoursError("Error al cargar los horarios disponibles");
    } finally {
      setIsLoadingHours(false);
    }
  };

  // Efecto para cargar horarios cuando cambia la fecha o el profesional (solo después del procesamiento inicial)
  useEffect(() => {
    if (!urlParamsProcessed) return; // Esperar a que se procesen los parámetros de URL

    if (selectedProfessional && selectedDate) {
      fetchAvailableHours(selectedProfessional.id.toString(), selectedDate);
    } else {
      setAvailableHours([]);
      if (urlParamsProcessed) {
        // Solo limpiar la hora si ya se procesaron los parámetros iniciales
        setSelectedTime("");
      }
    }
  }, [selectedProfessional, selectedDate, urlParamsProcessed]);

  // Resto de los estados y funciones existentes...
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

  const filteredClients = clients.filter((client) =>
    client.fullName.toLowerCase().includes(clientSearch.toLowerCase()),
  );

  const filteredProfessionals =
    professionals?.filter((professional) =>
      professional.fullName
        .toLowerCase()
        .includes(professionalSearch.toLowerCase()),
    ) || [];

  const [selectedServicesData, setSelectedServicesData] = useState<string[]>(
    [],
  );

  useEffect(() => {
    const names = selectedServices.map(
      (id) =>
        professionalServices.find((s) => s.id.toString() === id)?.name || "",
    );
    setSelectedServicesData(names);
  }, [selectedServices, professionalServices]);

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

  const handleClientSelect = (client: any) => {
    setSelectedClient(client);
    setFormData({
      ...formData,
      clientName: client.fullName,
      clientEmail: client.email,
      clientPhone: client.phone,
    });
    setShowNewClientForm(false);
    setClientSearch("");
  };

  const handleProfessionalSelect = (professional: User | null) => {
    setSelectedProfessional(professional);
    setFormData({
      ...formData,
      professionalId: professional ? professional.id.toString() : "",
    });
    setProfessionalSearch("");

    // Limpiar hora seleccionada cuando cambia el profesional
    setSelectedTime("");
    setFormData((prev) => ({ ...prev, time: "" }));
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    const service = professionalServices.find(
      (s) => s.id.toString() === serviceId,
    );
    if (service) {
      setFormData({
        ...formData,
        service: service.name,
        duration: service.durationMinutes.toString(),
        price: service.price.toString(),
      });
    }
  };

  const handleDateChange = (fecha: string) => {
    setSelectedDate(fecha);
    setFormData({ ...formData, date: fecha });

    // Limpiar hora seleccionada cuando cambia la fecha
    setSelectedTime("");
    setFormData((prev) => ({ ...prev, time: "" }));
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setFormData({ ...formData, time });
  };

  // Resto del código de submit y otras funciones permanece igual...
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const dataToValidate = {
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
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
          email: formData.clientEmail || "",
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
        throw new Error("Debe seleccionar o crear un cliente");
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

      const appointmentPromises = selectedServices.map(async (serviceId) => {
        const appointmentData = {
          clientId: clientId.toString(),
          professionalId: selectedProfessional.id.toString(),
          serviceId: serviceId,
          appointmentDate: selectedDate,
          startTime: selectedTime,
          status: "confirmed",
          notes: formData.notes || " ",
        };
        console.log("Creating appointment with data:", appointmentData);
        return await create(appointmentData);
      });

      const results = await Promise.all(appointmentPromises);

      const failedAppointments = results.filter(
        (result) => "message" in result,
      );

      if (failedAppointments.length > 0) {
        throw new Error("Error creating some appointments");
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
      console.error("Error creating appointment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const days = [];

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

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

  // Determinar si el selector debe estar bloqueado
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
            onSelect={(client) => {
              setSelectedClient(client);
              setShowNewClientForm(false);
              setClientSearch("");
              setFormData({
                ...formData,
                clientName: client?.fullName || "",
                clientEmail: client?.email || "",
                clientPhone: client?.phone || "",
              });
            }}
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

          {/* Resto del código permanece igual... */}
          {/* Sección de servicios modificada */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Servicios</span>
              </CardTitle>
              <CardDescription>
                {!selectedProfessional
                  ? "Primero selecciona un profesional para ver sus servicios disponibles"
                  : "Selecciona uno o más servicios para la cita"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedProfessional ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>
                    Selecciona un profesional para ver los servicios disponibles
                  </p>
                </div>
              ) : isLoadingServices ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-gray-500">Cargando servicios...</p>
                </div>
              ) : servicesError ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 mx-auto mb-2 text-red-500 opacity-50" />
                  <p className="text-red-500">{servicesError}</p>
                </div>
              ) : professionalServices.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 mx-auto mb-2 text-gray-400 opacity-50" />
                  <p className="text-gray-500">
                    Este profesional no tiene servicios configurados
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {professionalServices.map((service) => {
                    const isSelected = selectedServices.includes(
                      service.id.toString(),
                    );
                    return (
                      <div
                        key={service.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          isSelected
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                        }`}
                        onClick={() => {
                          const id = service.id.toString();
                          if (isSelected) {
                            setSelectedServices((prev) =>
                              prev.filter((s) => s !== id),
                            );
                          } else {
                            setSelectedServices((prev) => [...prev, id]);
                          }
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {service.name}
                          </h4>
                          {isSelected && (
                            <CheckCircle className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatDuration(service.durationMinutes)}
                          </span>
                          <span className="flex items-center font-medium">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {service.price}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CalendarCard
                initialDate={selectedDate ? new Date(selectedDate) : new Date()}
                onDateSelect={handleDateChange}
              />
            </Card>

            {/* Time Selection - MODIFICADO */}
            <Card>
              <CardHeader>
                <CardTitle>Horario</CardTitle>
                <CardDescription>
                  {!selectedProfessional
                    ? "Primero selecciona un profesional"
                    : !selectedDate
                      ? "Selecciona una fecha para ver los horarios disponibles"
                      : "Selecciona la hora para la cita"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!selectedProfessional || !selectedDate ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>
                      {!selectedProfessional
                        ? "Selecciona un profesional para ver horarios disponibles"
                        : "Selecciona una fecha para ver horarios disponibles"}
                    </p>
                  </div>
                ) : isLoadingHours ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p className="text-gray-500">Cargando horarios...</p>
                  </div>
                ) : hoursError ? (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 mx-auto mb-2 text-red-500 opacity-50" />
                    <p className="text-red-500">{hoursError}</p>
                  </div>
                ) : availableHours.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 mx-auto mb-2 text-gray-400 opacity-50" />
                    <p className="text-gray-500">
                      No hay horarios disponibles para esta fecha
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {availableHours.map((time) => {
                      const isSelected = selectedTime === time;
                      return (
                        <button
                          key={time}
                          type="button"
                          className={`p-3 text-sm rounded-lg border transition-colors ${
                            isSelected
                              ? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                          }`}
                          onClick={() => handleTimeSelect(time)}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Resto del formulario permanece igual... */}
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