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
import { Search, UserPlus, CheckCircle, AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import type { Client } from "@/types";
import { create as createClient } from "@/actions/clients/create";
import { PhoneInput } from "@/components/phone-input";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounceSearch } from "@/hooks/useDebounce";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Props = {
  clients: Client[];
  selectedClient: Client | null;
  onSelect: (client: Client | null) => void;
  clientIdFromUrl?: string;
  showError?: boolean; // Nueva prop para mostrar error cuando se intenta enviar sin seleccionar
};

export function ClientSelectorCard({
  clients,
  selectedClient,
  onSelect,
  clientIdFromUrl,
  showError = false,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSearch =
    typeof window !== "undefined"
      ? new URL(window.location.href).searchParams.get("search") || ""
      : (searchParams?.get("search") as string) || "";

  const { searchTerm, setSearchTerm } = useDebounceSearch(initialSearch, {
    delay: 500,
    minLength: 2,
    resetPage: true,
    skipInitialSearch: true,
    onSearch: (value: string) => {
      const currentParams = new URL(window.location.href).searchParams;
      const params = new URLSearchParams(currentParams.toString());
      if (value && value.trim().length >= 2) {
        params.set("search", value.trim());
      } else {
        params.delete("search");
      }
      params.set("page", "1");
      const query = params.toString();
      router.push(query ? `?${query}` : window.location.pathname);
    },
  });

  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    countryCode: "+502",
  });
  const [isCreating, setIsCreating] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [formErrors, setFormErrors] = useState({
    fullName: "",
    phone: "",
  });

  useEffect(() => {
    if (clientIdFromUrl && !selectedClient) {
      const found = clients.find((c) => c.id === clientIdFromUrl);
      if (found) onSelect(found);
    }
  }, []);

  const filteredClients = clients.filter((client) =>
    client.fullName.toLowerCase().includes((searchTerm || "").toLowerCase())
  );

  const getLocalDigits = (phone: string, countryCode: string) => {
    const digitsOnly = (phone || "").replace(/\D/g, "");
    const countryDigits = (countryCode || "").replace("+", "");
    if (countryDigits && digitsOnly.startsWith(countryDigits)) {
      return digitsOnly.slice(countryDigits.length);
    }
    return digitsOnly;
  };

  const preparePhoneToSend = (phone: string, countryCode: string) => {
    const digitsOnly = (phone || "").replace(/\D/g, "");
    if (!digitsOnly) return "";
    const countryDigits = (countryCode || "").replace("+", "");
    if (countryDigits && digitsOnly.startsWith(countryDigits)) {
      return `+${digitsOnly}`;
    }
    return `${countryCode}${digitsOnly}`;
  };

  const validatePhone = (phone: string, countryCode: string): boolean => {
    const localDigits = getLocalDigits(phone, countryCode);

    if (!localDigits) {
      setPhoneError("El teléfono es requerido");
      return false;
    }

    if (countryCode === "+502") {
      if (localDigits.length !== 8) {
        setPhoneError("El número de Guatemala debe tener 8 dígitos");
        return false;
      }
    } else if (countryCode === "+1") {
      if (localDigits.length !== 10) {
        setPhoneError("El número de USA debe tener 10 dígitos");
        return false;
      }
    } else if (countryCode === "+52") {
      if (localDigits.length !== 10) {
        setPhoneError("El número de México debe tener 10 dígitos");
        return false;
      }
    } else if (countryCode === "+503" || countryCode === "+504") {
      if (localDigits.length !== 8) {
        setPhoneError("El número debe tener 8 dígitos");
        return false;
      }
    } else {
      if (localDigits.length < 7 || localDigits.length > 15) {
        setPhoneError("El número debe tener entre 7 y 15 dígitos");
        return false;
      }
    }

    setPhoneError("");
    return true;
  };

  const handleCreateClient = async () => {
    // Validar nombre
    if (!form.fullName.trim()) {
      setFormErrors((prev) => ({
        ...prev,
        fullName: "El nombre es requerido",
      }));
      return;
    } else {
      setFormErrors((prev) => ({ ...prev, fullName: "" }));
    }

    // Validar teléfono
    if (!validatePhone(form.phone, form.countryCode)) {
      return;
    }

    setIsCreating(true);
    try {
      const phoneToSend = preparePhoneToSend(form.phone, form.countryCode);
      const result = await createClient({
        fullName: form.fullName,
        phone: phoneToSend,
        email: form.email,
      });
      if ("data" in result) {
        onSelect(result.data);
        setShowNewClientForm(false);
        setForm({ fullName: "", phone: "", email: "", countryCode: "+502" });
        setPhoneError("");
        setFormErrors({ fullName: "", phone: "" });
        const currentParams = new URL(window.location.href).searchParams;
        const params = new URLSearchParams(currentParams.toString());
        params.set("clientId", result.data.id);
        params.delete("search");
        params.set("page", "1");
        router.push(
          params.toString() ? `?${params.toString()}` : window.location.pathname
        );
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handlePhoneChange = (phone: string, countryCode: string) => {
    setForm({ ...form, phone, countryCode });
    setPhoneError("");
  };

  const handleSelectExisting = (client: Client) => {
    onSelect(client);
    const currentParams = new URL(window.location.href).searchParams;
    const params = new URLSearchParams(currentParams.toString());
    params.set("clientId", client.id);
    params.delete("search");
    params.set("page", "1");
    router.push(
      params.toString() ? `?${params.toString()}` : window.location.pathname
    );
  };

  return (
    <Card
      className={showError && !selectedClient ? "border-red-500 border-2" : ""}
    >
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Seleccionar paciente</span>
          {showError && !selectedClient && (
            <AlertCircle className="h-5 w-5 text-red-500" />
          )}
        </CardTitle>
        <CardDescription>
          Busca un paciente existente o crea uno nuevo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Alerta de error cuando no se ha seleccionado paciente */}
        {showError && !selectedClient && !showNewClientForm && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Debes seleccionar un paciente o crear uno nuevo para continuar
            </AlertDescription>
          </Alert>
        )}

        {!selectedClient && !showNewClientForm && (
          <>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar paciente por nombre..."
                  value={searchTerm || ""}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 ${showError && !selectedClient ? "border-red-500" : ""}`}
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
            {searchTerm && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-all"
                    onClick={() => handleSelectExisting(client)}
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
                        {client.totalAppointments} citas
                      </p>
                    </div>
                  </div>
                ))}
                {filteredClients.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No se encontraron pacientes</p>
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setShowNewClientForm(true)}
                      className="mt-2"
                    >
                      ¿Crear nuevo paciente?
                    </Button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

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
                onClick={() => {
                  onSelect(null);
                  const currentParams = new URL(window.location.href)
                    .searchParams;
                  const params = new URLSearchParams(currentParams.toString());
                  params.delete("clientId");
                  router.push(
                    params.toString()
                      ? `?${params.toString()}`
                      : window.location.pathname
                  );
                }}
                className="text-xs px-2 py-1 h-auto"
              >
                Cambiar
              </Button>
            </div>
          </div>
        )}

        {showNewClientForm && (
          <div className="space-y-4 p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Nuevo paciente
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientName">
                  Nombre completo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="clientName"
                  value={form.fullName}
                  onChange={(e) => {
                    setForm({ ...form, fullName: e.target.value });
                    if (e.target.value.trim()) {
                      setFormErrors((prev) => ({ ...prev, fullName: "" }));
                    }
                  }}
                  placeholder="Nombre del paciente"
                  required
                  className={formErrors.fullName ? "border-red-500" : ""}
                />
                {formErrors.fullName && (
                  <p className="text-xs text-red-500 mt-1">
                    {formErrors.fullName}
                  </p>
                )}
              </div>
              <div>
                <PhoneInput
                  id="clientPhone"
                  value={form.phone}
                  onChange={handlePhoneChange}
                  label="Teléfono"
                  placeholder="Ingrese su número"
                  required
                  error={phoneError}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="pacientemail">Email (opcional)</Label>
              <Input
                id="pacientemail"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="paciente@email.com"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowNewClientForm(false);
                  setPhoneError("");
                  setFormErrors({ fullName: "", phone: "" });
                }}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleCreateClient}
                disabled={
                  !form.fullName.trim() || !form.phone.trim() || isCreating
                }
              >
                {isCreating ? "Creando..." : "Crear y seleccionar"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
