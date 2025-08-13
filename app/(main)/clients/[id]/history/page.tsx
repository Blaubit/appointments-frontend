import { notFound } from "next/navigation";
import ClientHistoryPageClient from "./page.client";
import { findHistory } from "@/actions/clients/findHistory";
import { findOne } from "@/actions/clients/findOne";
import type { Client, Appointment,ClientAppointmentsStats } from "@/types";

interface ClientHistoryPageProps {
  params: {
    id: string;
  };
}

export default async function ClientHistoryPage({
  params,
}: ClientHistoryPageProps) {
  try {
    const clientResponse = await findOne(params.id);
    if (clientResponse.status !== 200 || !("data" in clientResponse)) {
      notFound();
    }
    
    const client: Client = clientResponse.data;
    let recentHistory: Appointment[] = [];
    try {
      const findHistoryResponse = await findHistory(params.id);
      
      if (findHistoryResponse.status === 200) {
        recentHistory = findHistoryResponse.data;
      }
    } catch (error) {
      console.warn("Failed to fetch client history:", error);
      // Continue without history data
    }
    const stats:ClientAppointmentsStats = {
      total: recentHistory.length,
      completed: recentHistory.filter(app => app.status === 'completed').length,
      resecheduled: recentHistory.filter(app => app.status === 'rescheduled').length,
      cancelled: recentHistory.filter(app => app.status === 'cancelled').length,

    }
    return (
      <ClientHistoryPageClient client={client} appointments={recentHistory} stats={stats}/>
    );
  } catch (error) {
    console.error("Error in histyory page:", error);
    notFound();
  }
}
