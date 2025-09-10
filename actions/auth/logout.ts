"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session"); // Elimina la cookie
  cookieStore.set("session", "", { maxAge: 0 }); // Asegura que la cookie se elimine
  // borra todo dentro de la cookie
  cookieStore.delete("user");

  redirect("/login"); // Redirige al login
}
