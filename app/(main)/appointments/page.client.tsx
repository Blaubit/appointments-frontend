"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Appointment, User, Pagination as PaginationType } from "@/types";
import { AppointmentsCardList } from "@/components/appointments/appointment-card-table";
import { AppointmentsTable } from "@/components/appointments/AppointmentsTable";
import { AppointmentFilters } from "@/components/appointments/appointment-filters";
import { AppointmentExport } from "@/components/appointments/appointment-export";
import { AppointmentsStats } from "@/components/stats/appointments-stats";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Grid, Plus, Table, Calendar } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PageClientProps {
  appointments: Appointment[];
  meta: PaginationType;
  professionals?: User[];
  stats: {
    todayCount: number;
    tomorrowCount: number;
    confirmedCount: number;
    cancelledCount: number;
    pendingCount: number;
  };
  currentUser: User;
}

type ViewMode = "cards" | "table";

export function PageClient({
  appointments,
  meta,
  professionals,
  stats,
  currentUser,
}: PageClientProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleNewAppointment = () => {
    router.push("/appointments/new");
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  const renderPaginationItems = () => {
    const items = [];
    // Reducir páginas visibles en móvil
    const maxVisiblePages = window.innerWidth < 640 ? 3 : 5;
    const startPage = Math.max(
      1,
      meta.currentPage - Math.floor(maxVisiblePages / 2)
    );
    const endPage = Math.min(meta.totalPages, startPage + maxVisiblePages - 1);

    // Mostrar primera página si no está visible
    if (startPage > 1) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={1 === meta.currentPage}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <span className="px-3 py-2 text-sm text-gray-500">...</span>
          </PaginationItem>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={i === meta.currentPage}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Mostrar última página si no está visible
    if (endPage < meta.totalPages) {
      if (endPage < meta.totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <span className="px-3 py-2 text-sm text-gray-500">...</span>
          </PaginationItem>
        );
      }

      items.push(
        <PaginationItem key={meta.totalPages}>
          <PaginationLink
            onClick={() => handlePageChange(meta.totalPages)}
            isActive={meta.totalPages === meta.currentPage}
            className="cursor-pointer"
          >
            {meta.totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  // Obtener filtros activos para mostrar en el header
  const activeFilters = {
    search: searchParams.get("q"),
    status: searchParams.get("status"),
    date: searchParams.get("appointmentDate"),
    professionalId: searchParams.get("professionalId"),
  };

  const getFilterSummary = () => {
    const filters = [];
    if (activeFilters.search) filters.push(`"${activeFilters.search}"`);
    if (activeFilters.status && activeFilters.status !== "all") {
      filters.push(`Estado: ${activeFilters.status}`);
    }
    if (activeFilters.date) filters.push(`Fecha: ${activeFilters.date}`);
    if (activeFilters.professionalId) filters.push(`Profesional seleccionado`);
    return filters.length > 0 ? ` (${filters.join(", ")})` : "";
  };

  return (
    <div>
      <Header title="Appointments" showBackButton backButtonHref="/dashboard" />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 pb-2">
          <AppointmentsStats stats={stats} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Header Card */}
            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Calendar className="h-6 w-6" />
                      Citas Médicas
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      Mostrando {appointments.length} de {meta.totalItems}{" "}
                      appointments
                      {getFilterSummary()}
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Botón Nueva Cita */}
                    <Button
                      onClick={handleNewAppointment}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="hidden sm:inline">Nueva Cita</span>
                      <span className="sm:hidden">Nueva</span>
                    </Button>
                    <AppointmentExport />

                    {/* Separador */}
                    <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />

                    {/* Toggle de vista */}
                    <div className="flex items-center rounded-lg border border-gray-200 dark:border-gray-700 p-1 bg-gray-100 dark:bg-gray-800">
                      <Button
                        variant={viewMode === "cards" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("cards")}
                        className={`${
                          viewMode === "cards"
                            ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                      >
                        <Grid className="h-4 w-4" />
                        <span className="hidden sm:inline ml-1">Tarjetas</span>
                      </Button>
                      <Button
                        variant={viewMode === "table" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("table")}
                        className={`${
                          viewMode === "table"
                            ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                      >
                        <Table className="h-4 w-4" />
                        <span className="hidden sm:inline ml-1">Tabla</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <AppointmentFilters
                  professionals={professionals}
                  currentUser={currentUser}
                />
              </CardContent>
            </Card>

            {/* Contenido y Paginación Card */}
            <Card>
              <CardContent className="p-3 sm:p-6">
                {appointments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mx-auto mb-4 h-24 w-24 text-gray-400 dark:text-gray-600">
                      <Calendar className="h-full w-full" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                      No se encontraron appointments
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {Object.values(activeFilters).some(Boolean)
                        ? "Intenta ajustar los filtros de búsqueda"
                        : "No hay citas disponibles en este momento"}
                    </p>
                    <Button
                      onClick={handleNewAppointment}
                      className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Primera Cita
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Contenido de appointments */}
                    <div>
                      {viewMode === "cards" ? (
                        <AppointmentsCardList appointments={appointments} />
                      ) : (
                        <AppointmentsTable appointments={appointments} />
                      )}
                    </div>

                    {/* Paginación integrada - Mejorada para móvil */}
                    {meta.totalPages > 1 && (
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-6">
                        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                          {/* Info de paginación - Oculta en móvil muy pequeño */}
                          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
                            <span className="hidden sm:inline">
                              Página {meta.currentPage} de {meta.totalPages} •{" "}
                              {meta.totalItems} appointments en total
                            </span>
                            <span className="sm:hidden">
                              {meta.currentPage} / {meta.totalPages}
                            </span>
                          </div>

                          {/* Controles de paginación */}
                          <Pagination className="justify-center">
                            <PaginationContent className="gap-1">
                              <PaginationItem>
                                <PaginationPrevious
                                  onClick={() =>
                                    meta.hasPreviousPage &&
                                    handlePageChange(meta.previousPage!)
                                  }
                                  className={`cursor-pointer text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 ${
                                    !meta.hasPreviousPage
                                      ? "opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-600"
                                      : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                  }`}
                                />
                              </PaginationItem>

                              <div className="hidden sm:flex">
                                {renderPaginationItems()}
                              </div>

                              {/* Paginación simplificada para móvil */}
                              <div className="flex sm:hidden items-center space-x-2">
                                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                                  {meta.currentPage}
                                </span>
                                <span className="text-xs text-gray-500">/</span>
                                <span className="text-xs text-gray-500">
                                  {meta.totalPages}
                                </span>
                              </div>

                              <PaginationItem>
                                <PaginationNext
                                  onClick={() =>
                                    meta.hasNextPage &&
                                    handlePageChange(meta.nextPage!)
                                  }
                                  className={`cursor-pointer text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 ${
                                    !meta.hasNextPage
                                      ? "opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-600"
                                      : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                  }`}
                                />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        </div>

                        {/* Info adicional para móvil */}
                        <div className="sm:hidden text-center mt-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {meta.totalItems} appointments total
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
