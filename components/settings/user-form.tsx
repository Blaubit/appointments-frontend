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
import {
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Shield,
  Ban,
} from "lucide-react";

import { Role, User } from "@/types";
import { create as createUser } from "@/actions/user/create";
import { updateProfile as updateUser } from "@/actions/user/update";
import { create as createSecretaryProfessionalAssignments } from "@/actions/user/secretary-professional/create";

// Esquemas de validación con Zod
const createUserSchema = z
  .object({
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
    password: z
      .string()
      .min(1, "La contraseña es requerida")
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(128, "La contraseña no puede exceder 128 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
      ),
    confirmPassword: z.string().min(1, "Confirme su contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

const updateUserSchema = z
  .object({
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
    password: z
      .string()
      .optional()
      .refine((value) => {
        if (!value || value.trim() === "") return true;
        return value.length >= 8;
      }, "La contraseña debe tener al menos 8 caracteres")
      .refine((value) => {
        if (!value || value.trim() === "") return true;
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value);
      }, "La contraseña debe contener al menos una mayúscula, una minúscula y un número"),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.password || data.password.trim() === "") return true;
      return data.password === data.confirmPassword;
    },
    {
      message: "Las contraseñas no coinciden",
      path: ["confirmPassword"],
    }
  );

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
  editingUser?: User | null;
  doctors: User[];
  roles: Role[];
  isLoading?: boolean;
}

export function UserForm({
  isOpen,
  onClose,
  onSuccess,
  editingUser = null,
  doctors,
  roles,
  isLoading = false,
}: UserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [serverError, setServerError] = useState<ServerError | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);
  const { toast } = useToast();

  const isEditMode = !!editingUser;

  // Estado del formulario
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    assignedDoctors: [] as string[],
    password: "",
    confirmPassword: "",
  });

  // Resetear formulario cuando se abre/cierra o cambia el usuario a editar
  useEffect(() => {
    if (isOpen) {
      setShowSuccessMessage(false);
      setServerError(null);
      if (editingUser) {
        setFormData({
          fullName: editingUser.fullName,
          email: editingUser.email,
          phone: editingUser.bio || "",
          role: editingUser.role?.id || "",
          assignedDoctors: [], // TODO: Obtener asignaciones actuales de la API
          password: "",
          confirmPassword: "",
        });
      } else {
        resetForm();
      }
      setValidationErrors({});
      setPasswordsMatch(null);
    }
  }, [isOpen, editingUser]);

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      role: "",
      assignedDoctors: [],
      password: "",
      confirmPassword: "",
    });
    setValidationErrors({});
    setServerError(null);
    setPasswordsMatch(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
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

    // Verificar coincidencia de contraseñas en tiempo real
    if (
      field === "confirmPassword" ||
      (field === "password" && formData.confirmPassword)
    ) {
      const password = field === "password" ? value : formData.password;
      const confirmPassword =
        field === "confirmPassword" ? value : formData.confirmPassword;

      if (confirmPassword) {
        setPasswordsMatch(password === confirmPassword);
      } else {
        setPasswordsMatch(null);
      }
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

      if (isEditMode && editingUser) {
        const updateData: any = {
          userId: editingUser.id,
          email: formData.email.trim().toLowerCase(),
        };

        if (formData.password && formData.password.trim() !== "") {
          updateData.password = formData.password;
        }

        result = await updateUser(updateData);

        if ("message" in result) {
          handleServerError(result);
          return;
        }

        // (Opcional: aquí podrías adaptar la edición de asignaciones si tu backend lo permite)

        toast({
          title: "Usuario actualizado exitosamente",
          description: `Los datos de ${result.data.fullName} han sido actualizados`,
        });
      } else {
        // Crear nuevo usuario
        result = await createUser({
          roleId: formData.role,
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          bio: formData.phone?.trim(),
        });

        if ("message" in result) {
          handleServerError(result);
          return;
        }

        const newUser = result.data;

        // Asignar doctores si es secretaria (solo una llamada)
        const secretaryRole = roles.find((role) =>
          role.name.toLowerCase().includes("secretaria")
        );

        if (
          formData.role === secretaryRole?.id &&
          formData.assignedDoctors.length > 0
        ) {
          const assignmentResult = await createSecretaryProfessionalAssignments(
            {
              secretaryId: newUser.id,
              professionals: formData.assignedDoctors,
              isActive: true,
            }
          );
          if ("message" in assignmentResult) {
            toast({
              title: "Usuario creado con advertencias",
              description: "No se pudieron asignar los doctores correctamente.",
              variant: "destructive",
            });
          }
        }

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

  // Componente para mostrar coincidencia de contraseñas
  const PasswordMatchIndicator = () => {
    if (passwordsMatch === null) return null;

    return (
      <div
        className={`flex items-center gap-1 mt-1 text-sm ${
          passwordsMatch ? "text-green-600" : "text-red-600"
        }`}
      >
        {passwordsMatch ? (
          <>
            <CheckCircle2 className="h-3 w-3" />
            Las contraseñas coinciden
          </>
        ) : (
          <>
            <AlertCircle className="h-3 w-3" />
            Las contraseñas no coinciden
          </>
        )}
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

          {/* Información Personal */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Nombre Completo *</Label>
            <Input
              id="fullName"
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

          {/* Contraseña */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">
                {isEditMode ? "Nueva Contraseña (opcional)" : "Contraseña *"}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  placeholder={
                    isEditMode
                      ? "Dejar vacío para mantener actual"
                      : "Mínimo 8 caracteres"
                  }
                  className={`pr-10 ${validationErrors.password ? "border-red-500" : ""}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              <ValidationError field="password" />
              {(formData.password || !isEditMode) && (
                <div className="text-xs text-gray-500">
                  Debe contener al menos una mayúscula, una minúscula y un
                  número
                </div>
              )}
            </div>

            {(formData.password || !isEditMode) && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  {isEditMode
                    ? "Confirmar Nueva Contraseña"
                    : "Confirmar Contraseña *"}
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    placeholder={
                      isEditMode
                        ? "Repetir nueva contraseña"
                        : "Repetir contraseña"
                    }
                    className={`pr-10 ${validationErrors.confirmPassword ? "border-red-500" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                <ValidationError field="confirmPassword" />
                <PasswordMatchIndicator />
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || isLoading}>
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
