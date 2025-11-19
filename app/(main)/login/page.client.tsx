"use client";

import type React from "react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Mail,
  Loader2,
  AlertCircle,
  User,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { z } from "zod";

import { LoginHeader } from "@/components/auth/LoginHeader";
import { LoginFooter } from "@/components/auth/LoginFooter";
import { ErrorAlert } from "@/components/auth/ErrorAlert";

interface ServerMetadata {
  timestamp: string;
  environment: string;
  version: string;
}

interface LoginClientProps {
  serverAction: (formData: FormData) => Promise<{
    error?: string;
    fieldErrors?: Record<string, string[]>;
  } | void>;
  serverMetadata: ServerMetadata;
}

export default function LoginClient({
  serverAction,
  serverMetadata,
}: LoginClientProps) {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState<{
    general?: string;
    email?: string[];
    password?: string[];
  }>({});
  const [isLoading, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  // Validación en tiempo real del campo
  const validateField = (field: keyof LoginFormData, value: any) => {
    try {
      const fieldSchema = loginSchema.shape[field];
      fieldSchema.parse(value);
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({
          ...prev,
          [field]: error.errors.map((e) => e.message),
        }));
      }
    }
  };

  // Validación completa del formulario
  const validateForm = (): boolean => {
    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string[]> = {};

      result.error.errors.forEach((error) => {
        const field = error.path[0] as string;
        if (!fieldErrors[field]) {
          fieldErrors[field] = [];
        }
        fieldErrors[field].push(error.message);
      });

      setErrors({ ...fieldErrors });
      return false;
    }

    setErrors({});
    return true;
  };

  // Manejar cambios en los campos
  const handleFieldChange = (field: keyof LoginFormData, value: any) => {
    // Normalizar email a minúsculas y trim al actualizar el state para consistencia
    const normalizedValue =
      field === "email"
        ? String(value ?? "")
            .trim()
            .toLowerCase()
        : value;

    setFormData((prev) => ({
      ...prev,
      [field]: normalizedValue,
    }));

    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: undefined }));
    }

    setTimeout(() => {
      validateField(field, normalizedValue);
    }, 300);
  };

  // Submit único (email + password en la misma página)
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    startTransition(async () => {
      try {
        const formDataObj = new FormData();
        // Aseguramos normalización final antes de enviar
        formDataObj.append(
          "email",
          String(formData.email).trim().toLowerCase()
        );
        formDataObj.append("password", formData.password);
        if (formData.remember) {
          formDataObj.append("remember", "on");
        }

        const result = await serverAction(formDataObj);

        if (result?.error) {
          setErrors({ general: result.error });
        }

        if (result?.fieldErrors) {
          setErrors((prev) => ({ ...prev, ...result.fieldErrors }));
        }
      } catch (err) {
        console.error("Error durante el login:", err);
        setErrors({
          general: "Ocurrió un error inesperado. Por favor intenta de nuevo.",
        });
      }
    });
  };

  // Helper para obtener el primer error de un campo
  const getFieldError = (field: keyof typeof errors) => {
    const fieldErrors = errors[field];
    return Array.isArray(fieldErrors) ? fieldErrors[0] : fieldErrors;
  };

  // Helper para verificar si un campo tiene errores
  const hasFieldError = (field: keyof typeof errors) => {
    const fieldErrors = errors[field];
    return Array.isArray(fieldErrors) ? fieldErrors.length > 0 : !!fieldErrors;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md">
        {/* Header con botón de regreso y theme toggle */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" disabled={isLoading as boolean}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>
          <ThemeToggle className="rounded-full" />
        </div>

        {/* Card principal */}
        <Card className="shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          {/* Mantengo LoginHeader para consistencia visual */}
          <LoginHeader email={formData.email} />

          <CardContent className="px-8 pb-8">
            {/* Mostrar error general */}
            {errors.general && <ErrorAlert message={errors.general} />}

            {/* Formulario único con email, password y recordar */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="sr-only">
                  Correo electrónico
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200">
                    <Mail
                      className={`h-5 w-5 ${
                        hasFieldError("email")
                          ? "text-red-500"
                          : formData.email
                            ? "text-blue-500"
                            : "text-gray-400 group-focus-within:text-blue-500"
                      }`}
                    />
                  </div>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Correo electrónico"
                    value={formData.email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    className={`
                      h-14 pl-14 pr-4 text-base font-medium w-full
                      bg-white dark:bg-gray-800
                      border-2 rounded-xl
                      transition-all duration-300 ease-in-out
                      placeholder:text-gray-400 placeholder:font-normal
                      focus:outline-none focus:ring-4
                      ${
                        hasFieldError("email")
                          ? "border-red-400 bg-red-50 dark:bg-red-950/20 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-900/20"
                          : formData.email
                            ? "border-blue-400 bg-blue-50/30 dark:bg-blue-950/20 focus:border-blue-500 focus:ring-blue-100 dark:focus:ring-blue-900/20"
                            : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 focus:border-blue-500 focus:ring-blue-100 dark:focus:ring-blue-900/20"
                      }
                    `}
                    disabled={isLoading as boolean}
                    autoFocus
                    autoComplete="email"
                  />
                </div>

                {hasFieldError("email") && getFieldError("email") && (
                  <div className="mt-2 text-sm text-red-600 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {getFieldError("email")}
                  </div>
                )}
              </div>

              {/* Password (ahora con ícono a la izquierda y padding consistente) */}
              <div className="space-y-2">
                <label htmlFor="password" className="sr-only">
                  Contraseña
                </label>

                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200">
                    <Lock
                      className={`h-5 w-5 ${
                        hasFieldError("password")
                          ? "text-red-500"
                          : formData.password
                            ? "text-blue-500"
                            : "text-gray-400 group-focus-within:text-blue-500"
                      }`}
                    />
                  </div>

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Introduce tu contraseña"
                    value={formData.password}
                    onChange={(e) =>
                      handleFieldChange("password", e.target.value)
                    }
                    className={`h-14 text-base pr-12 pl-14 w-full
        bg-white dark:bg-gray-800
        border-2 rounded-xl
        transition-all duration-300 ease-in-out
        placeholder:text-gray-400 placeholder:font-normal
        focus:outline-none focus:ring-4
        ${hasFieldError("password") ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-100 dark:focus:ring-blue-900/20"}
      `}
                    disabled={isLoading as boolean}
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading as boolean}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>

                {hasFieldError("password") && getFieldError("password") && (
                  <div className="mt-2 text-sm text-red-600 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {getFieldError("password")}
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium"
                  disabled={isLoading as boolean}
                  onClick={() => {
                    // Redirigir a forgot password
                    window.location.href = "/login/forgot-password";
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </button>

                <Button
                  type="submit"
                  disabled={
                    (isLoading as boolean) ||
                    !formData.password.trim() ||
                    !formData.email.trim()
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 h-10"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Iniciando...
                    </>
                  ) : (
                    "Iniciar sesión"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <LoginFooter
          serverMetadata={serverMetadata}
          isLoading={isLoading as boolean}
        />
      </div>
    </div>
  );
}
