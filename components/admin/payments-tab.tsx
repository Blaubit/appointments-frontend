"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
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
import {
  CreditCard,
  Search,
  FileText,
  Eye,
  Download,
  Building2,
  Calendar,
  DollarSign,
} from "lucide-react";
import type { Payment } from "@/types";
import { findAllPayments } from "@/actions/payments/findAllPayments";
import { Loader2 } from "lucide-react";
import formatCurrencyUtil from "@/utils/functions/formatCurrency";

interface PaymentsTabProps {
  // initial payments passed from server render while client-side fetch runs
  payments: Payment[];
  initialMeta?: any;
}

export function PaymentsTab({
  payments: initialPayments,
  initialMeta,
}: PaymentsTabProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    () => searchParams.get("q") ?? ""
  );
  const [statusFilter, setStatusFilter] = useState<string>(
    () => searchParams.get("status") ?? "all"
  );
  const [methodFilter, setMethodFilter] = useState<string>(
    () => searchParams.get("method") ?? "all"
  );
  const [dateRange, setDateRange] = useState<string>(
    () => searchParams.get("dateRange") ?? "all"
  );

  const [payments, setPayments] = useState<Payment[]>(initialPayments ?? []);
  const [meta, setMeta] = useState<any>(
    initialMeta ?? {
      currentPage: 1,
      totalPages: 1,
      totalItems: initialPayments?.length ?? 0,
      itemsPerPage: 7,
      hasNextPage: false,
      hasPreviousPage: false,
      nextPage: null,
      previousPage: null,
    }
  );

  const [isLoading, setIsLoading] = useState(false);

  // Control de races
  const latestRequestId = useRef(0);

  // Fetch helper: always pass params as string to server action
  const fetchWithParams = async (params: URLSearchParams | string) => {
    const requestId = ++latestRequestId.current;
    const paramsString =
      typeof params === "string" ? params : params.toString();

    setIsLoading(true);
    try {
      const result = await findAllPayments({ searchParams: paramsString });
      if (requestId !== latestRequestId.current) {
        console.warn(
          "[PaymentsTab] Ignoring stale payments response id:",
          requestId
        );
        return;
      }
      if (result && result.status === 200) {
        setPayments(result.data || []);
        setMeta(result.meta || meta);
      } else {
        console.error("[PaymentsTab] error fetching payments:", result);
        setPayments([]);
      }
    } catch (err) {
      console.error("[PaymentsTab] fetch error:", err);
      setPayments([]);
    } finally {
      if (requestId === latestRequestId.current) setIsLoading(false);
    }
  };

  // Debounce local filter inputs -> update URL
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchTerm && searchTerm.trim().length > 0)
        params.set("q", searchTerm.trim());
      else params.delete("q");

      if (statusFilter && statusFilter !== "all")
        params.set("status", statusFilter);
      else params.delete("status");

      if (methodFilter && methodFilter !== "all")
        params.set("method", methodFilter);
      else params.delete("method");

      if (dateRange && dateRange !== "all") params.set("dateRange", dateRange);
      else params.delete("dateRange");

      // reset to first page when filters change
      params.set("page", "1");
      params.set("limit", String(meta?.itemsPerPage ?? 7));

      router.push(`${pathname}?${params.toString()}`);
    }, 400);

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter, methodFilter, dateRange]);

  // When URL search params change, call server action with the same params
  useEffect(() => {
    const paramsString = searchParams.toString();
    const params = new URLSearchParams(paramsString);

    // ensure page/limit defaults
    if (!params.get("page")) params.set("page", String(meta?.currentPage ?? 1));
    if (!params.get("limit"))
      params.set("limit", String(meta?.itemsPerPage ?? 7));

    fetchWithParams(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams?.toString()]);

  // Pagination handlers: update URL (parent/router will trigger fetch)
  const handlePrev = () => {
    const prev =
      meta.previousPage ?? (meta.currentPage > 1 ? meta.currentPage - 1 : null);
    if (!prev) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(prev));
    params.set("limit", String(meta.itemsPerPage ?? 7));
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleNext = () => {
    const next =
      meta.nextPage ??
      (meta.currentPage < meta.totalPages ? meta.currentPage + 1 : null);
    if (!next) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(next));
    params.set("limit", String(meta.itemsPerPage ?? 7));
    router.push(`${pathname}?${params.toString()}`);
  };

  // derive unique methods from current payments (server returns filtered set)
  const uniqueMethods = Array.from(
    new Set(payments.map((p) => p.paymentMethod))
  ).filter(Boolean);

  const formatCurrency = (amount: number) => {
    // Use util if available, fallback to Intl
    try {
      return formatCurrencyUtil(amount);
    } catch {
      return new Intl.NumberFormat("es-GT", {
        style: "currency",
        currency: "GTQ",
        minimumFractionDigits: 2,
      }).format(amount);
    }
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-GT", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // statistics
  const totalAmount = payments.reduce(
    (sum, p) => sum + (Number(p.amount) || 0),
    0
  );
  const completedPayments = payments.filter(
    (p) =>
      p.status.toLowerCase() === "completed" ||
      p.status.toLowerCase() === "success"
  );
  const pendingPayments = payments.filter(
    (p) => p.status.toLowerCase() === "pending"
  );

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Filtrado</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(totalAmount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Pagos</p>
                <p className="text-xl font-bold">
                  {meta?.totalItems ?? payments.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Completados</p>
                <p className="text-xl font-bold text-green-600">
                  {completedPayments.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pendientes</p>
                <p className="text-xl font-bold text-yellow-600">
                  {pendingPayments.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de pagos */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Historial de Pagos
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar pagos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-36">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="completed">Completado</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="failed">Fallido</SelectItem>
                  <SelectItem value="refunded">Reembolsado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {uniqueMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-full sm:w-36">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todo</SelectItem>
                  <SelectItem value="today">Hoy</SelectItem>
                  <SelectItem value="week">Última semana</SelectItem>
                  <SelectItem value="month">Último mes</SelectItem>
                  <SelectItem value="quarter">Último trimestre</SelectItem>
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
                  <TableHead>Referencia</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Cargando pagos...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <CreditCard className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          No se encontraron pagos
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {payment.subscription.company.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Contacto Email
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono text-sm">
                          {payment.reference}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {payment.subscription.plan.name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="text-foreground">
                            {formatDateShort(payment.paymentDate)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(payment.paymentDate).toLocaleTimeString(
                              "es-GT",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          <span className="text-sm">
                            {payment.paymentMethod}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge>{payment.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-foreground">
                          {formatCurrency(Number(payment.amount) || 0)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {meta && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Página {meta.currentPage} de {meta.totalPages} —{" "}
                {meta.totalItems} resultados
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrev}
                  disabled={
                    isLoading ||
                    (!meta.hasPreviousPage &&
                      !meta.previousPage &&
                      meta.currentPage <= 1)
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
                    (!meta.hasNextPage &&
                      !meta.nextPage &&
                      meta.currentPage >= meta.totalPages)
                  }
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
