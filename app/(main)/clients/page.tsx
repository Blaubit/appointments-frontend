"use server";
import { Header } from "@/components/header";
import ClientsPageClient from "./page.client";
import type { Client, ClientStats, Pagination } from "@/types";
import { findAll } from "@/actions/clients/findAll";
// Mock data para clientes

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const clients = await findAll();
  // Calcular estadísticas basadas en clientes filtrados

  const stats: ClientStats = {
    totalClients: clients.data.length,
    activeClients: clients.data.length,
    newThisMonth: clients.data.filter((c: Client) => {
      const createdDate = new Date(c.createdAt);
      const now = new Date();
      return (
        createdDate.getMonth() === now.getMonth() &&
        createdDate.getFullYear() === now.getFullYear()
      );
    }).length,
    averageRating: 5,
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
          clients={clients.data}
          stats={stats}
          pagination={clients.meta}
        />
      </main>
    </div>
  );
}
