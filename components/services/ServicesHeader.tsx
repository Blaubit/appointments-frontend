import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function ServicesHeader({ onNewService }: { onNewService: () => void }) {
  return (
    <CardHeader>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div>
          <CardTitle>Gestión de Servicios</CardTitle>
          <CardDescription>Administra todos tus servicios</CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={onNewService}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
          >
            <Plus className="h-4 w-4 mr-2" /> Nuevo Servicio
          </Button>
        </div>
      </div>
    </CardHeader>
  );
}
