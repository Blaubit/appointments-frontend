"use client";

import { useState, useTransition } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Subscription, Payment } from "@/types";
import { CompaniesTab } from "@/components/admin/companies-tab";
import { PaymentsTab } from "@/components/admin/payments-tab";

// Actions existentes
import { findAll as findAllSubscriptions } from "@/actions/subscription/findAll";
import { findAllPayments } from "@/actions/payments/findAllPayments";

// Interface para los datos del modal de pago
interface CreatePaymentData {
  subscriptionId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  transactionId: string;
  notes: string;
}

interface AdminPageClientProps {
  initialSubscriptions: Subscription[];
  initialPayments: Payment[];
}

export default function AdminPageClient({
  initialSubscriptions,
  initialPayments,
}: AdminPageClientProps) {
  const [subscriptions, setSubscriptions] =
    useState<Subscription[]>(initialSubscriptions);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);
  const [isPending, startTransition] = useTransition();
  const [paymentData, setPaymentData] = useState<CreatePaymentData>({
    subscriptionId: "",
    amount: 0,
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMethod: "credit_card",
    transactionId: "",
    notes: "",
  });

  // Funciones de utilidad
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Función para refrescar datos usando las actions existentes
  const refreshData = async () => {
    try {
      const [subscriptionsResult, paymentsResult] = await Promise.all([
        findAllSubscriptions(),
        findAllPayments(),
      ]);

      if (subscriptionsResult.success) {
        setSubscriptions(subscriptionsResult.data);
      } else {
        toast.error("Error al cargar las suscripciones");
      }

      // findAllPayments tiene una estructura diferente
      if (paymentsResult.data) {
        setPayments(paymentsResult.data);
      } else {
        toast.error("Error al cargar los pagos");
      }
    } catch (error) {
      console.error("Error al refrescar datos:", error);
      toast.error("Error al cargar los datos actualizados");
    }
  };

  // Función para manejar el registro de pago (simulado localmente)
  const handleMarkAsPaid = () => {
    if (!selectedSubscription) return;

    startTransition(async () => {
      try {
        // Simular creación de pago
        const newPayment: Payment = {
          id: `pay_${Date.now()}`,
          amount: paymentData.amount,
          paymentDate: new Date(paymentData.paymentDate).toISOString(),
          paymentMethod: paymentData.paymentMethod,
          status: "completed",
          reference: paymentData.transactionId || `TXN_${Date.now()}`,
          subscription: selectedSubscription,
        };

        // Calcular nueva fecha de vencimiento
        const currentDate = new Date(paymentData.paymentDate);
        const nextPeriod = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + selectedSubscription.plan.billingCycle,
          currentDate.getDate()
        );

        // Actualizar la suscripción localmente
        const updatedSubscriptions = subscriptions.map((subscription) => {
          if (subscription.id === selectedSubscription.id) {
            return {
              ...subscription,
              status: "active",
              startDate: paymentData.paymentDate,
              endDate: nextPeriod.toISOString().split("T")[0],
            };
          }
          return subscription;
        });

        // Actualizar estados localmente
        setSubscriptions(updatedSubscriptions);
        setPayments((prev) => [...prev, newPayment]);

        // Cerrar modal y limpiar formulario
        setIsPaymentModalOpen(false);
        setSelectedSubscription(null);
        setPaymentData({
          subscriptionId: "",
          amount: 0,
          paymentDate: new Date().toISOString().split("T")[0],
          paymentMethod: "credit_card",
          transactionId: "",
          notes: "",
        });

        toast.success("Pago registrado correctamente");

        // Opcionalmente refrescar datos del servidor
        await refreshData();
      } catch (error) {
        console.error("Error al procesar el pago:", error);
        toast.error("Error inesperado al procesar el pago");
      }
    });
  };

  // Función para abrir el modal de pago
  const openPaymentModal = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setPaymentData({
      ...paymentData,
      subscriptionId: subscription.id,
      amount: subscription.plan.price,
    });
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="Panel de Administración SaaS"
        subtitle="Gestiona todas las empresas clientes y suscripciones"
        showBackButton={true}
        backButtonText="Dashboard"
        backButtonHref="/dashboard"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4 flex justify-end">
          <Button onClick={refreshData} variant="outline" disabled={isPending}>
            {isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            Actualizar Datos
          </Button>
        </div>

        <Tabs defaultValue="companies" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="companies">Empresas</TabsTrigger>
            <TabsTrigger value="payments">Pagos</TabsTrigger>
          </TabsList>

          {/* Companies Tab */}
          <TabsContent value="companies" className="space-y-6">
            <CompaniesTab
              subscriptions={subscriptions}
              onOpenPaymentModal={openPaymentModal}
            />
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <PaymentsTab payments={payments} />
          </TabsContent>
        </Tabs>

        {/* Modal de registro de pago */}
        <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Registrar Pago</DialogTitle>
            </DialogHeader>
            {selectedSubscription && (
              <div className="space-y-6">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium text-foreground">
                    {selectedSubscription.company.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Plan: {selectedSubscription.plan.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Monto: {formatCurrency(selectedSubscription.plan.price)}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Monto</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={paymentData.amount}
                        onChange={(e) =>
                          setPaymentData({
                            ...paymentData,
                            amount: Number(e.target.value),
                          })
                        }
                        disabled={isPending}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentDate">Fecha de Pago</Label>
                      <Input
                        id="paymentDate"
                        type="date"
                        value={paymentData.paymentDate}
                        onChange={(e) =>
                          setPaymentData({
                            ...paymentData,
                            paymentDate: e.target.value,
                          })
                        }
                        disabled={isPending}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Método de Pago</Label>
                    <Select
                      value={paymentData.paymentMethod}
                      onValueChange={(value) =>
                        setPaymentData({ ...paymentData, paymentMethod: value })
                      }
                      disabled={isPending}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit_card">
                          Tarjeta de Crédito
                        </SelectItem>
                        <SelectItem value="bank_transfer">
                          Transferencia Bancaria
                        </SelectItem>
                        <SelectItem value="cash">Efectivo</SelectItem>
                        <SelectItem value="check">Cheque</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transactionId">
                      Referencia de Transacción (Opcional)
                    </Label>
                    <Input
                      id="transactionId"
                      placeholder="TXN123456789"
                      value={paymentData.transactionId}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          transactionId: e.target.value,
                        })
                      }
                      disabled={isPending}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas (Opcional)</Label>
                    <Input
                      id="notes"
                      placeholder="Notas adicionales sobre el pago..."
                      value={paymentData.notes}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          notes: e.target.value,
                        })
                      }
                      disabled={isPending}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsPaymentModalOpen(false)}
                    disabled={isPending}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleMarkAsPaid}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    {isPending ? "Procesando..." : "Confirmar Pago"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
