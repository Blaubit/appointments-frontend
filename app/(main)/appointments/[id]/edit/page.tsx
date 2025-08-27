import PageEditClient from "@/app/(main)/appointments/[id]/edit/page.client";
import findOne  from "@/actions/appointments/findOne";
import { findAll as findAllClients } from "@/actions/clients/findAll";
import { findAllProfessionals } from "@/actions/user/findAllProfessionals";
import { getUser } from "@/actions/auth/getUser";
import type { Client, User } from "@/types";

export default async function Page({ params }: { params: { id: string } }) {
  const clients: Client[] = (await findAllClients()).data;
  const professionals: User[] = (await findAllProfessionals()).data;
  const userSession = await getUser();
  if (!userSession) {
    throw new Error("User not authenticated");
  }

  // Obtener la cita
  const appointmentResult = await findOne(params.id);
  if ("data" in appointmentResult) {
    return (
      <PageEditClient
        clients={clients}
        professionals={professionals}
        userSession={userSession}
        appointment={appointmentResult.data}
      />
    );
  } else {
    // Manejo de error: cita no encontrada
    return <div>Error: {appointmentResult.message}</div>;
  }
}