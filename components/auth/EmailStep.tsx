"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle, Mail } from "lucide-react";
import Link from "next/link";

interface EmailStepProps {
  email: string;
  onEmailChange: (email: string) => void;
  onNext: () => void;
  hasError: boolean;
  errorMessage?: string;
  isLoading: boolean;
}

export function EmailStep({
  email,
  onEmailChange,
  onNext,
  hasError,
  errorMessage,
  isLoading,
}: EmailStepProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onNext();
    }
  };

  return (
    <div className="space-y-8">
      {/* Input de email con diseño mejorado */}
      <div className="space-y-3">
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200">
            <Mail
              className={`h-5 w-5 ${
                hasError
                  ? "text-red-500"
                  : email
                    ? "text-blue-500"
                    : "text-gray-400 group-focus-within:text-blue-500"
              }`}
            />
          </div>

          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className={`
              h-16 pl-14 pr-4 text-base font-medium
              bg-white dark:bg-gray-800
              border-2 rounded-xl
              transition-all duration-300 ease-in-out
              placeholder:text-gray-400 placeholder:font-normal
              focus:outline-none focus:ring-4 
              ${
                hasError
                  ? "border-red-400 bg-red-50 dark:bg-red-950/20 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-900/20"
                  : email
                    ? "border-blue-400 bg-blue-50/30 dark:bg-blue-950/20 focus:border-blue-500 focus:ring-blue-100 dark:focus:ring-blue-900/20"
                    : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 focus:border-blue-500 focus:ring-blue-100 dark:focus:ring-blue-900/20"
              }
            `}
            disabled={isLoading}
            autoFocus
            autoComplete="email"
          />

          {/* Indicador de estado del campo */}
          {email && !hasError && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>

        {/* Mensaje de error mejorado */}
        {hasError && errorMessage && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3 animate-in slide-in-from-top-2 duration-300">
            <p className="text-sm text-red-700 dark:text-red-300 flex items-center gap-2 font-medium">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {errorMessage}
            </p>
          </div>
        )}
      </div>

      {/* Footer con botones */}
      <div className="flex items-center justify-between pt-6">
        <Button
          onClick={onNext}
          disabled={isLoading || !email.trim()}
          className={`
            px-8 py-3 h-12 font-semibold text-base rounded-lg
            transition-all duration-300 ease-in-out transform
            focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800
            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
            ${
              email.trim() && !isLoading
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
            }
          `}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Verificando...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>Siguiente</span>
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          )}
        </Button>
      </div>

      {/* Indicador de progreso sutil */}
      <div className="flex justify-center">
        <div className="flex space-x-2">
          <div className="w-8 h-1 bg-blue-500 rounded-full"></div>
          <div className="w-8 h-1 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
