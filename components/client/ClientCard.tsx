"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  Calendar,
  MoreHorizontal,
  History,
  FileText,
} from "lucide-react";
import WhatsappIcon from "@/components/icons/whatsapp-icon";
import { ClinicalHistoryDialog } from "@/components/client/clinical-history/ClinicalHistoryDialog";
import type { Client } from "@/types";
import { JSX } from "react";

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

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={client.avatar} alt={client.fullName} />
                <AvatarFallback>{getInitials(client.fullName)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{client.fullName}</h3>
                <p className="text-sm text-muted-foreground">{client.email}</p>
              </div>
            </div>
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
                  <History className="h-4 w-4 mr-2" />
                  Ver historial
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setIsClinicalHistoryOpen(true)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Historial Clínico
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onWhatsApp(client.phone, "Buen dia")}
                >
                  <WhatsappIcon
                    className="text-green-500 dark:bg-gray-900"
                    width={16}
                    height={16}
                  />
                  WhatsApp
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

      {/* Dialog de Historial Clínico */}
      <ClinicalHistoryDialog
        open={isClinicalHistoryOpen}
        onOpenChange={setIsClinicalHistoryOpen}
        client={client}
      />
    </>
  );
}
