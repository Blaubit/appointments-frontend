"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Client, Pagination } from "@/types";
import type {
  Appointment,
  ClientAppointmentsStats,
} from "@/types/appointments";
import { Header } from "@/components/header";
import { AppointmentDetailsDialog } from "@/components/appointment-details-dialog";
import { ClientStatsSection } from "@/components/stats/client-stats";
import { AppointmentsTimeline } from "@/components/appointments/history/appointment-timeline";
import {
  Pagination as PaginationUI,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent } from "@/components/ui/card";

interface ClientHistoryPageClientProps {
  client: Client;
  appointments: Appointment[];
  stats: ClientAppointmentsStats;
  meta: Pagination;
}

export default function ClientHistoryPageClient({
  client,
  appointments,
  stats,
  meta,
}: ClientHistoryPageClientProps) {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | undefined
  >(undefined);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleViewAppointment = (appointment: Appointment) => {
    setSelectedAppointmentId(appointment.id);
    setShowDetailsDialog(true);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  const renderPaginationItems = () => {
    const items = [];
    // Reducir páginas visibles en móvil
    const maxVisiblePages =
      typeof window !== "undefined" && window.innerWidth < 640 ? 3 : 5;
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header del Cliente */}
      <Header
        title={`Historial`}
        showBackButton={true}
        backButtonText="pacientes"
        backButtonHref={`/clients`}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Estadísticas del Cliente */}
        <ClientStatsSection stats={stats} />

        {/* Timeline de Citas */}
        <AppointmentsTimeline
          client={client}
          appointments={appointments}
          onViewAppointment={handleViewAppointment}
        />

        {/* Paginación */}
        {meta.totalPages > 1 && (
          <Card className="mt-6">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                {/* Info de paginación */}
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
                  <span className="hidden sm:inline">
                    Página {meta.currentPage} de {meta.totalPages} •{" "}
                    {meta.totalItems} citas en total
                  </span>
                  <span className="sm:hidden">
                    {meta.currentPage} / {meta.totalPages}
                  </span>
                </div>

                {/* Controles de paginación */}
                <PaginationUI className="justify-center">
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
                          meta.hasNextPage && handlePageChange(meta.nextPage!)
                        }
                        className={`cursor-pointer text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 ${
                          !meta.hasNextPage
                            ? "opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-600"
                            : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        }`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </PaginationUI>
              </div>

              {/* Info adicional para móvil */}
              <div className="sm:hidden text-center mt-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {meta.totalItems} citas en total
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Modal de Detalles */}
        <AppointmentDetailsDialog
          appointmentId={selectedAppointmentId}
          isOpen={showDetailsDialog}
          onClose={() => setShowDetailsDialog(false)}
          onEdit={() => {}}
          onDelete={() => {}}
          onCall={() => {}}
          onEmail={() => {}}
          onCancel={() => {}}
        />
      </div>
    </div>
  );
}
