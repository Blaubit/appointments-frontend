import EditAppointmentClient from "./page.client";
import { findAll as findAllClients } from "@/actions/clients/findAll";
import { findAllProfessionals } from "@/actions/user/findAllProfessionals";
import { getUser } from "@/actions/auth/getUser";
import { findOne as findAppointmentById } from "@/actions/appointments/findOne";
import type { Client, User, Appointment } from "@/types";

interface Props {
  params: { id: string };
}

/*
  Página de servidor que carga los datos necesarios para editar una cita:
   - clientes
   - profesionales
   - sesión del usuario
   - datos de la cita por id (params.id)

  Nota: Se asume que existe la acción `@/actions/appointments/findById`
  que recibe un id y devuelve { data: Appointment }. Si tu acción tiene
  otra firma, ajusta la llamada.
*/
export default async function Page({ params }: Props) {
  const appointmentId = params.id;

  // Cargar datos necesarios en el servidor
  const clients: Client[] = (await findAllClients()).data || [];
  const professionals: User[] = (await findAllProfessionals()).data || [];
  const userSession = await getUser();

  if (!userSession) {
    // Redirigir o lanzar error según tu flujo de auth
    throw new Error("User not authenticated");
  }

  const appointmentResult = await findAppointmentById(appointmentId);
  if (
    !appointmentResult ||
    "message" in appointmentResult ||
    !appointmentResult.data
  ) {
    // Manejo simple: lanzar para que Next muestre error o 404
    throw new Error("Appointment not found");
  }

  const appointment: Appointment = appointmentResult.data;
  console.log("Editing appointment:", appointment);
  return (
    <EditAppointmentClient
      appointment={appointment}
      clients={clients}
      professionals={professionals}
    />
  );
}
