"use client";

import type React from "react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Calendar, CheckCircle, Mail } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { z } from "zod";

// Importar el componente EmailStep
import { EmailStep } from "@/components/auth/EmailStep";
import { ErrorAlert } from "@/components/auth/ErrorAlert";

// Schema de validación para email
const forgotPasswordSchema = z.object({
  email: z.string().email("Ingresa un correo electrónico válido"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ServerMetadata {
  timestamp: string;
  environment: string;
  version: string;
}

interface ForgotPasswordClientProps {
  serverAction: (formData: FormData) => Promise<{
    success?: boolean;
    error?: string;
    fieldErrors?: Record<string, string[]>;
  } | void>;
  serverMetadata: ServerMetadata;
}

export default function ForgotPasswordClient({
  serverAction,
  serverMetadata,
}: ForgotPasswordClientProps) {
  // Estados del cliente
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"input" | "success">("input");
  const [errors, setErrors] = useState<{
    general?: string;
    email?: string[];
  }>({});
  const [isLoading, startTransition] = useTransition();

  // Validación del email
  const validateEmail = (emailValue: string): boolean => {
    try {
      forgotPasswordSchema.parse({ email: emailValue });
      setErrors((prev) => ({ ...prev, email: undefined }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({
          ...prev,
          email: error.errors.map((e) => e.message),
        }));
      }
      return false;
    }
  };

  // Manejar cambios en el email
  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);

    // Limpiar error general al cambiar el email
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: undefined }));
    }

    // Validar después de un breve delay
    setTimeout(() => {
      if (newEmail.trim()) {
        validateEmail(newEmail);
      } else {
        setErrors((prev) => ({ ...prev, email: undefined }));
      }
    }, 300);
  };

  // Manejar envío del formulario
  const handleSubmit = async () => {
    setErrors({});

    // Validación del cliente
    if (!email.trim()) {
      setErrors({ email: ["El correo electrónico es requerido"] });
      return;
    }

    if (!validateEmail(email)) {
      return;
    }

    // Ejecutar acción del servidor
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("email", email);

        const result = await serverAction(formData);

        if (result?.success) {
          setStep("success");
        } else if (result?.error) {
          setErrors({ general: result.error });
        } else if (result?.fieldErrors) {
          setErrors((prev) => ({ ...prev, ...result.fieldErrors }));
        }
      } catch (err) {
        console.error("Error al enviar email de recuperación:", err);
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
          <Link href="/login">
            <Button variant="ghost" size="sm" disabled={isLoading}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al login
            </Button>
          </Link>
          <ThemeToggle className="rounded-full" />
        </div>

        {/* Card principal */}
        <Card className="shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          {step === "input" ? (
            <>
              {/* Header del formulario */}
              <CardHeader className="text-center space-y-6 pb-8">
                <div className="flex justify-center">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                </div>

                <div>
                  <CardTitle className="text-2xl font-normal text-gray-900 dark:text-white mb-2">
                    Recuperar contraseña
                  </CardTitle>
                  <CardDescription className="text-base text-gray-600 dark:text-gray-400">
                    Te enviaremos un enlace para restablecer tu contraseña
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="px-8 pb-8">
                {/* Mostrar error general */}
                {errors.general && <ErrorAlert message={errors.general} />}

                {/* Usar el componente EmailStep */}
                <EmailStep
                  email={email}
                  onEmailChange={handleEmailChange}
                  onNext={handleSubmit}
                  hasError={hasFieldError("email")}
                  errorMessage={getFieldError("email")}
                  isLoading={isLoading}
                />
              </CardContent>
            </>
          ) : (
            <>
              {/* Pantalla de éxito */}
              <CardHeader className="text-center space-y-6 pb-8">
                <div className="flex justify-center">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                </div>

                <div>
                  <CardTitle className="text-2xl font-normal text-gray-900 dark:text-white mb-2">
                    Revisa tu correo
                  </CardTitle>
                  <CardDescription className="text-base text-gray-600 dark:text-gray-400">
                    Hemos enviado las instrucciones de recuperación a
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="px-8 pb-8 space-y-6">
                {/* Mostrar email enviado */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <p className="text-center font-medium text-gray-900 dark:text-white">
                    {email}
                  </p>
                </div>

                {/* Información adicional */}
                <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
                      ¿Qué hacer ahora?
                    </h4>
                    <ul className="space-y-1 text-blue-800 dark:text-blue-300">
                      <li>• Revisa tu bandeja de entrada</li>
                      <li>• Si no lo encuentras, revisa la carpeta de spam</li>
                      <li>• Haz clic en el enlace del correo</li>
                    </ul>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      setStep("input");
                      setEmail("");
                      setErrors({});
                    }}
                    variant="outline"
                    className="w-full h-12 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    disabled={isLoading}
                  >
                    Usar otro correo electrónico
                  </Button>

                  <Link href="/login" className="block">
                    <Button
                      variant="ghost"
                      className="w-full h-12 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                      disabled={isLoading}
                    >
                      Volver al inicio de sesión
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </>
          )}
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
          <div className="flex justify-center space-x-6">
            <Link href="/help">
              <Button
                variant="link"
                className="p-0 h-auto text-xs text-gray-500 hover:text-blue-600"
                disabled={isLoading}
              >
                ¿Necesitas ayuda?
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="link"
                className="p-0 h-auto text-xs text-gray-500 hover:text-blue-600"
                disabled={isLoading}
              >
                Contactar soporte
              </Button>
            </Link>
          </div>

          {/* Debug info en desarrollo */}
          {serverMetadata.environment === "development" && (
            <div className="mt-4 text-xs opacity-50">
              v{serverMetadata.version} •{" "}
              {new Date(serverMetadata.timestamp).toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
