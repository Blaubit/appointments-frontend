"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Building2, Search, CreditCard, Eye, Edit } from "lucide-react";
import type { Subscription } from "@/types";
import { PaymentDialog } from "@/components/admin/payment-dialog";
import { ViewDialog } from "./viewSubscriptionDialog";
import { create } from "@/actions/subscription/createPayment";
import { PaymentDto } from "@/types/dto/subscription/payment.dto";
interface CompaniesTabProps {
  subscriptions: Subscription[];
  onOpenPaymentModal: (subscription: Subscription) => void;
}

export function CompaniesTab({ subscriptions }: CompaniesTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [selectedViewRow, setSelectedViewRow] = useState<string | null>(null);
  const [selectedPaymentRow, setSelectedPaymentRow] = useState<string | null>(
    null
  );
  // Handles payment submission
  const handleSubmitPayment = (payment: PaymentDto) => {
    console.log("Enviando pago:", payment);
    create(payment);
    setSelectedPaymentRow(null);
  };
  const selectedViewSubscription =
    subscriptions.find((s) => s.id === selectedViewRow) ?? null;

  const filteredSubscriptions = subscriptions.filter((subscription) => {
    const matchesSearch =
      subscription.company.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      subscription.company.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || subscription.status === statusFilter;
    const matchesPlan =
      planFilter === "all" || subscription.plan.id === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "activo":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "past_due":
      case "vencido":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "canceled":
      case "cancelado":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      case "unpaid":
      case "sin_pagar":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "trialing":
      case "prueba":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "Activo";
      case "past_due":
        return "Vencido";
      case "canceled":
        return "Cancelado";
      case "unpaid":
        return "Sin Pagar";
      case "trialing":
        return "Prueba";
      default:
        return status;
    }
  };

  const getPlanColor = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "basic":
      case "básico":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "professional":
      case "profesional":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "enterprise":
      case "empresarial":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-GT", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysUntilDue = (endDate: string) => {
    const today = new Date();
    const due = new Date(endDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getBillingCycleLabel = (billingCycle: number) => {
    switch (billingCycle) {
      case 30:
        return "Mensual";
      case 90:
        return "Trimestral";
      case 180:
        return "Semestral";
      case 365:
        return "Anual";
      default:
        return `${billingCycle} días`;
    }
  };

  // Obtener lista única de planes para el filtro
  const uniquePlans = Array.from(
    new Set(subscriptions.map((sub) => sub.plan.id))
  )
    .map((planId) => {
      const plan = subscriptions.find((sub) => sub.plan.id === planId)?.plan;
      return plan;
    })
    .filter(Boolean);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Gestión de Empresas
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar empresas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="past_due">Vencido</SelectItem>
                <SelectItem value="canceled">Cancelado</SelectItem>
                <SelectItem value="unpaid">Sin Pagar</SelectItem>
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los planes</SelectItem>
                {uniquePlans.map((plan) => (
                  <SelectItem key={plan?.id} value={plan?.id || ""}>
                    {plan?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Próximo Pago</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Usuarios</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.map((subscription) => {
                const daysUntilDue = getDaysUntilDue(subscription.endDate);
                return (
                  <TableRow key={subscription.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {subscription.company.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            contactEmail
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge className={getPlanColor(subscription.plan.name)}>
                          {subscription.plan.name}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {getBillingCycleLabel(subscription.plan.billingCycle)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(subscription.status)}>
                        {getStatusLabel(subscription.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="text-foreground">
                          {formatDate(subscription.endDate)}
                        </p>
                        <p
                          className={`text-xs ${
                            daysUntilDue < 0
                              ? "text-red-600"
                              : daysUntilDue <= 7
                                ? "text-yellow-600"
                                : "text-muted-foreground"
                          }`}
                        >
                          {daysUntilDue < 0
                            ? `${Math.abs(daysUntilDue)} días vencido`
                            : daysUntilDue === 0
                              ? "Vence hoy"
                              : `${daysUntilDue} días restantes`}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-foreground">
                        {formatCurrency(subscription.plan.price)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="text-foreground">
                          {subscription.currentUsers} usuarios
                        </p>
                        <p className="text-xs text-muted-foreground">maximos</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => setSelectedViewRow(subscription.id)}
                          variant="outline"
                          size="sm"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {/* Botón de pago siempre visible */}
                        <Button
                          size="sm"
                          onClick={() => setSelectedPaymentRow(subscription.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CreditCard className="h-4 w-4" />
                        </Button>
                        <PaymentDialog
                          open={selectedPaymentRow === subscription.id}
                          onClose={() => setSelectedPaymentRow(null)}
                          onSubmit={handleSubmitPayment}
                          subscriptionId={subscription.id}
                          defaultAmount={subscription.plan.price}
                        />
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <ViewDialog
          open={!!selectedViewRow}
          onClose={() => setSelectedViewRow(null)}
          subscription={selectedViewSubscription}
        />
      </CardContent>
    </Card>
  );
}
