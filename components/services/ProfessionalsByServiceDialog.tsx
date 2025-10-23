"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { findProfessionalsByService } from "@/actions/user/findProfessionalsByService";
import { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type ProfessionalsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceId: string;
};

export function ProfessionalsDialog({
  open,
  onOpenChange,
  serviceId,
}: ProfessionalsDialogProps) {
  const [loading, setLoading] = React.useState(false);
  const [professionals, setProfessionals] = React.useState<User[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    findProfessionalsByService({ serviceId })
      .then((res) => {
        if ("data" in res) {
          setProfessionals(res.data);
        } else {
          setError(res.message || "Error al cargar profesionales");
        }
      })
      .catch(() => setError("Error inesperado"))
      .finally(() => setLoading(false));
  }, [open, serviceId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Profesionales asignados</DialogTitle>
          <DialogDescription>
            Lista de profesionales que tienen asignado este servicio.
          </DialogDescription>
        </DialogHeader>
        {loading && <div className="py-6">Cargando...</div>}
        {error && <div className="py-6 text-red-600">{error}</div>}
        {!loading && !error && professionals.length === 0 && (
          <div className="py-6 text-gray-500">
            No hay profesionales asignados.
          </div>
        )}
        {!loading && !error && professionals.length > 0 && (
          <ul className="divide-y">
            {professionals.map((user) => (
              <li key={user.id} className="flex items-center gap-3 py-2">
                <Avatar>
                  {user.avatar && <AvatarImage src={user.avatar} />}
                  <AvatarFallback>
                    {user.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">{user.fullName}</div>
                  <div className="text-xs text-muted-foreground">
                    {user.email}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="flex justify-end pt-2">
          <DialogClose asChild>
            <Button variant="outline">Cerrar</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
