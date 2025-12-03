import { Suspense } from "react";
import CalendarPageClient from "./page.client";
import { Header } from "@/components/header";
import { findAll as findAllServices } from "@/actions/services/findAll";
import { User } from "@/types";
import { findAllProfessionals } from "@/actions/user/findAllProfessionals";
import { getUserId } from "@/actions/user/getUserId";
import { getUser } from "@/actions/auth"; // <- agregado para fallback al usuario actual
import { redirect } from "next/dist/client/components/navigation";
// Forzar renderizado dinámico
export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  // Obtener datos del servidor
  const [servicesResult, userId] = await Promise.all([
    findAllServices(),
    getUserId(),
  ]);

  const services = servicesResult?.data || [];

  // Intentar obtener la lista de profesionales; si falla o viene vacía,
  // usamos getUser() como fallback (si devuelve un usuario lo ponemos en un array)
  let professionals: User[] = [];
  try {
    const profResult = await findAllProfessionals();
    if (profResult.status === 401) {
      redirect("/api/logout");
    }
    professionals = profResult?.data || [];

    if (!Array.isArray(professionals) || professionals.length === 0) {
      // Si la lista está vacía, intentar obtener al usuario actual
      const current = await getUser();
      if (current) {
        professionals = [current];
      } else {
        professionals = [];
      }
    }
  } catch (err) {
    // Si la llamada a findAllProfessionals falla, intentar getUser como fallback.
    console.error(
      "Error obteniendo profesionales con findAllProfessionals(), intentando getUser():",
      err
    );
    const current = await getUser();
    if (current) {
      professionals = [current];
    } else {
      professionals = [];
    }
  }

  if (!userId) {
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
          userId={userId}
          services={services}
          professionals={professionals} // Pasar profesionales (puede ser [currentUser] como fallback)
        />
      </Suspense>
    </div>
  );
}
