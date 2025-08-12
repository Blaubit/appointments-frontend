import PageClient from "./page.client";
import {findAll} from "@/actions/services/findAll"; // asegúrate que esta función exista
import { findAll as findAllClients } from "@/actions/clients/findAll"; // nueva importación para clientes
import { findAllProfessionals } from "@/actions/user/findAllProfessionals";
import { getUser } from "@/actions/auth/getUser"; // nueva importación para obtener el usuario
import type { Service, Client, User } from "@/types";

export default async function Page() {
  const services: Service[] = (await findAll()).data;
  const clients: Client[] = (await findAllClients()).data; // obteniendo los clientes
  const professionals: User[] = (await findAllProfessionals()).data; // obteniendo todos los profesionales
  const userSession = await getUser(); // obteniendo la sesión del usuario

  return (
    <PageClient
      services={services}
      clients={clients}
      professionals={professionals}
      userSession={userSession}
    />
  );
}
