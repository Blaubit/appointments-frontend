import { notFound } from "next/navigation";
import ClientHistoryPageClient from "./page.client";
import { findHistory } from "@/actions/clients/findHistory";
import { findOne } from "@/actions/clients/findOne";
import type { Client, Appointment, ClientAppointmentsStats } from "@/types";

interface ClientHistoryPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ClientHistoryPage({
  params,
  searchParams,
}: ClientHistoryPageProps) {
  try {
    // Await both params and searchParams
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    const clientResponse = await findOne(resolvedParams.id);
    if (clientResponse.status !== 200 || !("data" in clientResponse)) {
      notFound();
    }

    const client: Client = clientResponse.data;

    // Convert searchParams to URLSearchParams correctly
    const urlSearchParams = new URLSearchParams();
    Object.entries(resolvedSearchParams).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          value.forEach((v) => urlSearchParams.append(key, v));
        } else {
          urlSearchParams.set(key, value);
        }
      }
    });

    let recentHistory: Appointment[] = [];
    let findHistoryResponse: any = { data: [], stats: {}, meta: {} };

    try {
      findHistoryResponse = await findHistory(
        { searchParams: urlSearchParams },
        resolvedParams.id
      );

      if (findHistoryResponse.status === 200) {
        recentHistory = findHistoryResponse.data;
      }
    } catch (error) {
      // Continue without history data
    }

    return (
      <ClientHistoryPageClient
        client={client}
        appointments={recentHistory}
        stats={findHistoryResponse.stats}
        meta={findHistoryResponse.meta}
      />
    );
  } catch (error) {
    console.error("Error in history page:", error);
    notFound();
  }
}
