import { useState } from "react";
import type React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import {
  ERROR_CODE_CONFIG,
  HTTP_STATUS_CONFIG,
} from "@/utils/functions/registrationErrorConfig";

export interface RegistrationErrorState {
  show: boolean;
  title: string;
  message: string;
  details?: string;
  code?: string;
  statusCode?: number;
  canRetry: boolean;
  icon: React.ComponentType<{ className?: string }>;
  actions?: Array<{
    label: string;
    action: () => void;
    variant?: "default" | "outline" | "destructive";
  }>;
}

const DEFAULT_ERROR_STATE: RegistrationErrorState = {
  show: false,
  title: "",
  message: "",
  details: "",
  code: "",
  statusCode: undefined,
  canRetry: false,
  icon: AlertCircle,
  actions: [],
};

export const useRegistrationError = () => {
  const [registrationError, setRegistrationError] =
    useState<RegistrationErrorState>(DEFAULT_ERROR_STATE);

  const clearError = () => {
    setRegistrationError(DEFAULT_ERROR_STATE);
  };

  const setErrorFromResponse = (
    errorResponse: any,
    customActions?: Array<{
      label: string;
      action: () => void;
      variant?: "default" | "outline" | "destructive";
    }>
  ) => {
    const statusCode = errorResponse?.status || errorResponse?.statusCode;
    const errorCode = errorResponse?.code;
    const message = errorResponse?.message || "Error desconocido";

    let errorConfig;

    // Intentar obtener configuración por código de error
    if (errorCode && ERROR_CODE_CONFIG[errorCode]) {
      errorConfig = ERROR_CODE_CONFIG[errorCode];
    }
    // Si no hay código, usar status HTTP
    else if (statusCode && HTTP_STATUS_CONFIG[statusCode]) {
      errorConfig = HTTP_STATUS_CONFIG[statusCode];
    }
    // Error genérico
    else {
      errorConfig = {
        title: "Error Inesperado",
        message: message,
        details:
          "Si el problema persiste, contacta con nuestro equipo de soporte.",
        icon: AlertCircle,
        canRetry: true,
      };
    }

    setRegistrationError({
      show: true,
      code: errorCode,
      statusCode,
      ...errorConfig,
      actions: customActions || errorConfig.actions,
    });
  };

  return {
    registrationError,
    clearError,
    setErrorFromResponse,
  };
};
