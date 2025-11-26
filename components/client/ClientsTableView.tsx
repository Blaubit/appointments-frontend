"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ClientPagination } from "@/components/ui/client-pagination";
import { ClinicalHistoryDialog } from "@/components/client/clinical-history/ClinicalHistoryDialog";
import type { Client, Pagination } from "@/types";
import { JSX } from "react";
import type { KeyboardEvent } from "react";
import { FileText } from "lucide-react";

interface ClientsTableViewProps {
  clients: Client[];
  pagination?: Pagination;
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
  onCall: (client: Client) => void;
  onEmail: (client: Client) => void;
  onWhatsApp: (phone: string, message: string) => void;
  onSchedule: (client: Client) => void;
  getInitials: (name: string) => string;
  renderStars: (rating: number) => JSX.Element[];
  formatDate: (date: string) => string;
}

export function ClientsTableView({
  clients,
  pagination,
  onView,
  onEdit,
  onDelete,
  onCall,
  onEmail,
  onWhatsApp,
  onSchedule,
  getInitials,
  renderStars,
  formatDate,
}: ClientsTableViewProps) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isClinicalHistoryOpen, setIsClinicalHistoryOpen] = useState(false);

  const openClinicalHistoryFor = (client: Client) => {
    setSelectedClient(client);
    setIsClinicalHistoryOpen(true);
  };

  const rowKeyDownHandler = (
    e: KeyboardEvent<HTMLTableRowElement>,
    client: Client
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openClinicalHistoryFor(client);
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>paciente</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Valoración</TableHead>
              <TableHead>Fecha Registro</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow
                key={client.id}
                className="hover:bg-muted/50 cursor-pointer"
                tabIndex={0}
                role="button"
                onClick={() => openClinicalHistoryFor(client)}
                onKeyDown={(e) => rowKeyDownHandler(e, client)}
                aria-label={`Abrir historial clínico de ${client.fullName}`}
              >
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={client.avatar || "/placeholder.svg"}
                        alt={client.fullName}
                      />
                      <AvatarFallback className="text-xs">
                        {getInitials(client.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{client.fullName}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm">{client.email}</div>
                    <div className="text-sm text-muted-foreground">
                      {client.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    {renderStars(parseFloat(client.rating) || 0)}
                    <span className="text-sm ml-1">
                      ({client.rating || "0"})
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{formatDate(client.createdAt)}</div>
                </TableCell>
                <TableCell className="text-right">
                  {/* Columna de acciones visual; ahora la fila completa abre el diálogo.
                      Mantenemos un ícono pequeño como indicador visual, pero no es
                      necesario que sea interactivo por separado. */}
                  <div className="flex items-center justify-end text-muted-foreground">
                    <FileText className="h-4 w-4" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <ClientPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          hasNextPage={pagination.hasNextPage}
          hasPreviousPage={pagination.hasPreviousPage}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
        />
      )}

      {/* Dialog de Historial Clínico */}
      {selectedClient && (
        <ClinicalHistoryDialog
          open={isClinicalHistoryOpen}
          onOpenChange={setIsClinicalHistoryOpen}
          client={selectedClient}
          onEdit={onEdit}
          onDelete={onDelete}
          onCall={onCall}
          onEmail={onEmail}
          onSchedule={onSchedule}
          onWhatsApp={onWhatsApp}
        />
      )}
    </>
  );
}
