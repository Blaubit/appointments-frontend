"use server";
import { Header } from "@/components/header";
import ClientsPageClient from "./page.client";
import { findAll } from "@/actions/clients/findAll";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;

  // Extraer parámetros de búsqueda
  const page =
    typeof resolvedSearchParams.page === "string"
      ? parseInt(resolvedSearchParams.page)
      : 1;
  const limit =
    typeof resolvedSearchParams.limit === "string"
      ? parseInt(resolvedSearchParams.limit)
      : 10;
  const search =
    typeof resolvedSearchParams.search === "string"
      ? resolvedSearchParams.search
      : "";

  // Crear URLSearchParams con paginación y búsqueda
  const params = new URLSearchParams();
  params.set("page", page.toString());
  params.set("limit", limit.toString()); // Opcional, si tu backend lo usa
  if (search && search.length >= 2) params.set("q", search);

  const clients = await findAll({ searchParams: params });

  // Calcular estadísticas basadas en pacientes filtrados

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        title="Pacientes"
        subtitle="Gestiona la información de tus pacientes"
        showBackButton={true}
        backButtonText="Dashboard"
        backButtonHref="/dashboard"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ClientsPageClient
          clients={clients.data || []}
          stats={clients.stats}
          pagination={clients.meta}
          initialSearchParams={{
            page,
            limit,
            search,
          }}
        />
      </main>
    </div>
  );
}
