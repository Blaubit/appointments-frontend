"use client";

import type React from "react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { z } from "zod";

// Importar los nuevos componentes
import { LoginHeader } from "@/components/auth/LoginHeader";
import { EmailStep } from "@/components/auth/EmailStep";
import { PasswordStep } from "@/components/auth/PasswordStep";
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
  // Estados del cliente
  const [step, setStep] = useState<"email" | "password">("email");
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
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: undefined }));
    }

    setTimeout(() => {
      validateField(field, value);
    }, 300);
  };

  // Manejar siguiente paso (email -> password)
  const handleNextStep = () => {
    if (!formData.email.trim()) {
      setErrors({ email: ["El correo electrónico es requerido"] });
      return;
    }

    try {
      loginSchema.shape.email.parse(formData.email);
      setErrors((prev) => ({ ...prev, email: undefined }));
      setStep("password");
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors({
          email: error.errors.map((e) => e.message),
        });
      }
    }
  };

  // ✅ Manejar envío del formulario - Ahora es async
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
        formDataObj.append("email", formData.email);
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
            <Button variant="ghost" size="sm" disabled={isLoading}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>
          <ThemeToggle className="rounded-full" />
        </div>

        {/* Card principal */}
        <Card className="shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          <LoginHeader step={step} email={formData.email} />

          <CardContent className="px-8 pb-8">
            {/* Mostrar error general */}
            {errors.general && <ErrorAlert message={errors.general} />}

            {step === "email" ? (
              <EmailStep
                email={formData.email}
                onEmailChange={(email) => handleFieldChange("email", email)}
                onNext={handleNextStep}
                hasError={hasFieldError("email")}
                errorMessage={getFieldError("email")}
                isLoading={isLoading}
              />
            ) : (
              <PasswordStep
                email={formData.email}
                password={formData.password}
                remember={formData.remember}
                onPasswordChange={(password) =>
                  handleFieldChange("password", password)
                }
                onRememberChange={(remember) =>
                  handleFieldChange("remember", remember)
                }
                onBackToEmail={() => setStep("email")}
                onSubmit={handleSubmit} // ✅ Ahora el tipo coincide
                hasError={hasFieldError("password")}
                errorMessage={getFieldError("password")}
                isLoading={isLoading}
              />
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <LoginFooter serverMetadata={serverMetadata} isLoading={isLoading} />
      </div>
    </div>
  );
}
