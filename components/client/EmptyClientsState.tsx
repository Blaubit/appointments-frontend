"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus } from "lucide-react";
import { ClientForm } from "@/components/client-form";
import { ClientsStatsCards } from "./ClientsStatsCards";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import type { ClientFormData, ClientStats } from "@/types";

interface EmptyClientsStateProps {
  onCreateClient: (data: ClientFormData) => Promise<void>;
  confirmationDialogs: {
    success: {
      open: boolean;
      message: string;
      title: string;
    };
  };
}

const defaultStats: ClientStats = {
  totalClients: 0,
  activeClients: 0,
  newClientsLastDays: 0,
  averageRating: 0,
};

export function EmptyClientsState({
  onCreateClient,
  confirmationDialogs,
}: EmptyClientsStateProps) {
  return (
    <div className="space-y-6">
      {/* Header con botón para crear paciente */}
      <div className="flex flex-wrap sm:flex-row justify-between items-start sm:items-center gap-4">
        <ClientForm
          trigger={
            <Button className="btn-gradient-primary text-white">
              <UserPlus className="h-4 w-4 mr-2" />
              Nuevo paciente
            </Button>
          }
          onSubmit={onCreateClient}
        />
      </div>

      {/* Stats Cards - Todos en 0 */}
      <ClientsStatsCards stats={defaultStats} />

      {/* Estado vacío principal */}
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted p-4 mb-6">
            <Users className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">
            ¡Bienvenido a tu lista de pacientes!
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Aún no tienes pacientes registrados. Comienza agregando tu primer
            paciente para gestionar tus citas y relaciones comerciales.
          </p>
          <ClientForm
            trigger={
              <Button size="lg" className="btn-gradient-primary text-white">
                <UserPlus className="h-5 w-5 mr-2" />
                Agregar Primer paciente
              </Button>
            }
            onSubmit={onCreateClient}
          />
        </CardContent>
      </Card>

      {/* Dialog de notificación de éxito (auto-cierre) */}
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
