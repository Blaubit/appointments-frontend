"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const cookieStore = await cookies();

  // Eliminar la cookie del token
  cookieStore.set("token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });
  cookieStore.delete("session");
  cookieStore.delete("user");
  // Redirigir al login o a la raíz
  redirect("/login");
}
