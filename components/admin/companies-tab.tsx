"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
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
import { ViewDialog } from "./viewSubscriptionDialog";
import formatCurrency from "@/utils/functions/formatCurrency";

interface CompaniesTabProps {
  subscriptions: Subscription[];
  onOpenPaymentModal?: (subscription: Subscription) => void;
  pagination?: any;
  onPageChange?: (page: number, filters?: any) => void;
  isLoading?: boolean;
}

export function CompaniesTab({
  subscriptions,
  onOpenPaymentModal,
  pagination,
  onPageChange,
  isLoading = false,
}: CompaniesTabProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    () => searchParams.get("q") ?? ""
  );
  const [statusFilter, setStatusFilter] = useState<string>(
    () => searchParams.get("status") ?? "all"
  );
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [selectedViewRow, setSelectedViewRow] = useState<string | null>(null);

  useEffect(() => {
    setSearchTerm(searchParams.get("q") ?? "");
    setStatusFilter(searchParams.get("status") ?? "all");
  }, [searchParams?.toString()]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchTerm && searchTerm.trim().length > 0)
        params.set("q", searchTerm.trim());
      else params.delete("q");
      if (statusFilter && statusFilter !== "all")
        params.set("status", statusFilter);
      else params.delete("status");
      if (planFilter && planFilter !== "all") params.set("plan", planFilter);
      else params.delete("plan");

      params.set("page", "1");
      params.set("limit", String(pagination?.itemsPerPage ?? 10));

      router.push(`${pathname}?${params.toString()}`);
    }, 500);

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter, planFilter]);

  const handlePrev = () => {
    if (!pagination) return;
    const prev =
      pagination.previousPage ??
      (pagination.currentPage > 1 ? pagination.currentPage - 1 : null);
    if (!prev) return;

    if (onPageChange) {
      onPageChange(prev, {
        q: searchParams.get("q") ?? undefined,
        status: searchParams.get("status") ?? undefined,
        limit: pagination.itemsPerPage,
      });
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(prev));
    params.set("limit", String(pagination?.itemsPerPage ?? 10));
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleNext = () => {
    if (!pagination) return;
    const next =
      pagination.nextPage ??
      (pagination.currentPage < pagination.totalPages
        ? pagination.currentPage + 1
        : null);
    if (!next) return;

    if (onPageChange) {
      onPageChange(next, {
        q: searchParams.get("q") ?? undefined,
        status: searchParams.get("status") ?? undefined,
        limit: pagination.itemsPerPage,
      });
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(next));
    params.set("limit", String(pagination?.itemsPerPage ?? 10));
    router.push(`${pathname}?${params.toString()}`);
  };

  const selectedViewSubscription =
    subscriptions.find((s) => s.id === selectedViewRow) ?? null;

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
                {Array.from(new Set(subscriptions.map((s) => s.plan.id)))
                  .map(
                    (planId) =>
                      subscriptions.find((s) => s.plan.id === planId)?.plan
                  )
                  .filter(Boolean)
                  .map((plan) => (
                    <SelectItem key={plan!.id} value={plan!.id}>
                      {plan!.name}
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
              {subscriptions.map((subscription) => {
                const daysUntilDue = Math.ceil(
                  (new Date(subscription.endDate).getTime() - Date.now()) /
                    (1000 * 60 * 60 * 24)
                );
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
                            {String(subscription.company.phones?.[0]) || "N/A"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge>{subscription.plan.name}</Badge>
                        <p className="text-xs text-muted-foreground">
                          {subscription.plan.billingCycle} días
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge>{subscription.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="text-foreground">
                          {new Date(subscription.endDate).toLocaleDateString(
                            "es-GT"
                          )}
                        </p>
                        <p
                          className={`text-xs ${daysUntilDue < 0 ? "text-red-600" : daysUntilDue <= 7 ? "text-yellow-600" : "text-muted-foreground"}`}
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
                        <p className="text-xs text-muted-foreground">máximos</p>
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
                        <Button
                          size="sm"
                          onClick={() => {
                            if (onOpenPaymentModal) {
                              onOpenPaymentModal(subscription);
                            }
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CreditCard className="h-4 w-4" />
                        </Button>
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

        {pagination && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Página {pagination.currentPage} de {pagination.totalPages} —{" "}
              {pagination.totalItems} resultados
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                disabled={
                  isLoading ||
                  (!pagination.hasPreviousPage &&
                    !pagination.previousPage &&
                    pagination.currentPage <= 1)
                }
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={
                  isLoading ||
                  (!pagination.hasNextPage &&
                    !pagination.nextPage &&
                    pagination.currentPage >= pagination.totalPages)
                }
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}

        <ViewDialog
          open={!!selectedViewRow}
          onClose={() => setSelectedViewRow(null)}
          subscription={selectedViewSubscription}
        />
      </CardContent>
    </Card>
  );
}
