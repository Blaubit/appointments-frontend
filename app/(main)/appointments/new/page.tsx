"use client";

import type React from "react";

import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Input,
  Label,
  Textarea,
  Header,
} from "@/components";
import {
  Clock,
  User,
  Save,
  UserPlus,
  Search,
  CheckCircle,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

export default function NewAppointmentPage() {
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [clientSearch, setClientSearch] = useState("");
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    service: "",
    date: "",
    time: "",
    duration: "",
    price: "",
    notes: "",
    status: "pending",
  });

  // Mock data - in real app this would come from API
  const existingClients = [
    {
      id: 1,
      name: "María González",
      email: "maria@email.com",
      phone: "+1 (555) 123-4567",
      lastVisit: "2024-01-10",
      totalAppointments: 12,
      avatar: "/Avatar1.png?height=40&width=40",
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      email: "carlos@email.com",
      phone: "+1 (555) 234-5678",
      lastVisit: "2024-01-08",
      totalAppointments: 8,
      avatar: "/Avatar1.png?height=40&width=40",
    },
    {
      id: 3,
      name: "Ana Martínez",
      email: "ana@email.com",
      phone: "+1 (555) 345-6789",
      lastVisit: "2024-01-05",
      totalAppointments: 15,
      avatar: "/Avatar1.png?height=40&width=40",
    },
  ];

  const services = [
    { id: 1, name: "Consulta General", duration: "30 min", price: 50 },
    { id: 2, name: "Limpieza Dental", duration: "45 min", price: 75 },
    { id: 3, name: "Corte y Peinado", duration: "60 min", price: 40 },
    { id: 4, name: "Terapia Física", duration: "90 min", price: 100 },
    { id: 5, name: "Consulta Especializada", duration: "45 min", price: 120 },
    { id: 6, name: "Revisión Rutinaria", duration: "30 min", price: 60 },
  ];

  const availableTimes = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
  ];

  const filteredClients = existingClients.filter((client) =>
    client.name.toLowerCase().includes(clientSearch.toLowerCase()),
  );

  const selectedServiceData = services.find(
    (s) => s.id.toString() === selectedService,
  );

  const handleClientSelect = (client: any) => {
    setSelectedClient(client);
    setFormData({
      ...formData,
      clientName: client.name,
      clientEmail: client.email,
      clientPhone: client.phone,
    });
    setShowNewClientForm(false);
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    const service = services.find((s) => s.id.toString() === serviceId);
    if (service) {
      setFormData({
        ...formData,
        service: service.name,
        duration: service.duration,
        price: service.price.toString(),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("New appointment:", formData);
    setIsLoading(false);

    // Redirect to appointments list or show success message
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header
        title="Nueva Cita"
        showBackButton={true}
        backButtonText="Citas"
        backButtonHref="/appointments"
        user={{
          name: "Dr. Roberto Silva",
          email: "roberto.silva@email.com",
          role: "Médico General",
          avatar: "/Avatar1.png?height=32&width=32",
          initials: "DR",
        }}
        notifications={{
          count: 3,
        }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Client Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Seleccionar Cliente</span>
              </CardTitle>
              <CardDescription>
                Busca un cliente existente o crea uno nuevo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!selectedClient && !showNewClientForm && (
                <>
                  <div className="flex space-x-2">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar cliente por nombre..."
                        value={clientSearch}
                        onChange={(e) => setClientSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowNewClientForm(true)}
                      className="whitespace-nowrap"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Nuevo Cliente
                    </Button>
                  </div>

                  {clientSearch && (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {filteredClients.map((client) => (
                        <div
                          key={client.id}
                          className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                          onClick={() => handleClientSelect(client)}
                        >
                          <Avatar>
                            <AvatarImage
                              src={client.avatar || "/Avatar1.png"}
                            />
                            <AvatarFallback>
                              {client.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {client.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {client.email}
                            </p>
                            <p className="text-xs text-gray-400">
                              {client.totalAppointments} citas • Última visita:{" "}
                              {client.lastVisit}
                            </p>
                          </div>
                        </div>
                      ))}
                      {filteredClients.length === 0 && (
                        <p className="text-center text-gray-500 py-4">
                          No se encontraron clientes
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}

              {selectedClient && (
                <div className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <Avatar>
                    <AvatarImage
                      src={selectedClient.avatar || "/Avatar1.png"}
                    />
                    <AvatarFallback>
                      {selectedClient.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedClient.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedClient.email}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedClient.phone}
                    </p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedClient(null);
                      setFormData({
                        ...formData,
                        clientName: "",
                        clientEmail: "",
                        clientPhone: "",
                      });
                    }}
                  >
                    Cambiar
                  </Button>
                </div>
              )}

              {showNewClientForm && (
                <div className="space-y-4 p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Nuevo Cliente
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clientName">Nombre completo *</Label>
                      <Input
                        id="clientName"
                        value={formData.clientName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            clientName: e.target.value,
                          })
                        }
                        placeholder="Nombre del cliente"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientPhone">Teléfono *</Label>
                      <Input
                        id="clientPhone"
                        value={formData.clientPhone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            clientPhone: e.target.value,
                          })
                        }
                        placeholder="+1 (555) 123-4567"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="clientEmail">Email</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={formData.clientEmail}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          clientEmail: e.target.value,
                        })
                      }
                      placeholder="cliente@email.com"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowNewClientForm(false);
                        setFormData({
                          ...formData,
                          clientName: "",
                          clientEmail: "",
                          clientPhone: "",
                        });
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Service Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Servicio</span>
              </CardTitle>
              <CardDescription>
                Selecciona el tipo de servicio para la cita
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedService === service.id.toString()
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                    }`}
                    onClick={() => handleServiceSelect(service.id.toString())}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {service.name}
                      </h4>
                      {selectedService === service.id.toString() && (
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {service.duration}
                      </span>
                      <span className="flex items-center font-medium">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {service.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Date and Time Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Date Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Fecha</CardTitle>
                <CardDescription>
                  Selecciona la fecha para la cita
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-center text-sm font-medium text-gray-500 py-2"
                      >
                        {day}
                      </div>
                    ),
                  )}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.slice(0, 21).map((date, index) => {
                    const dateStr = date.toISOString().split("T")[0];
                    const isSelected = selectedDate === dateStr;
                    const isToday =
                      date.toDateString() === new Date().toDateString();

                    return (
                      <button
                        key={index}
                        type="button"
                        className={`p-2 text-sm rounded-lg transition-colors ${
                          isSelected
                            ? "bg-blue-500 text-white"
                            : isToday
                              ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                              : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => {
                          setSelectedDate(dateStr);
                          setFormData({ ...formData, date: dateStr });
                        }}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Time Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Horario</CardTitle>
                <CardDescription>
                  Selecciona la hora para la cita
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {availableTimes.map((time) => {
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
                        onClick={() => {
                          setSelectedTime(time);
                          setFormData({ ...formData, time });
                        }}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Information */}
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

              {selectedServiceData && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Resumen del Servicio
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Servicio:</span>
                      <p className="font-medium">{selectedServiceData.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Duración:</span>
                      <p className="font-medium">
                        {selectedServiceData.duration}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Precio:</span>
                      <p className="font-medium">
                        ${selectedServiceData.price}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Link href="/appointments">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={
                isLoading ||
                !formData.clientName ||
                !selectedService ||
                !selectedDate ||
                !selectedTime
              }
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            >
              {isLoading ? (
                <>
                  <div className="spinner mr-2"></div>
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
        </form>
      </div>
    </div>
  );
}
