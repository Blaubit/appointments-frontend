"use server";
import { Header } from "@/components/header";
import ClientsPageClient from "./page.client";
import type { Client, ClientStats, Pagination } from "@/types";
import { findAll } from "@/actions/clients/findAll";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Await searchParams before using its properties
  const resolvedSearchParams = await searchParams;
  
  // Extraer parámetros de búsqueda
  const page =
    typeof resolvedSearchParams.page === "string" ? parseInt(resolvedSearchParams.page) : 1;
  const limit =
    typeof resolvedSearchParams.limit === "string" ? parseInt(resolvedSearchParams.limit) : 10;
  const search =
    typeof resolvedSearchParams.search === "string" ? resolvedSearchParams.search : "";
  const status =
    typeof resolvedSearchParams.status === "string" ? resolvedSearchParams.status : "all";

  // Crear URLSearchParams para enviar al backend
  const params = new URLSearchParams();
  params.set("page", page.toString());
  params.set("limit", limit.toString());
  if (search) params.set("search", search);
  if (status && status !== "all") params.set("status", status);

  const clients = await findAll({ searchParams: params });

  // Calcular estadísticas basadas en clientes filtrados
  const stats: ClientStats = {
    totalClients: clients.meta?.totalItems || 0,
    activeClients:
      clients.data?.filter((c: Client) => c.status === "active").length || 0,
    newThisMonth:
      clients.data?.filter((c: Client) => {
        const createdDate = new Date(c.createdAt);
        const now = new Date();
        return (
          createdDate.getMonth() === now.getMonth() &&
          createdDate.getFullYear() === now.getFullYear()
        );
      }).length || 0,
    averageRating:
      clients.data?.reduce(
        (acc: number, c: Client) => acc + (parseFloat(c.rating) || 0),
        0,
      ) / (clients.data?.length || 1) || 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        title="Clientes"
        subtitle="Gestiona la información de tus clientes"
        showBackButton={true}
        backButtonText="Dashboard"
        backButtonHref="/dashboard"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ClientsPageClient
          clients={clients.data || []}
          stats={stats}
          pagination={clients.meta}
          initialSearchParams={{
            page,
            limit,
            search,
            status,
          }}
        />
      </main>
    </div>
  );
}