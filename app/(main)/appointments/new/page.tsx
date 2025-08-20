import PageClient from "./page.client";
import { findAll as findAllClients } from "@/actions/clients/findAll"; // nueva importación para clientes
import { findAllProfessionals } from "@/actions/user/findAllProfessionals";
import { getUser } from "@/actions/auth/getUser"; // nueva importación para obtener el usuario
import type { Client, User } from "@/types";

export default async function Page() {
  const clients: Client[] = (await findAllClients()).data; // obteniendo los clientes
  const professionals: User[] = (await findAllProfessionals()).data; // obteniendo todos los profesionales
  const userSession = await getUser(); // obteniendo la sesión del usuario
  if (!userSession) {
    throw new Error("User not authenticated");
  }
  if (!userSession) {
    throw new Error("User not authenticated");
  }

  return (
    <PageClient
      clients={clients}
      professionals={professionals}
      userSession={userSession}
    />
  );
}
