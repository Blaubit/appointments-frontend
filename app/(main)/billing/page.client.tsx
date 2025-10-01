"use client";

import { useState } from "react";
import { Plan, Subscription } from "@/types";
import { updateSubscription } from "@/actions/subscription/updateSubscription";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

interface BillingClientProps {
  currentSubscription: Subscription;
  availablePlans: Plan[];
  companyId: string;
}

export default function BillingClient({
  currentSubscription,
  availablePlans,
  companyId,
}: BillingClientProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    currentSubscription.plan.id
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState<"upgrade" | "cancel" | null>(
    null
  );
  const router = useRouter();

  const currentPlan = currentSubscription.plan;
  const selectedPlan = availablePlans.find(
    (plan) => plan.id === selectedPlanId
  );

  const handlePlanChange = async () => {
    if (!selectedPlan || selectedPlan.id === currentPlan.id) return;

    setIsLoading(true);
    try {
      const result = await updateSubscription({
        id: currentSubscription.id,
        companyId,
        planId: selectedPlan.id,
        endDate: currentSubscription.endDate,
        status: "active",
      });

      if (result.status === 200) {
        router.refresh();
        setShowConfirmModal(false);
      } else {
        // Handle error
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
      alert("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setIsLoading(true);
    try {
      const result = await updateSubscription({
        companyId,
        planId: currentPlan.id,
        endDate: currentSubscription.endDate,
        status: "cancelled",
      });

      if (result.status === 200) {
        router.refresh();
        setShowConfirmModal(false);
      } else {
        // Handle error
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      alert("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const openConfirmModal = (type: "upgrade" | "cancel") => {
    setActionType(type);
    setShowConfirmModal(true);
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(parseFloat(price));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="Facturación y Suscripción"
        subtitle="Gestiona tu plan y configuración de facturación"
        showBackButton={true}
        backButtonText="Dashboard"
        backButtonHref="/dashboard"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Current Subscription */}
          <div className="bg-card rounded-lg shadow-md border p-6">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Suscripción Actual
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-foreground">
                  {currentPlan.name}
                </h3>
                <p className="text-muted-foreground mt-1">
                  {currentPlan.description}
                </p>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Precio:</span>{" "}
                    {formatPrice(String(currentPlan.price))}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">
                      Ciclo de Facturación:
                    </span>{" "}
                    {currentPlan.billingCycle} días
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Estado:</span>
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                        currentSubscription.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                      }`}
                    >
                      {currentSubscription.status === "active"
                        ? "Activa"
                        : "Cancelada"}
                    </span>
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">
                  Detalles de la Suscripción
                </h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">
                      Fecha de Inicio:
                    </span>{" "}
                    {formatDate(currentSubscription.startDate)}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">
                      Fecha de Vencimiento:
                    </span>{" "}
                    {formatDate(currentSubscription.endDate)}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">
                      Usuarios Actuales:
                    </span>{" "}
                    {currentSubscription.currentUsers}
                  </p>
                </div>
                <Button
                  onClick={() => openConfirmModal("cancel")}
                  variant="destructive"
                  className="mt-4"
                  disabled={
                    currentSubscription.status === "cancelled" || isLoading
                  }
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2" />
                  )}
                  Cancelar Suscripción
                </Button>
              </div>
            </div>
          </div>

          {/* Available Plans */}
          <div className="bg-card rounded-lg shadow-md border p-6">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Cambiar Plan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availablePlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`border rounded-lg p-6 cursor-pointer transition-all ${
                    selectedPlanId === plan.id
                      ? "border-primary bg-primary/5"
                      : plan.id === currentPlan.id
                        ? "border-green-500 bg-green-50 dark:bg-green-900/10"
                        : "border-border hover:border-muted-foreground"
                  }`}
                  onClick={() => setSelectedPlanId(plan.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-foreground">
                      {plan.name}
                    </h3>
                    {plan.id === currentPlan.id && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 text-xs rounded-full font-medium">
                        Actual
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">
                    {plan.description}
                  </p>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-foreground">
                      {formatPrice(String(plan.price))}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      por {plan.billingCycle} días
                    </p>
                  </div>
                  <div className="mt-4">
                    <input
                      type="radio"
                      name="plan"
                      value={plan.id}
                      checked={selectedPlanId === plan.id}
                      onChange={() => setSelectedPlanId(plan.id)}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                  </div>
                </div>
              ))}
            </div>

            {selectedPlanId !== currentPlan.id && (
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">
                      Plan Seleccionado: {selectedPlan?.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Nuevo precio:{" "}
                      {selectedPlan
                        ? formatPrice(String(selectedPlan.price))
                        : ""}{" "}
                      por {selectedPlan?.billingCycle} días
                    </p>
                  </div>
                  <Button
                    onClick={() => openConfirmModal("upgrade")}
                    disabled={isLoading}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    {isLoading ? "Actualizando..." : "Cambiar Plan"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Confirmation Modal */}
          {showConfirmModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-card rounded-lg p-6 max-w-md w-full mx-4 border">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  {actionType === "cancel"
                    ? "Cancelar Suscripción"
                    : "Cambiar Plan"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {actionType === "cancel"
                    ? "¿Estás seguro de que quieres cancelar tu suscripción? Esta acción no se puede deshacer."
                    : `¿Estás seguro de que quieres cambiar al plan ${selectedPlan?.name}?`}
                </p>
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirmModal(false)}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={
                      actionType === "cancel"
                        ? handleCancelSubscription
                        : handlePlanChange
                    }
                    variant={
                      actionType === "cancel" ? "destructive" : "default"
                    }
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    {isLoading ? "Procesando..." : "Confirmar"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
