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
  const userCookie = cookieStore.get("user")?.value;

  if (userCookie) {
    try {
      // Si existe el usuario en las cookies, devolverlo
      return JSON.parse(userCookie) as User;
    } catch (error) {
      // Si hay error al parsear, continuar con findMe
    }
  }

  // Si no existe el usuario en las cookies, buscarlo con findMe
  try {
    const res = await findMe();
    if ("data" in res && res.status === 200 && res.data) {
      // Guardar el usuario en las cookies
      cookieStore.set("user", JSON.stringify(res.data));
      return res.data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}