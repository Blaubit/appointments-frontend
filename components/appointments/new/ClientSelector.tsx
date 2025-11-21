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
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounceSearch } from "@/hooks/useDebounce";

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
  const router = useRouter();
  const searchParams = useSearchParams();

  // Inicializamos el valor inicial desde el query 'search' si existe
  const initialSearch =
    typeof window !== "undefined"
      ? new URL(window.location.href).searchParams.get("search") || ""
      : (searchParams?.get("search") as string) || "";

  // Reuse existing hook. Provide onSearch to update the URL param `search`
  const { searchTerm, setSearchTerm } = useDebounceSearch(initialSearch, {
    delay: 500,
    minLength: 2,
    resetPage: true,
    skipInitialSearch: true,
    onSearch: (value: string) => {
      // Use current window.location to ensure we preserve latest tab param
      const currentParams = new URL(window.location.href).searchParams;
      const params = new URLSearchParams(currentParams.toString());
      if (value && value.trim().length >= 2) {
        params.set("search", value.trim());
      } else {
        params.delete("search");
      }
      // reset pagination when searching
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

  // Selección automática por clientIdFromUrl SOLO al montar
  useEffect(() => {
    if (clientIdFromUrl && !selectedClient) {
      const found = clients.find((c) => c.id === clientIdFromUrl);
      if (found) onSelect(found);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredClients = clients.filter((client) =>
    client.fullName.toLowerCase().includes((searchTerm || "").toLowerCase())
  );

  // Helper: obtiene solo los dígitos locales (sin prefijo de país)
  const getLocalDigits = (phone: string, countryCode: string) => {
    const digitsOnly = (phone || "").replace(/\D/g, "");
    const countryDigits = (countryCode || "").replace("+", "");
    if (countryDigits && digitsOnly.startsWith(countryDigits)) {
      return digitsOnly.slice(countryDigits.length);
    }
    return digitsOnly;
  };

  // Preparar teléfono para enviar: asegura que venga con +prefijo y solo dígitos después
  const preparePhoneToSend = (phone: string, countryCode: string) => {
    const digitsOnly = (phone || "").replace(/\D/g, "");
    if (!digitsOnly) return "";
    const countryDigits = (countryCode || "").replace("+", "");
    if (countryDigits && digitsOnly.startsWith(countryDigits)) {
      return `+${digitsOnly}`;
    }
    return `${countryCode}${digitsOnly}`;
  };

  // Validar número de teléfono (ahora valida únicamente los dígitos locales)
  const validatePhone = (phone: string, countryCode: string): boolean => {
    const localDigits = getLocalDigits(phone, countryCode);

    if (!localDigits) {
      setPhoneError("El teléfono es requerido");
      return false;
    }

    if (countryCode === "+502") {
      // Guatemala: 8 dígitos locales
      if (localDigits.length !== 8) {
        setPhoneError("El número de Guatemala debe tener 8 dígitos");
        return false;
      }
    } else if (countryCode === "+1") {
      // USA: 10 dígitos locales
      if (localDigits.length !== 10) {
        setPhoneError("El número de USA debe tener 10 dígitos");
        return false;
      }
    } else if (countryCode === "+52") {
      // Mexico: 10 dígitos locales
      if (localDigits.length !== 10) {
        setPhoneError("El número de México debe tener 10 dígitos");
        return false;
      }
    } else if (countryCode === "+503" || countryCode === "+504") {
      // El Salvador / Honduras: 8 dígitos locales
      if (localDigits.length !== 8) {
        setPhoneError("El número debe tener 8 dígitos");
        return false;
      }
    } else {
      // Fallback: aceptar entre 7 y 15 dígitos locales
      if (localDigits.length < 7 || localDigits.length > 15) {
        setPhoneError("El número debe tener entre 7 y 15 dígitos");
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
      const phoneToSend = preparePhoneToSend(form.phone, form.countryCode);
      const result = await createClient({
        fullName: form.fullName,
        phone: phoneToSend,
        email: form.email,
      });
      if ("data" in result) {
        // Selecciona el paciente recién creado
        onSelect(result.data);
        setShowNewClientForm(false);
        setForm({ fullName: "", phone: "", email: "", countryCode: "+502" });
        setPhoneError("");
        // Opcional: agregar clientId al URL para deep-link y limpiar search
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
    setPhoneError(""); // Limpiar error cuando el usuario escribe
  };

  // Si quieres que al seleccionar un cliente existente también se agregue clientId al URL,
  // puedes hacerlo aquí para facilitar deep-linking.
  const handleSelectExisting = (client: Client) => {
    onSelect(client);
    const currentParams = new URL(window.location.href).searchParams;
    const params = new URLSearchParams(currentParams.toString());
    params.set("clientId", client.id);
    params.delete("search"); // clear the text search since user selected a client
    params.set("page", "1");
    router.push(
      params.toString() ? `?${params.toString()}` : window.location.pathname
    );
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
                  value={searchTerm || ""}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
            {searchTerm && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
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
                onClick={() => {
                  onSelect(null);
                  // also remove clientId from url when clearing selection but preserve other params (including tab)
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
        {/* Formulario nuevo paciente */}
        {showNewClientForm && (
          <div className="space-y-4 p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Nuevo paciente
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientName">Nombre completo *</Label>
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
              <Label htmlFor="pacientemail">Email</Label>
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
                {isCreating ? "Creando..." : "Seleccionar paciente"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
