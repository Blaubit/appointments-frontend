import PageEditClient from "@/app/(main)/appointments/[id]/edit/page.client";
import findOne from "@/actions/appointments/findOne";
import { findAll as findAllClients } from "@/actions/clients/findAll";
import { findAllProfessionals } from "@/actions/user/findAllProfessionals";
import type { Client, User } from "@/types";
export default async function Page({ params }: { params: { id: string } }) {
  const clients: Client[] = (await findAllClients()).data;
  const professionals: User[] = (await findAllProfessionals()).data;

  // Obtener la cita
  const appointmentResult = await findOne(params.id);
  if ("data" in appointmentResult) {
    return (
      <PageEditClient
        clients={clients}
        professionals={professionals}
        appointment={appointmentResult.data}
      />
    );
  } else {
    // Manejo de error: cita no encontrada
    return <div>Error: {appointmentResult.message}</div>;
  }
}
