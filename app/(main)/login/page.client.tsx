"use client";

import type React from "react";
import { useState, useTransition } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calendar,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Clock,
  Stethoscope,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

interface ServerMetadata {
  timestamp: string;
  environment: string;
  version: string;
}

interface LoginClientProps {
  serverAction: (formData: FormData) => Promise<{ error?: string } | void>;
  serverMetadata: ServerMetadata;
}

export default function LoginClient({
  serverAction,
  serverMetadata,
}: LoginClientProps) {
  // Estados del cliente
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, startTransition] = useTransition();

  // Validación del cliente
  const validateForm = () => {
    if (!email.trim()) {
      setError("El correo electrónico es requerido");
      return false;
    }

    if (!email.includes("@")) {
      setError("Por favor ingresa un correo electrónico válido");
      return false;
    }

    if (!password.trim()) {
      setError("La contraseña es requerida");
      return false;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }

    return true;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validación del cliente
    if (!validateForm()) {
      return;
    }

    // Ejecutar acción del servidor
    startTransition(async () => {
      try {
        const formData = new FormData(e.currentTarget);
        const result = await serverAction(formData);

        if (result?.error) {
          setError(result.error);
        }
        // Si no hay error, el servidor redirigirá automáticamente
      } catch (err) {
        console.error("Error durante el login:", err);
        setError("Ocurrió un error inesperado. Por favor intenta de nuevo.");
      }
    });
  };

  // Efectos de animación y UX
  const handleInputFocus = (inputName: string) => {
    setError(""); // Limpiar errores al enfocar campos
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md">
        {/* Back to home */}
        <div className="flex justify-between items-center mb-4">
          <Link href="/">
            <Button variant="ghost" size="sm" disabled={isLoading}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>
          <ThemeToggle className="rounded-full" />
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full">
                <Calendar className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Planit
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Gestiona tus citas de forma inteligente
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Mostrar errores */}
            {error && (
              <Alert
                variant="destructive"
                className="animate-in slide-in-from-top-2"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Correo electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => handleInputFocus("email")}
                    className="pl-10 h-12"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => handleInputFocus("password")}
                    className="pl-10 pr-10 h-12"
                    disabled={isLoading}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm text-muted-foreground"
                >
                  Recordar mi sesión
                </Label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold text-lg disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
            </form>

            <div className="text-center">
              <Button
                variant="link"
                className="text-sm text-muted-foreground hover:text-blue-600"
                disabled={isLoading}
              >
                ¿Olvidaste tu contraseña?
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Acceso rápido
                </span>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              ¿No tienes cuenta?{" "}
              <Link href="/register">
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold text-blue-600 hover:text-blue-700"
                  disabled={isLoading}
                >
                  Regístrate aquí
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Features Section */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
            <Calendar className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <p className="text-xs text-muted-foreground">Agenda Online</p>
          </div>
          <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
            <Clock className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <p className="text-xs text-muted-foreground">24/7 Disponible</p>
          </div>
          <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
            <Stethoscope className="h-6 w-6 mx-auto mb-2 text-purple-600" />
            <p className="text-xs text-muted-foreground">Multi-Servicios</p>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>Al continuar, aceptas nuestros</p>
          <Link href="/policies">
            <div className="flex justify-center space-x-4 mt-1">
              <Button
                variant="link"
                className="p-0 h-auto text-xs text-muted-foreground hover:text-blue-600"
                disabled={isLoading}
              >
                Términos de Servicio
              </Button>
              <span>•</span>
              <Button
                variant="link"
                className="p-0 h-auto text-xs text-muted-foreground hover:text-blue-600"
                disabled={isLoading}
              >
                Política de Privacidad
              </Button>
            </div>
          </Link>

          {/* Debug info en desarrollo */}
          {serverMetadata.environment === "development" && (
            <div className="mt-2 text-xs opacity-50">
              v{serverMetadata.version} •{" "}
              {new Date(serverMetadata.timestamp).toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
