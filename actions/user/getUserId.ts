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

export async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) return null;

  try {
    const payload = decrypt(session);
    return payload.userId ?? null;
  } catch (e) {
    return null;
  }
}
