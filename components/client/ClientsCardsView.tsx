"use client";

import { ClientCard } from "./ClientCard";
import { ClientPagination } from "@/components/ui/client-pagination";
import type { Client, Pagination } from "@/types";
import { JSX } from "react";

interface ClientsCardsViewProps {
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

export function ClientsCardsView({
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
}: ClientsCardsViewProps) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <ClientCard
            key={client.id}
            client={client}
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
        ))}
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
    </>
  );
}
