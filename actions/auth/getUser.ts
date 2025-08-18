"use server";
import { cookies } from "next/headers";
import { User } from "@/types";
import findMe from "../user/findMe";
export type Payload = {
  userId: string;
  email: string;
  companyId: string;
  roleId: string;
  // Si tu payload tiene más propiedades, añádelas aquí
};

export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionJwt = cookieStore.get("session")?.value;

  if (!sessionJwt) {
    return null;
  }

  try {
  
    const res = await findMe();
    if ("data" in res && res.status === 200 && res.data) {
      return res.data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}