import { Suspense } from "react";
import CalendarPageClient from "./page.client";
import { Header } from "@/components/header";
import { findAll as findAllServices } from "@/actions/services/findAll";
import { getUser } from "@/actions/auth";
import { User } from "@/types";
import { findAllProfessionals } from "@/actions/user/findAllProfessionals";
// Forzar renderizado dinámico
export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  // Obtener datos del servidor
  const [servicesResult, user, professionalsResult] = await Promise.all([
    findAllServices(),
    getUser(),
    findAllProfessionals(), // Nueva función para obtener profesionales
  ]);

  const services = servicesResult?.data || [];
  const professionals: User[] = (await findAllProfessionals()).data;
  if (!user) {
    // Manejar caso donde no hay usuario
    return <div>No tienes permisos para ver este calendario</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        title="Calendario"
        showBackButton={true}
        backButtonText="Dashboard"
        backButtonHref="/dashboard"
      />
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
          userId={user.id}
          services={services}
          professionals={professionals} // Pasar profesionales
        />
      </Suspense>
    </div>
  );
}
