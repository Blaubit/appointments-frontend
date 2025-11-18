import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import type { Service as ServiceType, User } from "@/types";
import { ServiceCardActions } from "./ServiceCardActions";

export function ServicesTable({
  services,
  onEdit,
  onToggleStatus,
  onDelete,
  user,
}: {
  services: ServiceType[];
  onEdit: (s: ServiceType) => void;
  onToggleStatus: (s: ServiceType) => void;
  onDelete: (id: string) => void;
  user?: User;
}) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Duración</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.name}</TableCell>
                <TableCell>{s.durationMinutes} min</TableCell>
                <TableCell>Q{s.price}</TableCell>
                <TableCell className="text-right">
                  <ServiceCardActions
                    service={s}
                    onEdit={onEdit}
                    onToggleStatus={onToggleStatus}
                    onDelete={onDelete}
                    user={user}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
