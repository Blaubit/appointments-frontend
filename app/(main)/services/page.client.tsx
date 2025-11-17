"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { ServiceForm } from "@/components/services/service-form";
import { ServicePagination } from "@/components/service-pagination";
import type { Service as ServiceType, User } from "@/types";
import deleteService from "@/actions/services/delete";
import { useDebounceSearch } from "@/hooks/useDebounce";
import { ServicesHeader } from "@/components/services/ServicesHeader";
import { ServicesFilters } from "@/components/services/ServicesFilters";
import { ServicesCardsGrid } from "@/components/services/ServicesCardsGrid";
import { ServicesTable } from "@/components/services/ServicesTable";
import { Pagination } from "@/types";
import { Card } from "@/components/ui/card";

type Props = {
  services: ServiceType[];
  pagination?: Pagination;
  initialSearchParams?: {
    page: number;
    limit: number;
    q: string;
    status: string;
  };
  user: User;
};

export default function PageClient({
  services,
  pagination,
  initialSearchParams,
  user,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { searchTerm, setSearchTerm } = useDebounceSearch(
    initialSearchParams?.q || "",
    {
      delay: 500,
      minLength: 0,
      skipInitialSearch: true,
      onSearch: (value) => {
        updateFilters({ search: value });
      },
    }
  );
  const [statusFilter, setStatusFilter] = useState(
    initialSearchParams?.status || "all"
  );
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");

  // Estados para los diálogos del formulario
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(
    null
  );

  // Lógica de rol: restringir creación a profesional/secretaria
  const roleName =
    (user?.role?.name && String(user.role.name).toLowerCase()) || "";
  const restrictedCreate =
    roleName === "profesional" || roleName === "secretaria";

  // Función para actualizar filtros en la URL
  const updateFilters = (newFilters: { search?: string; status?: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (newFilters.search !== undefined) {
      if (newFilters.search.trim()) {
        params.set("q", newFilters.search);
      } else {
        params.delete("q");
      }
    }
    if (newFilters.status !== undefined) {
      if (newFilters.status !== "all") {
        params.set("status", newFilters.status);
      } else {
        params.delete("status");
      }
    }
    router.push(`?${params.toString()}`);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    updateFilters({ status: value });
  };

  const handleDelete = (id: string) => {
    deleteService({ id });
    router.refresh();
  };

  const handleToggleStatus = (s: ServiceType) => {
    // Aquí implementarías la lógica para cambiar estado
  };

  const handleCreateSuccess = () => {
    router.refresh();
  };

  const handleEditSuccess = () => {
    router.refresh();
  };

  const openEdit = (service: ServiceType) => {
    setSelectedService(service);
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setSelectedService(null);
    setIsEditDialogOpen(false);
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        title="Servicios"
        showBackButton
        backButtonHref="/dashboard"
        backButtonText="Dashboard"
      />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card className="p-4">
          {/* Si restrictedCreate es true, no se pasa onNewService */}
          <ServicesHeader
            onNewService={
              !restrictedCreate ? () => setIsCreateDialogOpen(true) : undefined
            }
          />
          <div>
            <ServicesFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              handleStatusFilter={handleStatusFilter}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
            <p className="text-sm text-muted-foreground mb-2">
              Total de servicios: {pagination?.totalItems || 0}
            </p>
          </div>
        </Card>
        <Card className="mt-8 p-4">
          {services.length === 0 ? (
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
              <div className="text-muted-foreground">
                No se encontraron servicios
              </div>
            </div>
          ) : viewMode === "cards" ? (
            <>
              <ServicesCardsGrid
                services={services}
                onEdit={openEdit}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
                user={user}
              />
              {pagination && (
                <ServicePagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  hasNextPage={pagination.hasNextPage}
                  hasPreviousPage={pagination.hasPreviousPage}
                  totalItems={pagination.totalItems}
                  itemsPerPage={pagination.itemsPerPage}
                />
              )}
            </>
          ) : (
            <>
              <ServicesTable
                services={services}
                onEdit={openEdit}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
                user={user}
              />
              {pagination && (
                <ServicePagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  hasNextPage={pagination.hasNextPage}
                  hasPreviousPage={pagination.hasPreviousPage}
                  totalItems={pagination.totalItems}
                  itemsPerPage={pagination.itemsPerPage}
                />
              )}
            </>
          )}

          {/* Diálogos del formulario */}
          <ServiceForm
            isOpen={isCreateDialogOpen}
            onClose={() => setIsCreateDialogOpen(false)}
            onSuccess={handleCreateSuccess}
            user={user}
          />
          <ServiceForm
            isOpen={isEditDialogOpen}
            onClose={closeEditDialog}
            service={selectedService}
            onSuccess={handleEditSuccess}
            user={user}
          />
        </Card>
      </div>
    </div>
  );
}
