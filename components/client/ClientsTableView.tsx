"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  Calendar,
  MoreHorizontal,
} from "lucide-react";
import { ClientPagination } from "@/components/ui/client-pagination";
import type { Client, Pagination } from "@/types";
import { JSX } from "react";

interface ClientsTableViewProps {
  clients: Client[];
  pagination?: Pagination;
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
  onCall: (client: Client) => void;
  onEmail: (client: Client) => void;
  onSchedule: (client: Client) => void;
  getInitials: (name: string) => string;
  renderStars: (rating: number) => JSX.Element[];
  formatDate: (date: string) => string;
}

export function ClientsTableView({
  clients,
  pagination,
  onView,
  onEdit,
  onDelete,
  onCall,
  onEmail,
  onSchedule,
  getInitials,
  renderStars,
  formatDate,
}: ClientsTableViewProps) {
  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Valoración</TableHead>
              <TableHead>Fecha Registro</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id} className="hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={client.avatar || "/placeholder.svg"}
                        alt={client.fullName}
                      />
                      <AvatarFallback className="text-xs">
                        {getInitials(client.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{client.fullName}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm">{client.email}</div>
                    <div className="text-sm text-muted-foreground">
                      {client.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    {renderStars(parseFloat(client.rating) || 0)}
                    <span className="text-sm ml-1">
                      ({client.rating || "0"})
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{formatDate(client.createdAt)}</div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(client)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(client)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onCall(client)}>
                        <Phone className="h-4 w-4 mr-2" />
                        Llamar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEmail(client)}>
                        <Mail className="h-4 w-4 mr-2" />
                        Enviar Email
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onSchedule(client)}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Programar Cita
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(client)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
