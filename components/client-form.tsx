"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
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
import type { Client } from "@/types";

// 1️⃣ Esquema de validación con Zod
const clientSchema = z.object({
  fullName: z.string().trim().min(1, "El nombre completo es requerido"),
  email: z
    .string()
    .trim()
    .min(1, "El email es requerido")
    .email("El email no tiene un formato válido"),
  phone: z
    .string()
    .trim()
    .regex(
      /^\+?[1-9]\d{6,14}$/,
      "Debe ser un número telefónico válido"
    ),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
  client?: Client;
  trigger?: React.ReactNode;
  onSubmit?: (data: ClientFormData) => void;
  onCancel?: () => void;
}

export function ClientForm({
  client,
  trigger,
  onSubmit,
  onCancel,
}: ClientFormProps) {
  const [open, setOpen] = useState(false);
  const isEditMode = !!client;

  // 2️⃣ React Hook Form con Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
    },
  });

  // Cargar datos si es edición
  useEffect(() => {
    if (client) {
      reset({
        fullName: client.fullName,
        email: client.email,
        phone: client.phone,
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
          {isEditMode ? "Editar Cliente" : "Nuevo Cliente"}
        </CardTitle>
        <CardDescription>
          {isEditMode
            ? "Actualizar información del cliente"
            : "Agregar un nuevo cliente al sistema"}
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
            {isEditMode ? "Editar Cliente" : "Nuevo Cliente"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Actualiza la información del cliente"
              : "Completa la información básica para crear un nuevo cliente"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Nombre Completo *</Label>
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
            <Label htmlFor="email">Email *</Label>
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

          {/* Teléfono */}
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono *</Label>
            <Input
              id="phone"
              {...register("phone")}
              placeholder="Ej: +34 600 123 456"
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <Separator />

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditMode ? "Actualizar Cliente" : "Crear Cliente"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
