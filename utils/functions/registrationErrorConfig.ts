import type React from "react";
import {
  Ban,
  Lock,
  Shield,
  Clock,
  AlertCircle,
  ServerCrash,
} from "lucide-react";

export interface ErrorConfig {
  title: string;
  message: string;
  details?: string;
  icon: React.ComponentType<{ className?: string }>;
  canRetry: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
    variant?: "default" | "outline" | "destructive";
  }>;
}

// Configuración de errores por código
export const ERROR_CODE_CONFIG: Record<string, ErrorConfig> = {
  COMPANY_NAME_EXISTS: {
    title: "Nombre de Empresa Duplicado",
    message: "Ya existe una empresa con este nombre",
    details: "Por favor, elige un nombre diferente para tu empresa.",
    icon: Ban,
    canRetry: true,
  },

  EMAIL_EXISTS: {
    title: "Email Ya Registrado",
    message: "Este email ya está asociado a otra cuenta",
    details:
      "Por favor, usa un email diferente o recupera tu cuenta existente.",
    icon: Ban,
    canRetry: true,
  },

  VALIDATION_ERROR: {
    title: "Error de Validación",
    message: "Algunos campos contienen errores",
    details:
      "Algunos campos contienen errores. Por favor, revisa la información.",
    icon: AlertCircle,
    canRetry: true,
  },

  PLAN_NOT_FOUND: {
    title: "Plan No Válido",
    message: "El plan seleccionado no está disponible",
    details: "Por favor, selecciona un plan diferente.",
    icon: AlertCircle,
    canRetry: true,
  },

  USER_UNAUTHORIZED: {
    title: "Sesión Expirada",
    message: "Tu sesión ha expirado",
    details: "Por favor, inicia sesión nuevamente para continuar.",
    icon: Lock,
    canRetry: false,
  },

  DATABASE_ERROR: {
    title: "Error de Base de Datos",
    message: "Problema temporal con la base de datos",
    details:
      "Estamos experimentando problemas técnicos. Por favor, inténtalo de nuevo en unos minutos.",
    icon: ServerCrash,
    canRetry: true,
  },

  RATE_LIMIT_EXCEEDED: {
    title: "Demasiados Intentos",
    message: "Has excedido el límite de intentos",
    details: "Por favor, espera unos minutos antes de intentar de nuevo.",
    icon: Clock,
    canRetry: false,
  },

  NETWORK_ERROR: {
    title: "Error de Conexión",
    message: "No se pudo conectar con el servidor",
    details: "Verifica tu conexión a internet e inténtalo de nuevo.",
    icon: ServerCrash,
    canRetry: true,
  },

  UNEXPECTED_RESPONSE: {
    title: "Error Inesperado",
    message: "Respuesta inesperada del servidor",
    details: "Si el problema persiste, contacta con nuestro equipo de soporte.",
    icon: AlertCircle,
    canRetry: true,
  },
};

// Configuración de errores por status HTTP
export const HTTP_STATUS_CONFIG: Record<number, ErrorConfig> = {
  400: {
    title: "Solicitud Inválida",
    message: "Los datos enviados no son válidos",
    details:
      "Los datos enviados no son válidos. Verifica la información e inténtalo de nuevo.",
    icon: Ban,
    canRetry: true,
  },

  401: {
    title: "No Autorizado",
    message: "Tu sesión ha expirado",
    details: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
    icon: Lock,
    canRetry: false,
  },

  403: {
    title: "Acceso Denegado",
    message: "No tienes permisos para realizar esta operación",
    details: "No tienes permisos para realizar esta operación.",
    icon: Shield,
    canRetry: false,
  },

  409: {
    title: "Conflicto de Datos",
    message: "Ya existe un registro con estos datos",
    details:
      "Ya existe un registro con estos datos. Por favor, usa información diferente.",
    icon: Ban,
    canRetry: true,
  },

  422: {
    title: "Error de Validación",
    message: "Los datos no cumplen con los requisitos de validación",
    details: "Los datos no cumplen con los requisitos de validación.",
    icon: AlertCircle,
    canRetry: true,
  },

  500: {
    title: "Error Interno del Servidor",
    message: "Ocurrió un problema en nuestros servidores",
    details:
      "Nuestro equipo ha sido notificado. Por favor, inténtalo de nuevo en unos minutos.",
    icon: ServerCrash,
    canRetry: true,
  },

  502: {
    title: "Servidor No Disponible",
    message: "El servidor no está respondiendo",
    details:
      "Este es un problema temporal. Por favor, inténtalo de nuevo en unos minutos.",
    icon: ServerCrash,
    canRetry: true,
  },

  503: {
    title: "Servicio No Disponible",
    message: "El servicio está temporalmente fuera de línea",
    details:
      "Estamos realizando mantenimiento. El servicio estará disponible pronto.",
    icon: Clock,
    canRetry: true,
  },
};
