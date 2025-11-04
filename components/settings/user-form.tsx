"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle2, XCircle, Shield, Ban } from "lucide-react";

import { Role, User } from "@/types";
// Acciones para crear y actualizar usuarios
import { create as createUser } from "@/actions/user/create";
import { updateProfile as updateUser } from "@/actions/user/update";
import findOne from "@/actions/user/findOne";

const createUserSchema = z.object({
  fullName: z
    .string()
    .min(1, "El nombre completo es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      "El nombre solo puede contener letras y espacios"
    ),
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("El formato del correo electrónico no es válido")
    .max(255, "El correo no puede exceder 255 caracteres")
    .toLowerCase(),
  phone: z
    .string()
    .optional()
    .refine((value) => {
      if (!value || value.trim() === "") return true;
      const phoneRegex = /^(\+502\s?)?[2-9]\d{3}-?\d{4}$/;
      return phoneRegex.test(value);
    }, "El formato del teléfono no es válido (ej: +502 1234-5678 o 1234-5678)"),
  role: z.string().min(1, "El rol es requerido"),
  assignedDoctors: z
    .array(z.string().uuid("ID de doctor inválido"))
    .default([]),
});

const updateUserSchema = z.object({
  fullName: z
    .string()
    .min(1, "El nombre completo es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      "El nombre solo puede contener letras y espacios"
    ),
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("El formato del correo electrónico no es válido")
    .max(255, "El correo no puede exceder 255 caracteres")
    .toLowerCase(),
  phone: z
    .string()
    .optional()
    .refine((value) => {
      if (!value || value.trim() === "") return true;
      const phoneRegex = /^(\+502\s?)?[2-9]\d{3}-?\d{4}$/;
      return phoneRegex.test(value);
    }, "El formato del teléfono no es válido"),
  role: z.string().min(1, "El rol es requerido"),
  assignedDoctors: z.array(z.string().uuid()).default([]),
});

// Tipos para errores del servidor
interface ServerError {
  statusCode: number;
  message: string;
  field?: string;
  details?: string;
}

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  // Cambiado: en vez de recibir todo el objeto `editingUser`, ahora recibimos solo su id
  editingUserId?: string | null;
  doctors: User[];
  roles: Role[];
  isLoading?: boolean;
}

