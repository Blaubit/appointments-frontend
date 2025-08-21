"use server";

import { decodeJwt } from "jose";
import { cookies } from "next/headers";

export type Payload = {
  userId: string;
  email: string;
  companyId: string;
  roleId: string;
  // Si tu payload tiene más propiedades, añádelas aquí
};

function decrypt(input: string) {
  const claims = decodeJwt<Payload>(input);
  return claims;
}

export default async function getSession() {
  const cookieStore = await cookies(); // ← Agregar await aquí
  const session = cookieStore.get("session")?.value;

  if (!session) return null;

  return session;
}
