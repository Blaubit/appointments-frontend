"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session"); // Elimina la cookie
  redirect("/login"); // Redirige al login
}
