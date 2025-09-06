"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  UserCheck,
  Shield,
} from "lucide-react";
import { Role } from "@/types";

interface UserData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  bio: string;
  roleId?: string;
}

interface UserRegistrationCardProps {
  /** Datos del usuario */
  userData: UserData;
  /** Función para actualizar los datos del usuario */
  onUserDataChange: (data: UserData) => void;
  /** Lista de roles disponibles */
  roles?: Role[];
  /** Errores de validación */
  errors?: Record<string, string>;
  /** Función llamada al avanzar al siguiente paso */
  onNext?: () => void;
  /** Función llamada al retroceder al paso anterior */
  onPrevious?: () => void;
  /** Si mostrar el botón de anterior */
  showPreviousButton?: boolean;
  /** Si mostrar el botón de siguiente */
  showNextButton?: boolean;
  /** Si mostrar el selector de rol */
  showRoleSelector?: boolean;
  /** Rol por defecto (si no se muestra selector) */
  defaultRole?: Role;
  /** Texto del botón siguiente */
  nextButtonText?: string;
  /** Texto del botón anterior */
  previousButtonText?: string;
  /** Si el botón siguiente está deshabilitado */
  nextButtonDisabled?: boolean;
  /** Clase CSS adicional para el card */
  className?: string;
  /** Título personalizado */
  title?: string;
  /** Descripción personalizada */
  description?: string;
  /** Si mostrar información del rol */
  showRoleInfo?: boolean;
}

const defaultUserData: UserData = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  bio: "",
  roleId: "",
};

