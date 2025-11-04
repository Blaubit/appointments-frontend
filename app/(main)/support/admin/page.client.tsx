"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUp,
  Minus,
  User,
  Calendar,
  Eye,
  Mail,
} from "lucide-react";

// Tipos para la data real de incident reports
type Ticket = {
  id: string;
  subject: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  sourceSystem: string;
  externalId: string;
  status: "open" | "in_progress" | "waiting_response" | "resolved" | "closed";
  createdAt: string;
  updatedAt: string;
};

const statusConfig = {
  open: {
    label: "Abierto",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    icon: AlertCircle,
  },
  in_progress: {
    label: "En Progreso",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    icon: Clock,
  },
  waiting_response: {
    label: "Esperando Respuesta",
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    icon: MessageSquare,
  },
  resolved: {
    label: "Resuelto",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    icon: CheckCircle,
  },
  closed: {
    label: "Cerrado",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    icon: XCircle,
  },
};

const priorityConfig = {
  low: {
    label: "Baja",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    icon: Minus,
  },
  medium: {
    label: "Media",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    icon: Minus,
  },
  high: {
    label: "Alta",
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    icon: ArrowUp,
  },
  urgent: {
    label: "Urgente",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    icon: ArrowUp,
  },
};

interface AdminSupportPageProps {
  tickets: Ticket[];
  count: number;
}

export default function AdminSupportPage({
  tickets,
  count,
}: AdminSupportPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Ticket["status"] | "all">(
    "all"
  );
  const [priorityFilter, setPriorityFilter] = useState<
    Ticket["priority"] | "all"
  >("all");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        searchTerm === "" ||
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || ticket.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || ticket.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, searchTerm, statusFilter, priorityFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-GT", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Panel de Administración - Tickets
          </h1>
          <p className="text-muted-foreground">
            Gestiona todos los tickets de soporte de tus pacientes
          </p>
        </div>

        <Tabs defaultValue="tickets" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger
              value="tickets"
              className="data-[state=active]:bg-background"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Tickets ({count})
            </TabsTrigger>
          </TabsList>

          {/* Tickets Tab */}
          <TabsContent value="tickets" className="space-y-6">
            {/* Filters */}
            <Card className="border-border">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar tickets, paciente, email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-background border-border"
                    />
                  </div>

                  <Select
                    value={statusFilter}
                    onValueChange={(value) =>
                      setStatusFilter(value as Ticket["status"] | "all")
                    }
                  >
                    <SelectTrigger className="w-[140px] bg-background border-border">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="open">Abierto</SelectItem>
                      <SelectItem value="in_progress">En Progreso</SelectItem>
                      <SelectItem value="waiting_response">
                        Esperando
                      </SelectItem>
                      <SelectItem value="resolved">Resuelto</SelectItem>
                      <SelectItem value="closed">Cerrado</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={priorityFilter}
                    onValueChange={(value) =>
                      setPriorityFilter(value as Ticket["priority"] | "all")
                    }
                  >
                    <SelectTrigger className="w-[140px] bg-background border-border">
                      <SelectValue placeholder="Prioridad" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="low">Baja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Tickets List */}
            <div className="space-y-4">
              {filteredTickets.length === 0 ? (
                <Card className="border-border">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      No se encontraron tickets
                    </h3>
                    <p className="text-muted-foreground text-center">
                      No hay tickets que coincidan con los filtros
                      seleccionados.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredTickets.map((ticket) => {
                  const StatusIcon = statusConfig[ticket.status].icon;
                  const PriorityIcon = priorityConfig[ticket.priority].icon;

                  return (
                    <Card
                      key={ticket.id}
                      className="border-border hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-foreground text-lg">
                                  {ticket.subject}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  #{ticket.id}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Badge
                                  className={statusConfig[ticket.status].color}
                                >
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {statusConfig[ticket.status].label}
                                </Badge>
                                <Badge
                                  className={
                                    priorityConfig[ticket.priority].color
                                  }
                                >
                                  <PriorityIcon className="h-3 w-3 mr-1" />
                                  {priorityConfig[ticket.priority].label}
                                </Badge>
                              </div>
                            </div>

                            <p className="text-muted-foreground line-clamp-2">
                              {ticket.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {ticket.userName}
                              </div>
                              <div className="flex items-center gap-1">
                                <Mail className="h-4 w-4" />
                                {ticket.userEmail}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(ticket.createdAt)}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedTicket(ticket)}
                                  className="border-border"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Ver Detalles
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-background border-border">
                                <DialogHeader>
                                  <DialogTitle className="text-foreground">
                                    {selectedTicket?.subject} - #
                                    {selectedTicket?.id}
                                  </DialogTitle>
                                </DialogHeader>
                                {selectedTicket && (
                                  <div className="space-y-6">
                                    {/* Ticket Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-foreground">
                                          Usuario
                                        </Label>
                                        <p className="text-muted-foreground">
                                          {selectedTicket.userName}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                          {selectedTicket.userEmail}
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-foreground">
                                          Sistema Origen
                                        </Label>
                                        <p className="text-muted-foreground">
                                          {selectedTicket.sourceSystem}
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-foreground">
                                          Estado Actual
                                        </Label>
                                        <Badge
                                          className={
                                            statusConfig[selectedTicket.status]
                                              .color
                                          }
                                        >
                                          {
                                            statusConfig[selectedTicket.status]
                                              .label
                                          }
                                        </Badge>
                                      </div>
                                      <div>
                                        <Label className="text-foreground">
                                          Prioridad
                                        </Label>
                                        <Badge
                                          className={
                                            priorityConfig[
                                              selectedTicket.priority
                                            ].color
                                          }
                                        >
                                          {
                                            priorityConfig[
                                              selectedTicket.priority
                                            ].label
                                          }
                                        </Badge>
                                      </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                      <Label className="text-foreground">
                                        Descripción
                                      </Label>
                                      <div className="mt-2 p-4 bg-muted rounded-lg">
                                        <p className="text-foreground whitespace-pre-wrap">
                                          {selectedTicket.description}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
