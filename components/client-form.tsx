"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, User } from "lucide-react";
import { PhoneInput } from "@/components/phone-input";
import type { Client } from "@/types";

// 1️⃣ Esquema de validación con Zod
const clientSchema = z.object({
  fullName: z.string().trim().min(1, "El nombre completo es requerido"),
  email: z
    .string()
    .trim()
    .optional()
    .refine(
      (email) => !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      "El email no tiene un formato válido"
    ),
  phone: z
    .string()
    .trim()
    .optional()
    .refine((phone) => {
      // Si está vacío, es válido (es opcional)
      if (!phone) return true;

      // Validar que tenga solo dígitos y espacios
      // Acepta formatos como: "3247 0635" o "32470635"
      const digitsOnly = phone.replace(/\D/g, "");

      // Debe tener entre 7 y 15 dígitos
      return digitsOnly.length >= 7 && digitsOnly.length <= 15;
    }, "Debe ser un número telefónico válido (7-15 dígitos)"),
  countryCode: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
  client?: Client;
  trigger?: React.ReactNode;
  onSubmit?: (data: ClientFormData) => void;
  onCancel?: () => void;
}

// Función para extraer código de país del número de teléfono plano
const extractCountryCodeFromPhone = (phone: string): string => {
  if (!phone) return "+502"; // Guatemala por defecto

  // Mapeo de códigos de país a prefijos
  const countryPrefixes: Record<string, string> = {
    "+502": "GT", // Guatemala
    "+1": "US", // USA
    "+52": "MX", // Mexico
    "+503": "SV", // El Salvador
    "+504": "HN", // Honduras
  };

  for (const [code, _] of Object.entries(countryPrefixes)) {
    if (phone.startsWith(code)) {
      return code;
    }
  }

  return "+502"; // Default a Guatemala
};

// Función para limpiar y formatear número plano
const formatPlainPhone = (phone: string, countryCode: string): string => {
  if (!phone) return "";

  // Remover todos los caracteres no numéricos
  const digitsOnly = phone.replace(/\D/g, "");

  // Remover el código de país si está al inicio
  let cleanPhone = digitsOnly;
  const countryDigits = countryCode.replace("+", "");
  if (digitsOnly.startsWith(countryDigits)) {
    cleanPhone = digitsOnly.slice(countryDigits.length);
  }

  // Aplicar formato según el país
  if (
    countryCode === "+502" ||
    countryCode === "+503" ||
    countryCode === "+504"
  ) {
    // Guatemala, El Salvador, Honduras: 1234 5678
    if (cleanPhone.length >= 4) {
      return `${cleanPhone.slice(0, 4)} ${cleanPhone.slice(4, 8)}`;
    }
    return cleanPhone;
  } else if (countryCode === "+1") {
    // USA: (123) 456-7890
    if (cleanPhone.length >= 3) {
      if (cleanPhone.length >= 6) {
        return `(${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6, 10)}`;
      }
      return `(${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(3)}`;
    }
    return cleanPhone;
  } else if (countryCode === "+52") {
    // Mexico: 12 3456 7890
    if (cleanPhone.length >= 2) {
      if (cleanPhone.length >= 6) {
        return `${cleanPhone.slice(0, 2)} ${cleanPhone.slice(2, 6)} ${cleanPhone.slice(6, 10)}`;
      }
      return `${cleanPhone.slice(0, 2)} ${cleanPhone.slice(2)}`;
    }
    return cleanPhone;
  }

  return cleanPhone;
};

export function ClientForm({
  client,
  trigger,
  onSubmit,
  onCancel,
}: ClientFormProps) {
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("GT");
  const isEditMode = !!client;

  // 2️⃣ React Hook Form con Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      countryCode: "+502",
    },
  });

  // Cargar datos si es edición
  useEffect(() => {
    if (client && client.phone) {
      // Extraer el código de país del número plano
      const detectedCountryCode = extractCountryCodeFromPhone(client.phone);
      const countryCodeMap: Record<string, string> = {
        "+502": "GT",
        "+1": "US",
        "+52": "MX",
        "+503": "SV",
        "+504": "HN",
      };
      const countryCode = countryCodeMap[detectedCountryCode] || "GT";
      setSelectedCountry(countryCode);

      // Formatear el número plano
      const formattedPhone = formatPlainPhone(
        client.phone,
        detectedCountryCode
      );

      reset({
        fullName: client.fullName,
        email: client.email || "",
        phone: formattedPhone,
        countryCode: detectedCountryCode,
      });
    } else {
      reset({
        fullName: client?.fullName || "",
        email: client?.email || "",
        phone: "",
        countryCode: "+502",
      });
    }
  }, [client, reset]);

  // Abrir automáticamente si es edición
  useEffect(() => {
    if (isEditMode) {
      setOpen(true);
    }
  }, [isEditMode]);

  // 3️⃣ Envío del formulario
  const onSubmitHandler = (data: ClientFormData) => {
    onSubmit?.(data);
    setOpen(false);

    if (!isEditMode) {
      reset(); // Limpia todo
    }
  };

  // 4️⃣ Cancelar
  const handleCancel = () => {
    setOpen(false);
    onCancel?.();
    if (!isEditMode) reset();
  };

  const defaultTrigger = (
    <Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Plus className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-lg">
          {isEditMode ? "Editar paciente" : "Nuevo paciente"}
        </CardTitle>
        <CardDescription>
          {isEditMode
            ? "Actualizar información del paciente"
            : "Agregar un nuevo paciente al sistema"}
        </CardDescription>
      </CardHeader>
    </Card>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {isEditMode ? "Editar paciente" : "Nuevo paciente"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Actualiza la información del paciente"
              : "Completa la información básica para crear un nuevo paciente"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="fullName">
              Nombre Completo <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullName"
              {...register("fullName")}
              placeholder="Ej: Juan Pérez García"
              className={errors.fullName ? "border-red-500" : ""}
            />
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="Ej: juan@ejemplo.com"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Teléfono con PhoneInput */}
          <div className="space-y-2">
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  id="phone"
                  value={field.value || ""}
                  onChange={(phone: string, countryCode: string) => {
                    field.onChange(phone);
                    setValue("countryCode", countryCode);
                  }}
                  onCountryChange={(country) => {
                    setSelectedCountry(country.code);
                    setValue("countryCode", country.countryCode);
                  }}
                  label="Teléfono"
                  placeholder="Ingrese su número"
                  required={false}
                  error={errors.phone ? errors.phone.message : ""}
                />
              )}
            />
          </div>

          <Separator />

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditMode ? "Actualizar paciente" : "Crear paciente"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