export function UserForm({
  isOpen,
  onClose,
  onSuccess,
  editingUserId = null,
  doctors,
  roles,
  isLoading = false,
}: UserFormProps) {
  // ahora inspeccionamos el id en vez del objeto completo
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [serverError, setServerError] = useState<ServerError | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isFetchingUser, setIsFetchingUser] = useState(false);
  const { toast } = useToast();

  const isEditMode = !!editingUserId;

  // Estado del formulario (sin contraseñas)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    assignedDoctors: [] as string[],
  });

  // Helpers: extraer IDs de doctores asignados desde la respuesta del findOne
  const extractAssignedDoctorIds = (data: any): string[] => {
    if (!data) return [];
    // Intentamos distintas claves que la API podría devolver
    const candidates = [
      data.professionals,
      data.professionalsAssigned,
      data.assignedProfessionals,
      data.secretaryProfessionals,
      data.professionalAssignments,
      data.professionalIds,
      data.assignedDoctorIds,
      data.doctors,
    ];

    for (const c of candidates) {
      if (!c) continue;
      // Si es array de objetos
      if (Array.isArray(c)) {
        // Si los elementos son strings uuid
        if (c.length > 0 && typeof c[0] === "string") {
          return c;
        }
        // Si los elementos son objetos con id
        if (c.length > 0 && typeof c[0] === "object" && c[0].id) {
          return c.map((item: any) => String(item.id));
        }
      }
    }

    // Fallback: revisar si data tiene una propiedad 'assigned' con ids
    if (
      Array.isArray(data.assigned) &&
      data.assigned.every((x: any) => typeof x === "string")
    ) {
      return data.assigned;
    }

    return [];
  };

  // Resetear formulario cuando se abre/cierra o cambia el usuario a editar (ahora por id)
  useEffect(() => {
    let mounted = true;

    const loadUserById = async (id: string) => {
      setIsFetchingUser(true);
      try {
        // Intentamos llamar findOne con el id. Dependiendo de la implementación
        // de tu acción `findOne`, puede aceptar (id) o ({ userId: id }).
        // Probamos primero con un objeto y si falla intentamos con id plano.
        let result: any;
        result = await findOne(id);
        if (!mounted) return;

        if (!result) {
          throw new Error("No se obtuvo respuesta al buscar el usuario");
        }

        // Si la acción devuelve un objeto con `message` -> error
        if ("message" in result) {
          handleServerError(result);
          return;
        }

        // Normalmente la respuesta tiene `.data` pero si no, asumimos que result es el propio usuario
        const data = result.data ?? result;

        setFormData({
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.bio ?? data.phone ?? "",
          role: data.role?.id ?? data.role ?? "",
          assignedDoctors: extractAssignedDoctorIds(data),
        });
      } catch (error) {
        handleServerError(error);
      } finally {
        if (mounted) setIsFetchingUser(false);
      }
    };

    if (isOpen) {
      setShowSuccessMessage(false);
      setServerError(null);
      if (editingUserId) {
        loadUserById(editingUserId);
      } else {
        resetForm();
      }
      setValidationErrors({});
    }

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingUserId]);

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      role: "",
      assignedDoctors: [],
    });
    setValidationErrors({});
    setServerError(null);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Limpiar errores cuando el usuario empiece a escribir
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }

    // Limpiar error del servidor si existe
    if (serverError) {
      setServerError(null);
    }
  };

  const handleDoctorAssignment = (doctorId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      assignedDoctors: checked
        ? [...prev.assignedDoctors, doctorId]
        : prev.assignedDoctors.filter((id) => id !== doctorId),
    }));

    // Limpiar error del servidor si existe
    if (serverError) {
      setServerError(null);
    }
  };

  const validateForm = () => {
    try {
      const schema = isEditMode ? updateUserSchema : createUserSchema;
      const validatedData = schema.parse(formData);
      setValidationErrors({});
      return { success: true, data: validatedData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join(".");
          errors[path] = err.message;
        });
        setValidationErrors(errors);

        // Mostrar el primer error en un toast
        const firstError = error.errors[0];
        toast({
          title: "Error de validación",
          description: firstError.message,
          variant: "destructive",
        });

        return { success: false, errors };
      }
      return { success: false, errors: {} };
    }
  };

  const handleServerError = (error: any) => {
    console.error("Server error:", error);

    let serverError: ServerError = {
      statusCode: 500,
      message: "Error interno del servidor",
    };

    if (error && typeof error === "object") {
      if (error.statusCode || error.status) {
        serverError.statusCode = error.statusCode || error.status;
      }
      if (error.message) {
        serverError.message = error.message;
      }
      if (error.field) {
        serverError.field = error.field;
      }
      if (error.details) {
        serverError.details = error.details;
      }
    } else if (typeof error === "string") {
      serverError.message = error;
    }

    const errorMessages: Record<
      number,
      { title: string; description: string; icon?: any }
    > = {
      400: {
        title: "Datos inválidos",
        description:
          serverError.message ||
          "Los datos enviados no son válidos. Verifica la información e intenta nuevamente.",
        icon: XCircle,
      },
      401: {
        title: "No autorizado",
        description:
          "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
        icon: Shield,
      },
      403: {
        title: "Acceso denegado",
        description:
          "No tienes permisos suficientes para realizar esta acción.",
        icon: Ban,
      },
      404: {
        title: "Recurso no encontrado",
        description: "El usuario o recurso solicitado no existe.",
        icon: XCircle,
      },
      409: {
        title: "Conflicto de datos",
        description:
          serverError.message ||
          "Ya existe un usuario con este correo electrónico.",
        icon: AlertCircle,
      },
      422: {
        title: "Datos no procesables",
        description:
          serverError.message || "Los datos enviados no pueden ser procesados.",
        icon: XCircle,
      },
      429: {
        title: "Demasiadas solicitudes",
        description:
          "Has excedido el límite de solicitudes. Intenta nuevamente en unos minutos.",
        icon: AlertCircle,
      },
      500: {
        title: "Error interno del servidor",
        description:
          "Ocurrió un error en el servidor. Intenta nuevamente más tarde.",
        icon: XCircle,
      },
    };

    const errorInfo =
      errorMessages[serverError.statusCode] || errorMessages[500];

    setServerError(serverError);

    toast({
      title: errorInfo.title,
      description: errorInfo.description,
      variant: "destructive",
    });

    return serverError;
  };

  const handleSubmit = async () => {
    setServerError(null);

    const validation = validateForm();
    if (!validation.success) return;

    setIsSubmitting(true);
    try {
      let result;

      if (isEditMode && editingUserId) {
        const updateData: any = {
          userId: editingUserId,
          email: formData.email.trim().toLowerCase(),
          fullName: formData.fullName.trim(),
          bio: formData.phone?.trim(),
          roleId: formData.role,
        };

        // Incluir professionalIds cuando el rol es secretaria.
        // Enviamos el arreglo (incluso si está vacío) para que la API pueda limpiar asignaciones.
        const secretaryRole = roles.find((role) =>
          role.name.toLowerCase().includes("secretaria")
        );
        if (formData.role === secretaryRole?.id) {
          updateData.professionalIds = Array.isArray(formData.assignedDoctors)
            ? formData.assignedDoctors
            : [];
        }

        result = await updateUser(updateData);

        if ("message" in result) {
          handleServerError(result);
          return;
        }

        toast({
          title: "Usuario actualizado exitosamente",
          description: `Los datos de ${result.data.fullName} han sido actualizados`,
        });

        // Si en la edición cambias a workflow donde profesionales puedan recibir secretaryIds,
        // añade aquí updateData.secretaryIds y la UI para asignarlas.
      } else {
        // Crear nuevo usuario (sin contraseña en el formulario)
        // Ahora incluimos professionalIds si estamos creando una secretaria.
        const createPayload: any = {
          roleId: formData.role,
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          bio: formData.phone?.trim(),
        };

        // Si el rol seleccionado es secretaria, pasamos professionalIds en el body
        const secretaryRole = roles.find((role) =>
          role.name.toLowerCase().includes("secretaria")
        );
        if (formData.role === secretaryRole?.id) {
          // assignedDoctors en el form representan professionalIds para la secretaria
          if (
            Array.isArray(formData.assignedDoctors) &&
            formData.assignedDoctors.length > 0
          ) {
            createPayload.professionalIds = formData.assignedDoctors;
          } else {
            // Si quieres que crear con asignaciones vacías también haga algo,
            // puedes enviar professionalIds: [] aquí.
          }
        }

        // Si más adelante ya tienes UI para asignar secretarias a profesionales,
        // podrías pasar createPayload.secretaryIds = formData.assignedSecretaries;

        result = await createUser(createPayload);

        if ("message" in result) {
          handleServerError(result);
          return;
        }

        const newUser = result.data;

        toast({
          title: "Usuario creado exitosamente",
          description: `${newUser.fullName} ha sido agregado al sistema`,
        });
      }

      onSuccess(result.data);

      setShowSuccessMessage(true);

      setTimeout(() => {
        onClose();
        setShowSuccessMessage(false);
      }, 2000);
    } catch (error) {
      handleServerError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const secretaryRole = roles.find((role) =>
    role.name.toLowerCase().includes("secretaria")
  );

  // Componente para mostrar errores de validación
  const ValidationError = ({ field }: { field: string }) => {
    if (!validationErrors[field]) return null;

    return (
      <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
        <AlertCircle className="h-3 w-3" />
        {validationErrors[field]}
      </div>
    );
  };

  // Componente para mostrar errores del servidor
  const ServerErrorDisplay = () => {
    if (!serverError) return null;

    const getErrorIcon = () => {
      switch (serverError.statusCode) {
        case 401:
          return <Shield className="h-4 w-4" />;
        case 403:
          return <Ban className="h-4 w-4" />;
        default:
          return <AlertCircle className="h-4 w-4" />;
      }
    };

    const getErrorColor = () => {
      switch (serverError.statusCode) {
        case 401:
        case 403:
          return "text-orange-600 bg-orange-50 border-orange-200";
        default:
          return "text-red-600 bg-red-50 border-red-200";
      }
    };

    return (
      <div className={`rounded-md border p-3 ${getErrorColor()}`}>
        <div className="flex items-center gap-2">
          {getErrorIcon()}
          <div className="flex-1">
            <h4 className="font-medium text-sm">
              Error {serverError.statusCode}
            </h4>
            <p className="text-sm mt-1">{serverError.message}</p>
            {serverError.details && (
              <p className="text-xs mt-1 opacity-75">{serverError.details}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Mostrar mensaje de éxito
  if (showSuccessMessage) {
    return (
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent className="max-w-sm">
          <div className="text-center py-6">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-700 mb-2">
              ¡Usuario {isEditMode ? "actualizado" : "creado"} exitosamente!
            </h3>
            <p className="text-sm text-gray-600">
              {isEditMode
                ? "Los cambios han sido guardados."
                : "El nuevo usuario ha sido agregado al sistema."}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Usuario" : "Crear Nuevo Usuario"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Modifica la información del usuario y sus asignaciones."
              : "Completa la información del nuevo usuario y asígnalo a doctores."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Mostrar errores del servidor */}
          <ServerErrorDisplay />

          {isFetchingUser && (
            <div className="text-sm text-gray-500">
              Cargando datos del usuario...
            </div>
          )}

          {/* Información Personal */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Nombre Completo *</Label>
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              placeholder="Ej: María González"
              className={validationErrors.fullName ? "border-red-500" : ""}
            />
            <ValidationError field="fullName" />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="maria@clinica.com"
                className={validationErrors.email ? "border-red-500" : ""}
              />
              <ValidationError field="email" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+502 1234-5678"
                className={validationErrors.phone ? "border-red-500" : ""}
              />
              <ValidationError field="phone" />
            </div>
          </div>

          {/* Rol */}
          <div className="space-y-2">
            <Label>Rol del Usuario *</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleInputChange("role", value)}
            >
              <SelectTrigger
                className={validationErrors.role ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                {roles &&
                  roles.map((role: Role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <ValidationError field="role" />
          </div>

          {/* Asignación de Doctores */}
          {formData.role === secretaryRole?.id && doctors.length > 0 && (
            <div className="space-y-3">
              <Label>Doctores Asignados</Label>
              <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="flex items-center space-x-2 py-1"
                  >
                    <Checkbox
                      id={`doctor-${doctor.id}`}
                      checked={formData.assignedDoctors.includes(doctor.id)}
                      onCheckedChange={(checked) =>
                        handleDoctorAssignment(doctor.id, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`doctor-${doctor.id}`}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="text-sm font-medium">
                        {doctor.fullName}
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || isLoading || isFetchingUser}
          >
            {isSubmitting
              ? isEditMode
                ? "Actualizando..."
                : "Creando..."
              : isEditMode
                ? "Actualizar Usuario"
                : "Crear Usuario"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
