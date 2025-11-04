"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Subscription, Payment } from "@/types";
import { CompaniesTab } from "@/components/admin/companies-tab";
import { PaymentsTab } from "@/components/admin/payments-tab";

import { findAll as findAllSubscriptions } from "@/actions/subscription/findAll";
import { findAllPayments } from "@/actions/payments/findAllPayments";

interface AdminPageClientProps {
  initialSubscriptions: Subscription[];
  initialPayments: Payment[];
  initialSubscriptionsMeta?: any;
}

export default function AdminPageClient({
  initialSubscriptions,
  initialPayments,
  initialSubscriptionsMeta,
}: AdminPageClientProps) {
  const [subscriptions, setSubscriptions] =
    useState<Subscription[]>(initialSubscriptions);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [subscriptionsMeta, setSubscriptionsMeta] = useState<any>(
    initialSubscriptionsMeta ?? {
      currentPage: 1,
      totalPages: 1,
      totalItems: initialSubscriptions.length,
      itemsPerPage: 10,
      hasNextPage: false,
      hasPreviousPage: false,
      nextPage: null,
      previousPage: null,
    }
  );

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Control de races: requestId
  const latestRequestId = useRef(0);

  // Llamada a la action usando exactamente URLSearchParams o string
  const fetchWithUrlSearchParams = async (
    urlParams: URLSearchParams | string
  ) => {
    const requestId = ++latestRequestId.current;
    const paramsString =
      typeof urlParams === "string" ? urlParams : urlParams.toString();
    setIsLoading(true);

    try {
      // Pasamos siempre un string para evitar problemas de serialización
      const [subscriptionsResult, paymentsResult] = await Promise.all([
        findAllSubscriptions({ searchParams: paramsString }),
        findAllPayments(),
      ]);

      // Si ya hay una petición más reciente, ignoramos esta respuesta
      if (requestId !== latestRequestId.current) {
        console.warn(
          "[adminPage] Ignoring stale response id:",
          requestId,
          "current:",
          latestRequestId.current
        );
        return;
      }

      if (subscriptionsResult && subscriptionsResult.status === 200) {
        setSubscriptions(subscriptionsResult.data || []);
        setSubscriptionsMeta(subscriptionsResult.meta || subscriptionsMeta);
      } else {
        toast.error("Error al cargar las suscripciones");
        setSubscriptions([]);
      }

      if (paymentsResult && paymentsResult.data) {
        setPayments(paymentsResult.data);
      } else {
        // No es crítico para companies tab
      }
    } catch (error) {
      console.error("[adminPage] fetch error:", error);
      toast.error("Error al cargar datos");
      setSubscriptions([]);
    } finally {
      if (requestId === latestRequestId.current) {
        setIsLoading(false);
      }
    }
  };

  // refreshData: si no vienen options, usa exactamente los searchParams actuales de la URL
  const refreshData = async (options?: {
    page?: number;
    limit?: number;
    q?: string;
    status?: string;
  }) => {
    if (!options) {
      const current = new URLSearchParams(searchParams.toString());
      await fetchWithUrlSearchParams(current);
      return;
    }
    const params = new URLSearchParams();
    params.set(
      "page",
      String(options.page ?? subscriptionsMeta?.currentPage ?? 1)
    );
    params.set(
      "limit",
      String(options.limit ?? subscriptionsMeta?.itemsPerPage ?? 10)
    );
    if (options.q) params.set("q", options.q);
    if (options.status && options.status !== "all")
      params.set("status", options.status);
    await fetchWithUrlSearchParams(params);
  };

  // Escucha cambios en la URL y llama a la action con los mismos params
  useEffect(() => {
    const paramsString = searchParams.toString();
    const params = new URLSearchParams(paramsString);
    fetchWithUrlSearchParams(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams?.toString()]);

  // cuando CompaniesTab pide cambiar página/filtros actualizamos la URL -> la effect disparará fetch
  const handleCompaniesPageChange = (newPage: number, filters?: any) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    params.set("limit", String(subscriptionsMeta?.itemsPerPage ?? 10));
    if (filters?.q) params.set("q", filters.q);
    else params.delete("q");
    if (filters?.status && filters.status !== "all")
      params.set("status", filters.status);
    else params.delete("status");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="Panel de Administración SaaS"
        subtitle="Gestiona todas las empresas pacientes y suscripciones"
        showBackButton={true}
        backButtonText="Dashboard"
        backButtonHref="/dashboard"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <Button
              onClick={() => refreshData()}
              variant="outline"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              {isLoading ? "Cargando..." : "Actualizar Datos"}
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            {isLoading ? "Actualizando suscripciones..." : ""}
          </div>
        </div>

        <Tabs defaultValue="companies" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="companies">Empresas</TabsTrigger>
            <TabsTrigger value="payments">Pagos</TabsTrigger>
          </TabsList>

          <TabsContent value="companies" className="space-y-6">
            <CompaniesTab
              subscriptions={subscriptions}
              onOpenPaymentModal={(s) => {
                setSelectedSubscription(s);
                setIsPaymentModalOpen(true);
              }}
              pagination={subscriptionsMeta}
              onPageChange={handleCompaniesPageChange}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <PaymentsTab payments={payments} />
          </TabsContent>
        </Tabs>

        <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Registrar Pago</DialogTitle>
            </DialogHeader>
            {/* Formulario de pago aquí */}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
