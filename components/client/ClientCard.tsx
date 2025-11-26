"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Client } from "@/types";
import { JSX } from "react";
import type { KeyboardEvent } from "react";
import { ClinicalHistoryDialog } from "@/components/client/clinical-history/ClinicalHistoryDialog";

interface ClientCardProps {
  client: Client;
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

export function ClientCard({
  client,
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
}: ClientCardProps) {
  const [isClinicalHistoryOpen, setIsClinicalHistoryOpen] = useState(false);

  const openClinicalHistory = () => setIsClinicalHistoryOpen(true);
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openClinicalHistory();
    }
  };

  return (
    <>
      {/* Hacemos toda la tarjeta "clickable" y accesible por teclado */}
      <Card
        className="hover:shadow-lg transition-shadow overflow-visible cursor-pointer"
        role="button"
        tabIndex={0}
        onClick={openClinicalHistory}
        onKeyDown={handleKeyDown}
        aria-label={`Abrir historial clínico de ${client.fullName}`}
      >
        <CardContent className="p-6">
          <div className="mb-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={client.avatar} alt={client.fullName} />
                <AvatarFallback>{getInitials(client.fullName)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold">{client.fullName}</h3>
                <p className="text-sm text-muted-foreground">{client.email}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Teléfono:</span>
              <span className="text-sm font-medium">{client.phone}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Valoración:</span>
              <div className="flex items-center space-x-1">
                {renderStars(parseFloat(client.rating) || 0)}
                <span className="text-sm ml-1">({client.rating || "0"})</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Registro:</span>
              <span className="text-sm font-medium">
                {formatDate(client.createdAt)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Historial Clínico: pasamos handlers para que el diálogo ejecute las acciones */}
      <ClinicalHistoryDialog
        open={isClinicalHistoryOpen}
        onOpenChange={setIsClinicalHistoryOpen}
        client={client}
        onEdit={onEdit}
        onDelete={onDelete}
        onCall={onCall}
        onEmail={onEmail}
        onSchedule={onSchedule}
        onWhatsApp={onWhatsApp}
      />
    </>
  );
}
