import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Trash2, Users2, MoreHorizontal } from "lucide-react";
import type { Service as ServiceType } from "@/types";
import * as React from "react";
import { ProfessionalsDialog } from "@/components/services/ProfessionalsByServiceDialog";

export function ServiceCardActions({
  service,
  onEdit,
  onDelete,
}: {
  service: ServiceType;
  onEdit: (s: ServiceType) => void;
  onToggleStatus: (s: ServiceType) => void;
  onDelete: (id: string) => void;
}) {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  return (
    <>
      <ProfessionalsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        serviceId={service.id}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setDialogOpen(true)}>
            <Users2 className="h-4 w-4 mr-2" /> Ver profesionales
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(service)}>
            <Edit className="h-4 w-4 mr-2" /> Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete(service.id)}
            className="text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" /> Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
