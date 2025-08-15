import { Suspense } from "react";
import CalendarPageClient from "./page.client";
import { Header } from "@/components/header";
import findAll from "@/actions/appointments/findAll";
import { findAll as findAllServices } from "@/actions/services/findAll";

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic'

export default async function CalendarPage() {
  // Obtener datos del servidor
  const [appointmentsResult, servicesResult] = await Promise.all([
    findAll(),
    findAllServices(),
  ]);

  // Manejar casos donde no hay datos o hay errores
  const appointments = appointmentsResult?.data || [];
  const services = servicesResult?.data || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header del servidor */}
      <Header
        title="Calendario"
        showBackButton={true}
        backButtonText="Dashboard"
        backButtonHref="/dashboard"
      />

      {/* Componente cliente con datos del servidor */}
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        }
      >
        <CalendarPageClient
          initialAppointments={appointments}
          services={services}
        />
      </Suspense>
    </div>
  );
}