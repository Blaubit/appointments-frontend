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
import { toast } from "sonner";
import create from "@/actions/services/create";
import update from "@/actions/services/update";
import type { Service as ServiceType, User } from "@/types";
import { findAllProfessionals } from "@/actions/user/findAllProfessionals";
import { Checkbox } from "@/components/ui/checkbox";
import { User as UserIcon } from "lucide-react";
import { getUser } from "@/actions/auth";

interface ServiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  service?: ServiceType | null;
  onSuccess?: () => void;
  user: User;
}

interface FormData {
  name: string;
  durationMinutes: string;
  price: string;
  professionalsIds: string[];
}

export function ServiceForm({
  isOpen,
  onClose,
  service,
  onSuccess,
  user,
}: ServiceFormProps) {
  const isEditing = !!service;

  const [formData, setFormData] = useState<FormData>({
    name: service?.name || "",
    durationMinutes: service?.durationMinutes?.toString() || "",
    price: service?.price?.toString() || "",
    professionalsIds: service?.professionals?.map((p) => p.id) || [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [professionals, setProfessionals] = useState<User[]>([]);
  const [loadingProfessionals, setLoadingProfessionals] = useState(true);

  useEffect(() => {
    // Cuando se abre el dialogo, cargamos los profesionales.
    // Usamos un async/try-catch para capturar errores y fallback al `user` recibido como prop.
    if (!isOpen) return;

    let mounted = true;

    const mergeUniqueById = (list: User[], candidate: User) => {
      const exists = list.some((p) => p.id === candidate.id);
      return exists ? list : [candidate, ...list];
    };

    const fetchProfessionals = async () => {
      setLoadingProfessionals(true);
      try {
        const result = await findAllProfessionals();
        const data = result?.data ?? [];

        if (Array.isArray(data) && data.length > 0) {
          // Si el backend devolvió profesionales, asegurar que el `user` también esté presente (evitar duplicados).
          const merged = mergeUniqueById(data, user);
          if (mounted) setProfessionals(merged);
        } else {
          // Si la respuesta fue vacía, usar el user como fallback.
          if (mounted) setProfessionals([user]);
        }
      } catch (err) {
        // Si hay un error en la petición, fallback al user y log.
        console.error(
          "Error loading professionals, falling back to user:",
          err
        );
        if (mounted) setProfessionals([user]);
      } finally {
        if (mounted) setLoadingProfessionals(false);
      }
    };

    // Resetear el formulario según el servicio (cuando se abre)
    setFormData({
      name: service?.name || "",
      durationMinutes: service?.durationMinutes?.toString() || "",
      price: service?.price?.toString() || "",
      professionalsIds: service?.professionals?.map((p) => p.id) || [],
    });
    setErrors({});

    fetchProfessionals();

    return () => {
      mounted = false;
    };
    // incluimos `user` en las dependencias para que cambios en user sean respetados
  }, [service, isOpen, user]);

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
      const serviceData: any = {
        name: formData.name.trim(),
        durationMinutes: parseInt(formData.durationMinutes),
        price: parseFloat(formData.price),
      };
      if (formData.professionalsIds.length > 0) {
        serviceData.professionalsIds = formData.professionalsIds;
      }

      let response;
      if (isEditing && service) {
        response = await update({
          id: service.id,
          ...serviceData,
        });
      } else {
        response = await create(serviceData);
      }

      if ("data" in response) {
        toast.success(
          isEditing
            ? "Servicio actualizado correctamente"
            : "Servicio creado correctamente"
        );
        onSuccess?.();
        handleClose();
      } else {
        toast.error(response.message || "Ha ocurrido un error");
      }
    } catch (error) {
      console.error("Error al procesar servicio:", error);
      toast.error("Ha ocurrido un error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  // Cambia el estado del checkbox de cada profesional
  const handleProfessionalCheck = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      professionalsIds: prev.professionalsIds.includes(id)
        ? prev.professionalsIds.filter((pid) => pid !== id)
        : [...prev.professionalsIds, id],
    }));
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

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
            {/* Nombre */}
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

            {/* Duración */}
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

            {/* Precio */}
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

            {/* Selección de profesionales con checkboxes */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2 flex items-center gap-1">
                <UserIcon className="w-4 h-4" />
                Profesionales
              </Label>
              <div className="col-span-3">
                <div className="grid grid-cols-1 sm:grid-cols-1 gap-2 max-h-40 overflow-y-auto border rounded-md p-2 bg-muted/40">
                  {loadingProfessionals ? (
                    <span className="text-sm text-muted-foreground">
                      Cargando profesionales...
                    </span>
                  ) : professionals.length === 0 ? (
                    <span className="text-sm text-muted-foreground">
                      No hay profesionales disponibles
                    </span>
                  ) : (
                    professionals.map((prof) => (
                      <label
                        key={prof.id}
                        className="flex items-center gap-2 px-2 py-1 rounded hover:bg-accent transition cursor-pointer"
                      >
                        <Checkbox
                          checked={formData.professionalsIds.includes(prof.id)}
                          onCheckedChange={() =>
                            handleProfessionalCheck(prof.id)
                          }
                          id={`prof-${prof.id}`}
                        />
                        <UserIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{prof.fullName}</span>
                      </label>
                    ))
                  )}
                </div>
                <small className="text-gray-500">
                  (Opcional) Selecciona uno o más profesionales
                </small>
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
