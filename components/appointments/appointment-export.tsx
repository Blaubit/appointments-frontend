"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { exportAppointments } from "@/actions/appointments/export";
import { toast } from "sonner";

interface AppointmentExportProps {
  className?: string;
}

type ExportFormat = "pdf" | "excel";

export function AppointmentExport({ className = "" }: AppointmentExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("excel");
  const [includeStatistics, setIncludeStatistics] = useState(false);
  const [includePaymentInfo, setIncludePaymentInfo] = useState(false);
  const [includeServices, setIncludeServices] = useState(true);

  const searchParams = useSearchParams();

  const downloadFile = (
    base64Data: string,
    filename: string,
    mimeType: string
  ) => {
    try {
      // Convertir base64 a blob
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });

      // Crear enlace de descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Limpiar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Error al descargar el archivo");
    }
  };

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true);

    try {
      // Obtener filtros activos de los URLSearchParams
      const exportOptions = {
        format,
        includeStatistics,
        includePaymentInfo,
        includeServices,
        // Aplicar filtros activos
        ...(searchParams.get("q") && { search: searchParams.get("q")! }),
        ...(searchParams.get("status") &&
          searchParams.get("status") !== "all" && {
            status: searchParams.get("status")!,
          }),
        ...(searchParams.get("appointmentDate") && {
          startDate: searchParams.get("appointmentDate")!,
          endDate: searchParams.get("appointmentDate")!,
        }),
        ...(searchParams.get("professionalId") && {
          professionalId: searchParams.get("professionalId")!,
        }),
      };

      const result = await exportAppointments(exportOptions);

      if ("data" in result && result.data.success) {
        const { fileData, filename, mimeType } = result.data;

        if (fileData && filename && mimeType) {
          downloadFile(fileData, filename, mimeType);
          toast.success(
            `Archivo ${format.toUpperCase()} descargado exitosamente`
          );
        } else {
          toast.error("Datos del archivo incompletos");
        }
      } else {
        toast.error("Error al exportar");
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Error inesperado al exportar");
    } finally {
      setIsExporting(false);
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchParams.get("q")) count++;
    if (searchParams.get("status") && searchParams.get("status") !== "all")
      count++;
    if (searchParams.get("appointmentDate")) count++;
    if (searchParams.get("professionalId")) count++;
    return count;
  };

  const getFiltersSummary = () => {
    const filters = [];
    const search = searchParams.get("q");
    const status = searchParams.get("status");
    const date = searchParams.get("appointmentDate");
    const professionalId = searchParams.get("professionalId");

    if (search) filters.push(`Búsqueda: "${search}"`);
    if (status && status !== "all") filters.push(`Estado: ${status}`);
    if (date) filters.push(`Fecha: ${date}`);
    if (professionalId) filters.push(`Profesional: ${professionalId}`);

    return filters.join(", ");
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`relative ${className}`}
          disabled={isExporting}
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Exportar
          {activeFiltersCount > 0 && (
            <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Exportar Appointments</DropdownMenuLabel>

        {activeFiltersCount > 0 && (
          <>
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              <strong>Filtros aplicados:</strong>
              <div className="mt-1 text-xs">{getFiltersSummary()}</div>
            </div>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          Formato de exportación
        </DropdownMenuLabel>

        <DropdownMenuItem
          onClick={() => handleExport("excel")}
          disabled={isExporting}
          className="cursor-pointer"
        >
          <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
          Exportar como Excel
          <span className="ml-auto text-xs text-muted-foreground">.xlsx</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleExport("pdf")}
          disabled={isExporting}
          className="cursor-pointer"
        >
          <FileText className="h-4 w-4 mr-2 text-red-600" />
          Exportar como PDF
          <span className="ml-auto text-xs text-muted-foreground">.pdf</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          Opciones adicionales
        </DropdownMenuLabel>

        <DropdownMenuCheckboxItem
          checked={includeServices}
          onCheckedChange={setIncludeServices}
        >
          Incluir información de servicios
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={includePaymentInfo}
          onCheckedChange={setIncludePaymentInfo}
        >
          Incluir información de pagos
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={includeStatistics}
          onCheckedChange={setIncludeStatistics}
        >
          Incluir estadísticas
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
