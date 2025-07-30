"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, User } from "lucide-react";
import type { Client } from "@/types";

// Tipo simplificado para el formulario
interface ClientFormData {
  fullName: string;
  email: string;
  phone: string;
}

interface ClientFormProps {
  client?: Client; // Si se pasa un cliente, está en modo edición
  trigger?: React.ReactNode; // Elemento que abre el dialog
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
  const [formData, setFormData] = useState<ClientFormData>({
    fullName: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Partial<ClientFormData>>({});

  const isEditMode = !!client;

  // Llenar el formulario con datos del cliente si está en modo edición
  useEffect(() => {
    if (client) {
      setFormData({
        fullName: client.fullName,
        email: client.email,
        phone: client.phone,
      });
    }
  }, [client]);

  // Abrir el diálogo automáticamente si estamos en modo edición
  useEffect(() => {
    if (isEditMode) {
      setOpen(true);
    }
  }, [isEditMode]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ClientFormData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "El nombre completo es requerido";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El email no tiene un formato válido";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit?.(formData);
    setOpen(false);

    // Reset form if not in edit mode
    if (!isEditMode) {
      setFormData({
        fullName: "",
        email: "",
        phone: "",
      });
    }
    setErrors({});
  };

  const handleCancel = () => {
    setOpen(false);
    onCancel?.();
    setErrors({});
    
    // Reset form if not in edit mode
    if (!isEditMode) {
      setFormData({
        fullName: "",
        email: "",
        phone: "",
      });
    }
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
            {isEditMode ? `Editar Cliente` : "Nuevo Cliente"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Actualiza la información del cliente"
              : "Completa la información básica para crear un nuevo cliente"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre Completo *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }));
                  // Limpiar error si existe
                  if (errors.fullName) {
                    setErrors((prev) => ({ ...prev, fullName: undefined }));
                  }
                }}
                placeholder="Ej: Juan Pérez García"
                className={errors.fullName ? "border-red-500" : ""}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }));
                  // Limpiar error si existe
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                placeholder="Ej: juan@ejemplo.com"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }));
                  // Limpiar error si existe
                  if (errors.phone) {
                    setErrors((prev) => ({ ...prev, phone: undefined }));
                  }
                }}
                placeholder="Ej: +34 600 123 456"
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>
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