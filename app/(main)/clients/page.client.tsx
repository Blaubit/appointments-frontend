"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ClientForm } from "@/components/client-form";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { create } from "@/actions/clients/create";
import deleteClient from "@/actions/clients/delete";
import edit from "@/actions/clients/edit";
import { exportClients } from "@/actions/clients/export";
import { Star } from "lucide-react";
import type {
  Client,
  ClientStats,
  Pagination,
  ClientFormData,
  pacienteditFormData,
} from "@/types";
import { openWhatsApp } from "@/utils/functions/openWhatsapp";
import { useDebounceSearch } from "@/hooks/useDebounce";
import { downloadBase64File } from "@/utils/functions/downloadUtils";
import { ClientsHeader } from "@/components/client/ClientsHeader";
import { ClientsStatsCards } from "@/components/client/ClientsStatsCards";
import { ClientsFiltersCard } from "@/components/client/ClientsFiltersCard";
import { ClientsListCard } from "@/components/client/ClientsListCard";
import { ClientDetailsDialog } from "@/components/client/ClientsDetailsDialog";
import { EmptyClientsState } from "@/components/client/EmptyClientsState";

// Tipos para export
type ExportErrorResponse = {
  message: string;
  code?: string;
  status: number;
};

interface ClientsPageClientProps {
  clients?: Client[];
  stats?: ClientStats;
  pagination?: Pagination;
  initialSearchParams?: {
    page: number;
    limit: number;
    search: string;
  };
}

const defaultStats: ClientStats = {
  totalClients: 0,
  activeClients: 0,
  newClientsLastDays: 0,
  averageRating: 0,
};

