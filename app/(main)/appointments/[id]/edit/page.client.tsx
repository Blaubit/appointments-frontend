"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, UserPlus, CheckCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import type { Client } from "@/types";
import { create as createClient } from "@/actions/clients/create";
import { PhoneInput } from "@/components/phone-input";

type Props = {
  clients: Client[];
  selectedClient: Client | null;
  onSelect: (client: Client | null) => void;
  clientIdFromUrl?: string;
};

export function ClientSelectorCard({
  clients,
  selectedClient,
  onSelect,
  clientIdFromUrl,
}: Props) {
  const [search, setSearch] = useState("");
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    countryCode: "+502",
  });
  const [isCreating, setIsCreating] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  // Selección automática por clientIdFromUrl SOLO al montar
  useEffect(() => {
    if (clientIdFromUrl && !selectedClient) {
      const found = clients.find((c) => c.id === clientIdFromUrl);
      if (found) onSelect(found);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredClients = clients.filter((client) =>
    client.fullName.toLowerCase().includes(search.toLowerCase())
  );

  // Validar número de teléfono (opcional)
  const validatePhone = (phone: string, countryCode: string): boolean => {
    // Si el teléfono está vacío, es válido (es opcional)
    if (!phone.trim()) {
      setPhoneError("");
      return true;
    }

    // Si hay contenido, validar según el país
    const digitsOnly = phone.replace(/\D/g, "");

    if (countryCode === "+502") {
      // Guatemala: 8 dígitos
      if (digitsOnly.length !== 8) {
        setPhoneError("El número de Guatemala debe tener 8 dígitos");
        return false;
      }
    } else if (countryCode === "+1") {
      // USA: 10 dígitos
      if (digitsOnly.length !== 10) {
        setPhoneError("El número de USA debe tener 10 dígitos");
        return false;
      }
    } else if (countryCode === "+52") {
      // Mexico: 10 dígitos
      if (digitsOnly.length !== 10) {
        setPhoneError("El número de Mexico debe tener 10 dígitos");
        return false;
      }
    } else if (countryCode === "+503" || countryCode === "+504") {
      // El Salvador / Honduras: 8 dígitos
      if (digitsOnly.length !== 8) {
        setPhoneError("El número debe tener 8 dígitos");
        return false;
      }
    }

    setPhoneError("");
    return true;
  };

  // Crear paciente y seleccionarlo automáticamente
  const handleCreateClient = async () => {
    if (!form.fullName.trim()) {
      setPhoneError("El nombre es requerido");
      return;
    }

    if (!validatePhone(form.phone, form.countryCode)) {
      return;
    }

    setIsCreating(true);
    try {
      const result = await createClient({
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
      });
      if ("data" in result) {
        // Selecciona el paciente recién creado
        onSelect(result.data);
        setShowNewClientForm(false);
        setForm({ fullName: "", phone: "", email: "", countryCode: "+502" });
        setSearch("");
        setPhoneError("");
      }
      // Si hay error, puedes agregar manejo de errores aquí
    } finally {
      setIsCreating(false);
    }
  };

  const handlePhoneChange = (phone: string, countryCode: string) => {
    setForm({ ...form, phone, countryCode });
    setPhoneError(""); // Limpiar error cuando el usuario escribe
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Seleccionar paciente</span>
        </CardTitle>
        <CardDescription>
          Busca un paciente existente o crea uno nuevo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selección o formulario */}
        {!selectedClient && !showNewClientForm && (
          <>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar paciente por nombre..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
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
                Nuevo paciente
              </Button>
            </div>
            {search && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    onClick={() => onSelect(client)}
                  >
                    <Avatar>
                      <AvatarImage src={client.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {client.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {client.fullName}
                      </p>
                      <p className="text-sm text-gray-500">{client.email}</p>
                      <p className="text-xs text-gray-400">
                        {client.totalAppointments} citas • Última visita:{" "}
                        {client.createdAt}
                      </p>
                    </div>
                  </div>
                ))}
                {filteredClients.length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    No se encontraron pacientes
                  </p>
                )}
              </div>
            )}
          </>
        )}
        {/* paciente seleccionado */}
        {selectedClient && (
          <div className="flex items-start sm:items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <Avatar className="flex-shrink-0">
              <AvatarImage src={selectedClient.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {selectedClient.fullName
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-white truncate">
                {selectedClient.fullName}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {selectedClient.email}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {selectedClient.phone}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onSelect(null)}
                className="text-xs px-2 py-1 h-auto"
              >
                Cambiar
              </Button>
            </div>
          </div>
        )}
        {/* Formulario nuevo paciente */}
        {showNewClientForm && (
          <div className="space-y-4 p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Nuevo paciente
            </h4>
            <div className="space-y-4">
              <div>
                <Label htmlFor="clientName">
                  Nombre completo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="clientName"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                  placeholder="Nombre del paciente"
                  required
                />
              </div>
              <div>
                <Label htmlFor="clientPhone">Teléfono</Label>
                <PhoneInput
                  id="clientPhone"
                  value={form.phone}
                  onChange={handlePhoneChange}
                  label=""
                  placeholder="Ingrese su número"
                  required={false}
                  error={phoneError}
                />
              </div>
              <div>
                <Label htmlFor="clientEmail">Email</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="paciente@email.com"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowNewClientForm(false);
                  setPhoneError("");
                }}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleCreateClient}
                disabled={!form.fullName.trim() || isCreating}
              >
                {isCreating ? "Creando..." : "Seleccionar paciente"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
