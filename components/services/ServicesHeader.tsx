import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import * as React from "react";

type Props = {
  onNewService?: () => void;
  canCreate?: boolean; // si se pasa false, ocultamos el botón aunque onNewService exista
};

export function ServicesHeader({ onNewService, canCreate = true }: Props) {
  const showButton = canCreate && typeof onNewService === "function";

  return (
    <CardHeader>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div>
          <CardTitle>Gestión de Servicios</CardTitle>
          <CardDescription>Administra todos tus servicios</CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {showButton ? (
            <Button
              onClick={onNewService}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            >
              <Plus className="h-4 w-4 mr-2" /> Nuevo Servicio
            </Button>
          ) : null}
        </div>
      </div>
    </CardHeader>
  );
}

export default ServicesHeader;
