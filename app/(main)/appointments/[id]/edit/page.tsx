import EditAppointmentClient from "./page.client";
import { findAll as findAllClients } from "@/actions/clients/findAll";
import { findAllProfessionals } from "@/actions/user/findAllProfessionals";
import { getUser } from "@/actions/auth/getUser";
import { findOne as findAppointmentById } from "@/actions/appointments/findOne";
import type { Client, User, Appointment } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

/*
  Página de servidor que carga los datos necesarios para editar una cita:
   - pacientes
   - profesionales
   - sesión del usuario
   - datos de la cita por id (params.id)
*/
export default async function Page({ params, searchParams }: Props) {
  // await params antes de usar sus propiedades para evitar:
  // "Route ... used `params.id`. `params` should be awaited before using its properties."
  const resolvedParams = await params;
  const appointmentId = resolvedParams.id;

  // Resolver searchParams si los necesitas (opcional)
  const resolvedSearchParams = searchParams ? await searchParams : {};

  // Clientes: leer page/limit/search (la UI actual usa 'search' como parámetro)
  const clientPage =
    typeof (resolvedSearchParams as any).page === "string"
      ? parseInt((resolvedSearchParams as any).page)
      : 1;
  const clientLimit =
    typeof (resolvedSearchParams as any).limit === "string"
      ? parseInt((resolvedSearchParams as any).limit)
      : 10;
  const clientSearch =
    typeof (resolvedSearchParams as any).search === "string"
      ? (resolvedSearchParams as any).search
      : "";

  const clientsParams = new URLSearchParams();
  clientsParams.set("page", clientPage.toString());
  clientsParams.set("limit", clientLimit.toString());
  if (clientSearch && clientSearch.length >= 2)
    clientsParams.set("q", clientSearch);

  // Professionals: read professionalSearch param (separate from clients)
  const profSearch =
    typeof (resolvedSearchParams as any).professionalSearch === "string"
      ? (resolvedSearchParams as any).professionalSearch
      : "";

  const profParams = new URLSearchParams();
  profParams.set("page", "1");
  profParams.set("limit", "10");
  if (profSearch && profSearch.length >= 2) profParams.set("q", profSearch);

  // Cargar datos necesarios en el servidor (paralelo)
  const [clientsResult, professionalsResult, userSession, appointmentResult] =
    await Promise.all([
      // Pasamos los URLSearchParams para que las actions puedan enviarlos al backend
      findAllClients({ searchParams: clientsParams }),
      findAllProfessionals({ searchParams: profParams }),
      getUser(),
      findAppointmentById(appointmentId),
    ]);

  if (!userSession) {
    throw new Error("User not authenticated");
  }

  if (
    !appointmentResult ||
    "message" in appointmentResult ||
    !appointmentResult.data
  ) {
    throw new Error("Appointment not found");
  }

  const appointment: Appointment = appointmentResult.data;

  const clients: Client[] =
    clientsResult &&
    "data" in clientsResult &&
    Array.isArray(clientsResult.data)
      ? clientsResult.data
      : Array.isArray(clientsResult)
        ? clientsResult
        : [];

  const professionals: User[] =
    professionalsResult &&
    "data" in professionalsResult &&
    Array.isArray(professionalsResult.data)
      ? professionalsResult.data
      : Array.isArray(professionalsResult)
        ? professionalsResult
        : [];

  return (
    <EditAppointmentClient
      appointment={appointment}
      clients={clients}
      professionals={professionals}
      userSession={userSession}
    />
  );
}
