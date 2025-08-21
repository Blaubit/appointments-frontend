"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"; // Asumiendo que usas sonner para toasts
import create from "@/actions/services/create";
import update from "@/actions/services/update";
import type { Service as ServiceType } from "@/types";

interface ServiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  service?: ServiceType | null; // Si es null/undefined = modo crear, si tiene valor = modo editar
  onSuccess?: () => void; // Callback para refrescar datos
}

interface FormData {
  name: string;
  durationMinutes: string;
  price: string;
}

export function ServiceForm({
  isOpen,
  onClose,
  service,
  onSuccess,
}: ServiceFormProps) {
  const isEditing = !!service;

  const [formData, setFormData] = useState<FormData>({
    name: service?.name || "",
    durationMinutes: service?.durationMinutes?.toString() || "",
    price: service?.price?.toString() || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Efecto para actualizar el formulario cuando cambie el servicio
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: service?.name || "",
        durationMinutes: service?.durationMinutes?.toString() || "",
        price: service?.price?.toString() || "",
      });
      setErrors({});
    }
  }, [service, isOpen]);

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!formData.durationMinutes.trim()) {
      newErrors.durationMinutes = "La duración es requerida";
    } else if (parseInt(formData.durationMinutes) <= 0) {
      newErrors.durationMinutes = "La duración debe ser mayor a 0";
    }

    if (!formData.price.trim()) {
      newErrors.price = "El precio es requerido";
    } else if (parseFloat(formData.price) < 0) {
      newErrors.price = "El precio debe ser mayor o igual a 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const serviceData = {
        name: formData.name.trim(),
        durationMinutes: parseInt(formData.durationMinutes),
        price: parseFloat(formData.price), // Convertir a number
      };

      console.log("Form data being sent:", serviceData); // Para debug
      console.log("Is editing:", isEditing); // Para debug
      console.log("Service ID:", service?.id); // Para debug

      let response;

      if (isEditing && service) {
        // Modo editar
        response = await update({
          id: service.id,
          ...serviceData,
        });
        console.log("Update response:", response); // Para debug
      } else {
        // Modo crear
        response = await create(serviceData);
        console.log("Create response:", response); // Para debug
      }

      if ("data" in response) {
        // Éxito
        toast.success(
          isEditing
            ? "Servicio actualizado correctamente"
            : "Servicio creado correctamente",
        );
        onSuccess?.();
        handleClose();
      } else {
        // Error
        toast.error(response.message || "Ha ocurrido un error");
      }
    } catch (error) {
      console.error("Error al procesar servicio:", error);
      toast.error("Ha ocurrido un error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar Servicio" : "Crear Nuevo Servicio"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Modifica la información del servicio"
                : "Completa la información del nuevo servicio"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre *
              </Label>
              <div className="col-span-3">
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Nombre del servicio"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Duración *
              </Label>
              <div className="col-span-3">
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={formData.durationMinutes}
                  onChange={(e) =>
                    handleInputChange("durationMinutes", e.target.value)
                  }
                  placeholder="Minutos"
                  className={errors.durationMinutes ? "border-red-500" : ""}
                />
                {errors.durationMinutes && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.durationMinutes}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Precio *
              </Label>
              <div className="col-span-3">
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="0.00"
                  className={errors.price ? "border-red-500" : ""}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            >
              {isLoading
                ? isEditing
                  ? "Actualizando..."
                  : "Creando..."
                : isEditing
                  ? "Actualizar Servicio"
                  : "Crear Servicio"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
