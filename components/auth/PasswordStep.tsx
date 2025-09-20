"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Importar useRouter
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, User, Loader2, AlertCircle } from "lucide-react";

interface PasswordStepProps {
  email: string;
  password: string;
  remember: boolean;
  onPasswordChange: (password: string) => void;
  onRememberChange: (remember: boolean) => void;
  onBackToEmail: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  hasError: boolean;
  errorMessage?: string;
  isLoading: boolean;
}

export function PasswordStep({
  email,
  password,
  remember,
  onPasswordChange,
  onRememberChange,
  onBackToEmail,
  onSubmit,
  hasError,
  errorMessage,
  isLoading,
}: PasswordStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter(); // ✅ Usar el hook de router

  // ✅ Función para manejar la redirección
  const handleForgotPassword = () => {
    router.push("/login/forgot-password");
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Mostrar email seleccionado */}
      <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700">
        <div className="p-1 bg-gray-300 dark:bg-gray-600 rounded-full">
          <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        </div>
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {email}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onBackToEmail}
          className="ml-auto text-blue-600 hover:text-blue-700 text-sm"
          disabled={isLoading}
        >
          Cambiar
        </Button>
      </div>

      <div className="space-y-2">
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Introduce tu contraseña"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className={`h-14 text-base pr-12 border-gray-300 dark:border-gray-600 rounded-md focus:border-blue-500 focus:ring-blue-500 ${
              hasError
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : ""
            }`}
            disabled={isLoading}
            autoFocus
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-500" />
            ) : (
              <Eye className="h-4 w-4 text-gray-500" />
            )}
          </Button>
        </div>
        {hasError && errorMessage && (
          <p className="text-sm text-red-500 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {errorMessage}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="remember"
          name="remember"
          checked={remember}
          onChange={(e) => onRememberChange(e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          disabled={isLoading}
        />
        <Label
          htmlFor="remember"
          className="text-sm text-gray-600 dark:text-gray-400"
        >
          Recordar mi sesión
        </Label>
      </div>

      <div className="flex justify-between items-center pt-4">
        <Button
          variant="ghost"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium"
          disabled={isLoading}
          type="button"
          onClick={handleForgotPassword} // ✅ Agregar el onClick
        >
          ¿Olvidaste tu contraseña?
        </Button>

        <Button
          type="submit"
          disabled={isLoading || !password.trim()}
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
  );
}
