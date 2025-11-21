"use server";

import PageClient from "./page.client";
import { findAll as findAllClients } from "@/actions/clients/findAll";
import { findAllProfessionals } from "@/actions/user/findAllProfessionals";
import { getUser } from "@/actions/auth/getUser";
import type { Client, User } from "@/types";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;

  // Extraer parámetros de búsqueda/paginación desde la URL
  const page =
    typeof resolvedSearchParams.page === "string"
      ? parseInt(resolvedSearchParams.page)
      : 1;
  const limit =
    typeof resolvedSearchParams.limit === "string"
      ? parseInt(resolvedSearchParams.limit)
      : 10;
  const search =
    typeof resolvedSearchParams.search === "string"
      ? resolvedSearchParams.search
      : "";

  // Construir URLSearchParams para pasárselos al action findAllClients
  const params = new URLSearchParams();
  params.set("page", page.toString());
  params.set("limit", limit.toString());
  // el action findAll espera la clave 'q' para la búsqueda (como en clients-page.tsx)
  if (search && search.length >= 2) params.set("q", search);

  // Obtener datos desde el servidor
  const clientsResult = await findAllClients({ searchParams: params });
  const professionalsResult = await findAllProfessionals();
  const userSession = await getUser();

  if (!userSession) {
    throw new Error("User not authenticated");
  }

  const clients: Client[] =
    clientsResult &&
    "data" in clientsResult &&
    Array.isArray(clientsResult.data)
      ? clientsResult.data
      : [];

  const professionals: User[] =
    professionalsResult &&
    "data" in professionalsResult &&
    Array.isArray(professionalsResult.data)
      ? professionalsResult.data
      : [];

  return (
    <PageClient
      clients={clients}
      professionals={professionals}
      userSession={userSession}
    />
  );
}
