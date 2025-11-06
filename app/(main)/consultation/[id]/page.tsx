import { notFound } from "next/navigation";
import ConsultationPageClient from "./page.client";
import { findOne } from "@/actions/appointments/findOne";
import { findHistory } from "@/actions/clients/findHistory";
import { Appointment } from "@/types";

type Props = {
  params: {
    id: number;
  };
};

export default async function Page({ params }: Props) {
  try {
    const paramsM = await params;
    const appointmentResponse = await findOne(paramsM.id.toString());
    if (
      appointmentResponse.status !== 200 ||
      !("data" in appointmentResponse)
    ) {
      notFound();
    }

    const appointment = appointmentResponse.data;

    // Fetch client history
    let recentHistory: Appointment[] = [];
    try {
      const findHistoryResponse = await findHistory(
        {
          searchParams: new URLSearchParams({ page: "1", limit: "4" }),
        },
        appointment.client.id
      );
      if (findHistoryResponse.status === 200 && "data" in findHistoryResponse) {
        recentHistory = findHistoryResponse.data.slice(0, 4);
      }
    } catch (error) {
      console.warn("Failed to fetch client history:", error);
      // Continue without history data
    }

    return (
      <ConsultationPageClient
        appointment={appointment}
        recentHistory={recentHistory}
      />
    );
  } catch (error) {
    console.error("Error in consultation page:", error);
    notFound();
  }
}
