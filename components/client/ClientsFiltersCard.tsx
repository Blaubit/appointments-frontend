"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  FileText,
  FileSpreadsheet,
  Download,
  Loader2,
} from "lucide-react";

interface ClientsFiltersCardProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  exportLoading: string | null;
  onExportPDF: () => void;
  onExportExcel: () => void;
  onExportBoth: () => void;
}

export function ClientsFiltersCard({
  searchTerm,
  onSearchChange,
  exportLoading,
  onExportPDF,
  onExportExcel,
  onExportBoth,
}: ClientsFiltersCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Filtros y Exportación</CardTitle>
      </CardHeader>

      <CardContent>
        {/* Botones de Export */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            onClick={onExportPDF}
            disabled={exportLoading !== null}
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            {exportLoading === "pdf" ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileText className="h-4 w-4 mr-2" />
            )}
            {exportLoading === "pdf" ? "Generando PDF..." : "Exportar PDF"}
          </Button>

          <Button
            onClick={onExportExcel}
            disabled={exportLoading !== null}
            variant="outline"
            className="text-green-600 border-green-200 hover:bg-green-50"
          >
            {exportLoading === "excel" ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileSpreadsheet className="h-4 w-4 mr-2" />
            )}
            {exportLoading === "excel"
              ? "Generando Excel..."
              : "Exportar Excel"}
          </Button>

          <Button
            onClick={onExportBoth}
            disabled={exportLoading !== null}
            className="btn-gradient-primary text-white"
          >
            {exportLoading === "both" ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            {exportLoading === "both" ? "Generando ambos..." : "Exportar Ambos"}
          </Button>
        </div>

        {/* Campo de búsqueda */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
