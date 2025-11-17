"use client";

import { AppointmentSearch } from "@/components/appointments/appointments-search";
import { AppointmentStatusFilter } from "@/components/appointments/appointments-status-filter";
import { AppointmentDateFilter } from "@/components/appointments/appointment-date-filter";
import { AppointmentProfessionalFilter } from "@/components/appointments/appointment-professional-filter";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { User } from "@/types";

interface AppointmentFiltersProps {
  className?: string;
  professionals?: User[];
  currentUser?: User;
}

export function AppointmentFilters({
  className = "",
  professionals = [],
  currentUser,
}: AppointmentFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const hasFilters =
    searchParams.get("q") ||
    searchParams.get("status") ||
    searchParams.get("appointmentDate") ||
    searchParams.get("professionalId");

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("q");
    params.delete("status");
    params.delete("appointmentDate");
    params.delete("professionalId");
    params.delete("page");

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Contenedor de filtros */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
        <AppointmentSearch
          placeholder="Buscar por paciente, doctor o notas..."
          className="w-full sm:w-80"
        />
        <AppointmentStatusFilter />
        <AppointmentDateFilter />
        {(professionals.length > 0 || currentUser) && (
          <AppointmentProfessionalFilter
            professionals={professionals}
            currentUser={currentUser}
            className="w-full sm:w-auto"
          />
        )}
      </div>

      {/* Botón de limpiar filtros en su propia fila */}
      {hasFilters && (
        <div className="flex justify-start">
          <Button
            variant="outline"
            onClick={clearAllFilters}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Limpiar filtros
          </Button>
        </div>
      )}
    </div>
  );
}
