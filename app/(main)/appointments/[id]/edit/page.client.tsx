"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import type { Service, Client, User, Appointment } from "@/types";
import { findProfessionalServices } from "@/actions/services/findProfessionalServices";
import ProfessionalSelectorCard from "@/components/professional-selector";
import { ClientSelectorCard } from "@/components/appointments/new/ClientSelector";
import { ServiceSelectorCard } from "@/components/appointments/new/ServiceSelector";
import { DateTimeSelectorCard } from "@/components/appointments/new/DateTimeSelector";

type Props = {
  clients: Client[];
  professionals: User[];
  appointment: Appointment;
};

export default function PageEditClient({
  clients,
  professionals,
  appointment,
}: Props) {
  const router = useRouter();

  // Cliente
  const initialClient =
    clients.find((c) => c.id === appointment.client.id) || null;
  const [selectedClient, setSelectedClient] = useState<Client | null>(
    initialClient,
  );

  // Profesional
  const initialProfessional =
    professionals.find((p) => p.id === appointment.professional.id) || null;
  const [selectedProfessional, setSelectedProfessional] = useState<User | null>(
    initialProfessional,
  );

  // Servicios (array de IDs)
  const initialServiceIds = Array.isArray(appointment.services)
    ? appointment.services.map((s) => String(s.id))
    : [];
  const [selectedServices, setSelectedServices] =
    useState<string[]>(initialServiceIds);

  // Fecha y hora: usa los types de tu modelo (string)
  const [selectedDate, setSelectedDate] = useState<string>(
    appointment.appointmentDate.toLocaleString() || "",
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    appointment.startTime || "",
  );

  // Notas
  const [notes, setNotes] = useState<string>(appointment.notes || "");

  // Servicios del profesional
  const [professionalServices, setProfessionalServices] = useState<Service[]>(
    [],
  );
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);

  // Cargar servicios cuando cambia el profesional
  useEffect(() => {
    const fetchServices = async () => {
      if (!selectedProfessional) {
        setProfessionalServices([]);
        return;
      }
      setIsLoadingServices(true);
      setServicesError(null);
      try {
        const result = await findProfessionalServices(
          selectedProfessional.id.toString(),
        );
        if (
          "data" in result &&
          result.data &&
          Array.isArray(result.data.services)
        ) {
          setProfessionalServices(result.data.services);
        } else {
          setProfessionalServices([]);
          setServicesError("Error al cargar los servicios del profesional");
        }
      } catch (error) {
        setProfessionalServices([]);
        setServicesError("Error al cargar los servicios del profesional");
      } finally {
        setIsLoadingServices(false);
      }
    };
    fetchServices();
  }, [selectedProfessional]);

  // Helpers para UI
  const selectedServicesData = selectedServices.map(
    (id) => professionalServices.find((s) => String(s.id) === id)?.name || "",
  );
  const totalPrice = selectedServices.reduce((sum, id) => {
    const service = professionalServices.find((s) => String(s.id) === id);
    return sum + (service ? Number(service.price) : 0);
  }, 0);
  const totalDuration = selectedServices.reduce((sum, id) => {
    const service = professionalServices.find((s) => String(s.id) === id);
    return sum + (service ? Number(service.durationMinutes) : 0);
  }, 0);
  const formatDuration = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours === 0) return `${minutes} min`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}min`;
  };

  // Handlers
  const handleClientSelect = (client: any) => {
    setSelectedClient(client);
  };

  const handleProfessionalSelect = (professional: User | null) => {
    setSelectedProfessional(professional);
    setSelectedServices([]);
    setSelectedTime("");
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId],
    );
  };

  const handleDateTimeChange = useCallback((date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
  }, []);

  const isFormValid = () => {
    return (
      selectedClient &&
      selectedProfessional &&
      selectedServices.length > 0 &&
      selectedDate &&
      selectedTime
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        title="Editar Cita"
        showBackButton={true}
        backButtonText="Citas"
        backButtonHref="/appointments"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form className="space-y-8">
          {/* 1. Cliente */}
          <ClientSelectorCard
            clients={clients}
            selectedClient={selectedClient}
            onSelect={handleClientSelect}
            clientIdFromUrl={selectedClient?.id || ""}
          />
          {/* 2. Profesional */}
          <ProfessionalSelectorCard
            professionals={professionals}
            selectedProfessional={selectedProfessional}
            onSelectionChange={handleProfessionalSelect}
            title="Seleccionar Profesional"
            description="Elige el profesional que atenderá la cita"
            className="mb-6 sm:mb-8"
            isLocked={false}
          />
          {/* 3. Servicios */}
          <ServiceSelectorCard
            services={professionalServices}
            selectedServices={selectedServices}
            onSelectService={handleServiceSelect}
            isLoading={isLoadingServices}
            error={servicesError}
            isLocked={false}
          />
          {/* 4. Fecha y hora */}
          <DateTimeSelectorCard
            selectedProfessional={selectedProfessional}
            selectedDate={selectedDate}
            initialTime={selectedTime}
            onChange={handleDateTimeChange}
          />
          {/* 5. Notas */}
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
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
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
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={!isFormValid()}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar Cambios
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