export default function ClientsPageClient({
  clients = [],
  stats = defaultStats,
  pagination,
  initialSearchParams,
}: ClientsPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
  const [exportLoading, setExportLoading] = useState<string | null>(null);

  const { searchTerm, setSearchTerm } = useDebounceSearch(
    initialSearchParams?.search || "",
    {
      delay: 500,
      minLength: 2,
      skipInitialSearch: true,
      onSearch: (value) => {
        updateFilters({ search: value, page: 1 });
      },
    }
  );

  const [editingClient, setEditingClient] = useState<Client | null>(null);
  // key para forzar remonte del ClientForm cuando se abre la edición
  const [editingFormKey, setEditingFormKey] = useState<number>(0);

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Estados para los diálogos de confirmación
  const [confirmationDialogs, setConfirmationDialogs] = useState({
    deleteClient: {
      open: false,
      client: null as Client | null,
    },
    editClient: {
      open: false,
      data: null as (ClientFormData & { countryCode?: string }) | null,
    },
    success: {
      open: false,
      message: "",
      title: "",
    },
  });

  // FUNCIONES DE EXPORT
  const handleExportPDF = async () => {
    setExportLoading("pdf");
    try {
      const result = await exportClients({
        format: "pdf",
        includeStatistics: true,
      });

      if ("data" in result && result.status === 200) {
        const pdfFile = result.data.files?.pdf;
        if (pdfFile) {
          downloadBase64File(pdfFile.data, pdfFile.filename, pdfFile.mimeType);
          showSuccessDialog(
            "¡PDF generado exitosamente!",
            `El archivo ${pdfFile.filename} ha sido descargado.`
          );
        } else {
          throw new Error("No se pudo generar el archivo PDF");
        }
      } else {
        const errorResult = result as ExportErrorResponse;
        throw new Error(errorResult.message || "Error al generar PDF");
      }
    } catch (error) {
      console.error("Error exporting PDF:", error);
      showSuccessDialog(
        "Error al exportar",
        `Hubo un problema al generar el archivo PDF: ${error instanceof Error ? error.message : "Error desconocido"}`
      );
    } finally {
      setExportLoading(null);
    }
  };

  const handleExportExcel = async () => {
    setExportLoading("excel");
    try {
      const result = await exportClients({
        format: "excel",
        includeStatistics: true,
      });

      if ("data" in result && result.status === 200) {
        const excelFile = result.data.files?.excel;
        if (excelFile) {
          downloadBase64File(
            excelFile.data,
            excelFile.filename,
            excelFile.mimeType
          );
          showSuccessDialog(
            "¡Excel generado exitosamente!",
            `El archivo ${excelFile.filename} ha sido descargado.`
          );
        } else {
          throw new Error("No se pudo generar el archivo Excel");
        }
      } else {
        const errorResult = result as ExportErrorResponse;
        throw new Error(errorResult.message || "Error al generar Excel");
      }
    } catch (error) {
      console.error("Error exporting Excel:", error);
      showSuccessDialog(
        "Error al exportar",
        `Hubo un problema al generar el archivo Excel: ${error instanceof Error ? error.message : "Error desconocido"}`
      );
    } finally {
      setExportLoading(null);
    }
  };

  const handleExportBoth = async () => {
    setExportLoading("both");
    try {
      const result = await exportClients({
        format: "both",
        includeStatistics: true,
      });

      if ("data" in result && result.status === 200) {
        const files = result.data.files;
        if (files?.pdf && files?.excel) {
          downloadBase64File(
            files.pdf.data,
            files.pdf.filename,
            files.pdf.mimeType
          );
          setTimeout(() => {
            downloadBase64File(
              files.excel!.data,
              files.excel!.filename,
              files.excel!.mimeType
            );
          }, 500);

          showSuccessDialog(
            "¡Archivos generados exitosamente!",
            "Se han descargado los archivos PDF y Excel."
          );
        } else {
          throw new Error("No se pudieron generar los archivos");
        }
      } else {
        const errorResult = result as ExportErrorResponse;
        throw new Error(errorResult.message || "Error al generar archivos");
      }
    } catch (error) {
      console.error("Error exporting both:", error);
      showSuccessDialog(
        "Error al exportar",
        `Hubo un problema al generar los archivos: ${error instanceof Error ? error.message : "Error desconocido"}`
      );
    } finally {
      setExportLoading(null);
    }
  };

  // Auto-cerrar diálogo de éxito después de 3000ms
  useEffect(() => {
    if (confirmationDialogs.success.open) {
      const timer = setTimeout(() => {
        closeDialog("success");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [confirmationDialogs.success.open]);

  // Función para actualizar filtros en la URL (búsqueda y paginación)
  const updateFilters = (newFilters: { search?: string; page?: number }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newFilters.search !== undefined) {
      if (newFilters.search.trim() && newFilters.search.length >= 2) {
        params.set("search", newFilters.search);
      } else {
        params.delete("search");
      }
      params.set("page", "1");
    }

    if (newFilters.page !== undefined) {
      params.set("page", String(newFilters.page));
    }

    router.push(`?${params.toString()}`);
  };

  const hasClients = clients && clients.length > 0;

  // Función para mostrar diálogo de éxito (auto-cierre)
  const showSuccessDialog = (title: string, message: string) => {
    setConfirmationDialogs((prev) => ({
      ...prev,
      success: {
        open: true,
        title,
        message,
      },
    }));
  };

  // Función para cerrar diálogos
  const closeDialog = (dialogType: keyof typeof confirmationDialogs) => {
    setConfirmationDialogs((prev) => ({
      ...prev,
      [dialogType]: {
        ...prev[dialogType],
        open: false,
      },
    }));
  };

  // Handler para crear paciente (SIN CONFIRMACIÓN)
  const handleCreateClient = async (data: ClientFormData) => {
    try {
      const response = await create(data);
      if (response.status === 201) {
        router.refresh();
        showSuccessDialog(
          "¡paciente creado exitosamente!",
          `El paciente ${data.fullName} ha sido registrado correctamente en el sistema.`
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Handler para preparar edición de paciente: ahora forzamos remonte del ClientForm
  const handleOpenEditClient = (client: Client) => {
    setEditingClient(client);
    // Incrementamos la key para forzar remonte del form y que vuelva a su estado inicial (abierto)
    setEditingFormKey((k) => k + 1);
  };

  // Handler para preparar edición de paciente (guardar cambios desde el formulario)
  const handleEditClient = (data: ClientFormData) => {
    setConfirmationDialogs((prev) => ({
      ...prev,
      editClient: {
        open: true,
        data,
      },
    }));
  };

  // Handler para confirmar edición de paciente
  const confirmEditClient = async () => {
    const { data } = confirmationDialogs.editClient;
    if (!data || !editingClient) return;

    const editData: pacienteditFormData = {
      id: editingClient.id,
      fullName: data.fullName,
      email: data.email || "",
      phone: data.phone || "",
    };

    try {
      const response = await edit(editData);
      if (response.status === 200) {
        router.refresh();
        setEditingClient(null);
        showSuccessDialog(
          "¡paciente editado exitosamente!",
          `Los datos de ${data.fullName} han sido actualizados correctamente.`
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Handler para preparar eliminación de paciente
  const handleDeleteClient = (client: Client) => {
    setConfirmationDialogs((prev) => ({
      ...prev,
      deleteClient: {
        open: true,
        client,
      },
    }));
  };

  // Handler para confirmar eliminación de paciente
  const confirmDeleteClient = async () => {
    const { client } = confirmationDialogs.deleteClient;
    if (!client) return;

    try {
      const response = await deleteClient({ id: client.id });
      if (response.status === 200) {
        router.refresh();
        showSuccessDialog(
          "¡paciente eliminado exitosamente!",
          `El paciente ${client.fullName} ha sido eliminado del sistema.`
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setShowDetailsDialog(true);
  };

  const handleCallClient = (client: Client) => {
    window.open(`tel:${client.phone}`, "_self");
  };

  const handleEmailClient = (client: Client) => {
    window.open(`clients/${client.id}/history`);
  };

  const handleScheduleAppointment = (client: Client) => {
    window.open(`appointments/new?clientId=${client.id}`, "_self");
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const renderStars = (rating: number) =>
    [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // Estado vacío cuando no hay pacientes del servidor
  if (!hasClients) {
    return (
      <EmptyClientsState
        onCreateClient={handleCreateClient}
        confirmationDialogs={confirmationDialogs}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <ClientsHeader
        onCreateClient={handleCreateClient}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Stats Cards */}
      <ClientsStatsCards stats={stats} />

      {/* Filtros y Export */}
      <ClientsFiltersCard
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        exportLoading={exportLoading}
        onExportPDF={handleExportPDF}
        onExportExcel={handleExportExcel}
        onExportBoth={handleExportBoth}
      />

      {/* Lista de pacientes */}
      <ClientsListCard
        clients={clients}
        pagination={pagination}
        viewMode={viewMode}
        onView={handleViewClient}
        // Usamos handleOpenEditClient en lugar de setEditingClient directo
        onEdit={handleOpenEditClient}
        onDelete={handleDeleteClient}
        onCall={handleCallClient}
        onEmail={handleEmailClient}
        onWhatsApp={openWhatsApp}
        onSchedule={handleScheduleAppointment}
        getInitials={getInitials}
        renderStars={renderStars}
        formatDate={formatDate}
      />

      {/* Dialogs */}
      {editingClient && (
        // forzamos remonte con key para que el ClientForm vuelva a su estado inicial cada vez
        <ClientForm
          key={editingFormKey}
          trigger={<button>Editar</button>}
          client={editingClient}
          onSubmit={handleEditClient}
        />
      )}

      {/* Diálogos de Confirmación */}
      <ConfirmationDialog
        open={confirmationDialogs.editClient.open}
        onOpenChange={(open) => !open && closeDialog("editClient")}
        variant="edit"
        type="confirmation"
        title="Guardar cambios del paciente"
        description="¿Deseas guardar los cambios realizados en la información del paciente?"
        confirmText="Guardar cambios"
        onConfirm={confirmEditClient}
      />

      <ConfirmationDialog
        open={confirmationDialogs.deleteClient.open}
        onOpenChange={(open) => !open && closeDialog("deleteClient")}
        variant="delete"
        type="confirmation"
        title="Eliminar paciente"
        description={`Esta acción no se puede deshacer. El paciente ${confirmationDialogs.deleteClient.client?.fullName || ""} será eliminado permanentemente del sistema junto con todo su historial.`}
        confirmText="Sí, eliminar"
        cancelText="No, mantener"
        onConfirm={confirmDeleteClient}
      />

      <ConfirmationDialog
        open={confirmationDialogs.success.open}
        onOpenChange={() => {}}
        variant="success"
        type="notification"
        title={confirmationDialogs.success.title}
        description={confirmationDialogs.success.message}
        showCancel={false}
      />
    </div>
  );
}
