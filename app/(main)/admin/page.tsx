import { Suspense } from "react";
import AdminPageClient from "./page.client";
import { findAll as findAllSubscriptions } from "@/actions/subscription/findAll";
import { findAllPayments } from "@/actions/payments/findAllPayments";

async function AdminPageServer() {
  // Obtener solo las suscripciones del servidor (página inicial)
  // Pedimos la primera página con limit 10 por defecto
  const params = new URLSearchParams();
  params.set("page", "1");
  params.set("limit", "10");

  const [subscriptionsResult, paymentsResult] = await Promise.all([
    // Enviar los params como string para consistencia/serialización
    findAllSubscriptions({ searchParams: params.toString() }),
    findAllPayments(),
  ]);

  // Manejar errores si es necesario (forma simple)
  if (!subscriptionsResult || subscriptionsResult.status !== 200) {
    throw new Error("Error cargando suscripciones");
  }
  if (!paymentsResult || !paymentsResult.data) {
    throw new Error("Error cargando pagos");
  }

  const subscriptions = subscriptionsResult.data;
  const subscriptionsMeta = subscriptionsResult.meta;
  const payments = paymentsResult.data;

  return (
    <AdminPageClient
      initialSubscriptions={subscriptions}
      initialPayments={payments}
      initialSubscriptionsMeta={subscriptionsMeta}
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
