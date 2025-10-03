"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { ClientsCardsView } from "./ClientsCardsView";
import { ClientsTableView } from "./ClientsTableView";
import type { Client, Pagination } from "@/types";
import { JSX } from "react";

interface ClientsListCardProps {
  clients: Client[];
  pagination?: Pagination;
  viewMode: "table" | "cards";
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

export function ClientsListCard({
  clients,
  pagination,
  viewMode,
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
}: ClientsListCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Lista de Clientes ({pagination?.totalItems || 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {clients.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay clientes</h3>
            <p className="text-muted-foreground mb-4">
              No se encontraron clientes que coincidan con la búsqueda.
            </p>
          </div>
        ) : viewMode === "cards" ? (
          <ClientsCardsView
            clients={clients}
            pagination={pagination}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            onCall={onCall}
            onEmail={onEmail}
            onWhatsApp={onWhatsApp}
            onSchedule={onSchedule}
            getInitials={getInitials}
            renderStars={renderStars}
            formatDate={formatDate}
          />
        ) : (
          <ClientsTableView
            clients={clients}
            pagination={pagination}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            onCall={onCall}
            onEmail={onEmail}
            onSchedule={onSchedule}
            getInitials={getInitials}
            renderStars={renderStars}
            formatDate={formatDate}
          />
        )}
      </CardContent>
    </Card>
  );
}
