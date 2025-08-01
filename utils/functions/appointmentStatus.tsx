import {
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  CalendarCheck2,
  Hourglass,
  Ban,
  ListPlus,
} from "lucide-react";
import React from "react";

export const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "in_progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "scheduled":
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300";
    case "no_show":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
    case "expired":
      return "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    case "rescheduled":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    case "confirmed":
      return "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300";
    case "cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "waitlist":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-3 w-3" />;
    case "in_progress":
      return <RefreshCw className="h-3 w-3" />;
    case "scheduled":
      return <CalendarCheck2 className="h-3 w-3" />;
    case "no_show":
      return <Ban className="h-3 w-3" />;
    case "expired":
      return <Hourglass className="h-3 w-3" />;
    case "rescheduled":
      return <RefreshCw className="h-3 w-3" />;
    case "confirmed":
      return <CheckCircle className="h-3 w-3" />;
    case "cancelled":
      return <XCircle className="h-3 w-3" />;
    case "waitlist":
      return <ListPlus className="h-3 w-3" />;
    default:
      return <Clock className="h-3 w-3" />;
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case "completed":
      return "Completada";
    case "in_progress":
      return "En progreso";
    case "scheduled":
      return "Agendada";
    case "no_show":
      return "No asistió";
    case "expired":
      return "Expirada";
    case "rescheduled":
      return "Reagendada";
    case "confirmed":
      return "Confirmada";
    case "cancelled":
      return "Cancelada";
    case "waitlist":
      return "Lista de espera";
    default:
      return "Desconocido";
  }
};