export default function UserRegistrationCard({
  userData = defaultUserData,
  onUserDataChange,
  roles = [],
  errors = {},
  onNext,
  onPrevious,
  showPreviousButton = true,
  showNextButton = true,
  showRoleSelector = false,
  defaultRole,
  nextButtonText = "Continuar",
  previousButtonText = "Anterior",
  nextButtonDisabled = false,
  className = "",
  title = "Datos del Usuario",
  description = "Crea tu cuenta para gestionar la plataforma",
  showRoleInfo = true,
}: UserRegistrationCardProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const updateField = (field: keyof UserData, value: string) => {
    onUserDataChange({
      ...userData,
      [field]: value,
    });
  };

  // Determinar el rol actual
  const currentRole = showRoleSelector
    ? roles.find((role) => role.id === userData.roleId)
    : defaultRole;

  const getRoleIcon = (roleName?: string) => {
    if (!roleName) return <UserCheck className="h-4 w-4" />;

    switch (roleName.toLowerCase()) {
      case "admin_empresa":
      case "administrador":
        return <Shield className="h-4 w-4" />;
      case "doctor":
      case "medico":
        return <UserCheck className="h-4 w-4" />;
      case "secretaria":
      case "recepcionista":
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleDescription = (roleName?: string) => {
    if (!roleName) return "Usuario estándar de la plataforma";

    switch (roleName.toLowerCase()) {
      case "admin_empresa":
      case "administrador":
        return "Acceso completo para gestionar usuarios, citas, servicios y configuraciones de la empresa.";
      case "doctor":
      case "medico":
        return "Acceso para gestionar citas, ver pacientes y actualizar historial médico.";
      case "secretaria":
      case "recepcionista":
        return "Acceso para gestionar citas, registrar pacientes y manejar la agenda.";
      default:
        return "Acceso básico a la plataforma según permisos asignados.";
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
            <User className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
        </div>
        <div>
          <CardTitle className="text-xl sm:text-2xl font-bold">
            {title}
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            {description}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Información del rol */}
        {showRoleInfo && currentRole && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2 text-sm sm:text-base flex items-center">
              {getRoleIcon(currentRole.name)}
              <span className="ml-2">
                Rol:{" "}
                {currentRole.name
                  .replace("_", " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </span>
            </h4>
            <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-400">
              {getRoleDescription(currentRole.name)}
            </p>
          </div>
        )}

        {/* Selector de rol */}
        {showRoleSelector && (
          <div className="space-y-2">
            <Label htmlFor="role">Rol del Usuario *</Label>
            <Select
              value={userData.roleId}
              onValueChange={(value) => updateField("roleId", value)}
            >
              <SelectTrigger className={errors.roleId ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecciona el rol del usuario" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(role.name)}
                      <span>
                        {role.name
                          .replace("_", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.roleId && (
              <p className="text-sm text-red-600">{errors.roleId}</p>
            )}
          </div>
        )}

        {/* Nombre completo */}
        <div className="space-y-2">
          <Label htmlFor="fullName">Nombre Completo *</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="fullName"
              value={userData.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              placeholder="Dr. Juan Carlos Pérez"
              className={`pl-10 ${errors.fullName ? "border-red-500" : ""}`}
            />
          </div>
          {errors.fullName && (
            <p className="text-sm text-red-600">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Correo Electrónico *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={userData.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="usuario@clinica.com"
              className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Contraseñas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña *</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={userData.password}
                onChange={(e) => updateField("password", e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={userData.confirmPassword}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
                placeholder="Repite tu contraseña"
                className={`pl-10 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        <Separator />

        {/* Biografía */}
        <div className="space-y-2">
          <Label htmlFor="bio">
            Biografía Profesional{" "}
            {currentRole?.name === "admin_empresa" ? "" : "*"}
          </Label>
          <Textarea
            id="bio"
            value={userData.bio}
            onChange={(e) => updateField("bio", e.target.value)}
            placeholder="Describe tu experiencia profesional, especialidades, etc... (mínimo 10 caracteres)"
            rows={3}
            className={errors.bio ? "border-red-500" : ""}
          />
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
              {userData.bio.trim().length === 0
                ? currentRole?.name === "admin_empresa"
                  ? "Campo opcional, pero si lo completas debe tener al menos 10 caracteres"
                  : "Campo requerido, mínimo 10 caracteres"
                : `${userData.bio.trim().length} caracteres`}
            </p>
            {userData.bio.trim().length >= 10 && (
              <span className="text-xs text-green-600">✓ Válido</span>
            )}
          </div>
          {errors.bio && <p className="text-sm text-red-600">{errors.bio}</p>}
        </div>

        {/* Indicadores de fortaleza de contraseña */}
        {userData.password && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Fortaleza de la contraseña
            </Label>
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-xs">
                <div
                  className={`w-2 h-2 rounded-full ${userData.password.length >= 8 ? "bg-green-500" : "bg-gray-300"}`}
                />
                <span
                  className={
                    userData.password.length >= 8
                      ? "text-green-600"
                      : "text-gray-500"
                  }
                >
                  Al menos 8 caracteres
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div
                  className={`w-2 h-2 rounded-full ${/[A-Z]/.test(userData.password) ? "bg-green-500" : "bg-gray-300"}`}
                />
                <span
                  className={
                    /[A-Z]/.test(userData.password)
                      ? "text-green-600"
                      : "text-gray-500"
                  }
                >
                  Una letra mayúscula
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div
                  className={`w-2 h-2 rounded-full ${/[0-9]/.test(userData.password) ? "bg-green-500" : "bg-gray-300"}`}
                />
                <span
                  className={
                    /[0-9]/.test(userData.password)
                      ? "text-green-600"
                      : "text-gray-500"
                  }
                >
                  Un número
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div
                  className={`w-2 h-2 rounded-full ${/[!@#$%^&*(),.?":{}|<>]/.test(userData.password) ? "bg-green-500" : "bg-gray-300"}`}
                />
                <span
                  className={
                    /[!@#$%^&*(),.?":{}|<>]/.test(userData.password)
                      ? "text-green-600"
                      : "text-gray-500"
                  }
                >
                  Un carácter especial
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Botones de navegación */}
        {(showPreviousButton || showNextButton) && (
          <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
            {showPreviousButton ? (
              <Button
                type="button"
                variant="outline"
                onClick={onPrevious}
                className="order-2 sm:order-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {previousButtonText}
              </Button>
            ) : (
              <div /> // Spacer para mantener el layout
            )}

            {showNextButton && (
              <Button
                type="button"
                onClick={onNext}
                disabled={nextButtonDisabled}
                className="order-1 sm:order-2"
              >
                {nextButtonText}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Hook personalizado para manejar la validación del usuario
export function useUserValidation() {
  const validateUser = (
    userData: UserData,
    isAdminRole: boolean = false
  ): Record<string, string> => {
    const errors: Record<string, string> = {};

    // Validar nombre completo
    if (!userData.fullName.trim()) {
      errors.fullName = "El nombre completo es requerido";
    } else if (userData.fullName.trim().length < 3) {
      errors.fullName = "El nombre completo debe tener al menos 3 caracteres";
    }

    // Validar email
    if (!userData.email.trim()) {
      errors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      errors.email = "Email inválido";
    }

    // Validar contraseña
    if (!userData.password) {
      errors.password = "La contraseña es requerida";
    } else if (userData.password.length < 8) {
      errors.password = "La contraseña debe tener al menos 8 caracteres";
    }

    // Validar confirmación de contraseña
    if (userData.password !== userData.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
    }

    // Validar biografía
    const bioTrimmed = userData.bio.trim();
    if (isAdminRole) {
      // Para admin es opcional, pero si se completa debe tener al menos 10 caracteres
      if (bioTrimmed.length > 0 && bioTrimmed.length < 10) {
        errors.bio = "La biografía debe tener al menos 10 caracteres";
      }
    } else {
      // Para otros roles es requerida
      if (bioTrimmed.length === 0) {
        errors.bio = "La biografía es requerida";
      } else if (bioTrimmed.length < 10) {
        errors.bio = "La biografía debe tener al menos 10 caracteres";
      }
    }

    return errors;
  };

  const isValidUser = (
    userData: UserData,
    isAdminRole: boolean = false
  ): boolean => {
    const errors = validateUser(userData, isAdminRole);
    return Object.keys(errors).length === 0;
  };

  const getPasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  };

  return { validateUser, isValidUser, getPasswordStrength };
}
