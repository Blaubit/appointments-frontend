import { Suspense } from "react";
import AdminPageClient from "./page.client";
import { findAll as findAllSubscriptions } from "@/actions/subscription/findAll";
import { findAllPayments } from "@/actions/payments/findAllPayments";
async function AdminPageServer() {
  // Obtener solo las suscripciones del servidor
  const [subscriptionsResult, paymentsResult] = await Promise.all([
    findAllSubscriptions(),
    findAllPayments(),
  ]);

  // Manejar errores si es necesario
  if ("error" in subscriptionsResult) {
    throw new Error(subscriptionsResult.error);
  }
  if ("error" in paymentsResult) {
    throw new Error(paymentsResult.error);
  }
  const subscriptions = subscriptionsResult.data;
  const payments = paymentsResult.data;

  return (
    <AdminPageClient
      initialSubscriptions={subscriptions}
      initialPayments={payments}
    />
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div>Cargando panel de administración...</div>}>
      <AdminPageServer />
    </Suspense>
  );
}
