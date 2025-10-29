"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Client } from "@/types";
import { JSX } from "react";

interface ClientDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
  getInitials: (name: string) => string;
  renderStars: (rating: number) => JSX.Element[];
  formatDate: (date: string) => string;
}

export function ClientDetailsDialog({
  open,
  onOpenChange,
  client,
  getInitials,
  renderStars,
  formatDate,
}: ClientDetailsDialogProps) {
  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalles del paciente</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={client.avatar} alt={client.fullName} />
              <AvatarFallback>{getInitials(client.fullName)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{client.fullName}</h2>
              <p className="text-muted-foreground">{client.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Teléfono</label>
                <p className="mt-1">{client.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <p className="mt-1">{client.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Valoración</label>
                <div className="flex items-center space-x-1 mt-1">
                  {renderStars(parseFloat(client.rating) || 0)}
                  <span className="text-sm ml-1">({client.rating || "0"})</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Fecha de Registro</label>
                <p className="mt-1">{formatDate(client.createdAt)}</p>
                <div>
                  <label className="text-sm font-medium">Compañía</label>
                  <p className="mt-1">{client.company?.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
