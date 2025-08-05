import { notFound } from "next/navigation"
import ConsultationPageClient from "./page.client"
import findOne from "@/actions/appointments/findOne"
import {findHistory} from "@/actions/clients/findHistory"
import { SuccessReponse } from "@/types/api"
import { Appointment } from "@/types"



type Props = {
  params: {
      id: number;
  }
}

export default async function Page({params}:Props) {

  const appointmentResponse = await findOne(params.id)
  if (appointmentResponse.status !== 200 || !("data" in appointmentResponse)) {
    throw new Error("Failed to fetch user data");
  }
  const appointment = appointmentResponse.data;
  const findHistoryResponse = await findHistory(appointment.client.id)
  if (findHistoryResponse.status !== 200 || !("data" in findHistoryResponse)) {
    throw new Error("Failed to fetch client history");
  }
  const recentHistory = findHistoryResponse.data.slice(0, 3);

  return (
    <ConsultationPageClient appointment={appointmentResponse.data} recentHistory={recentHistory}/>
  )
  
}