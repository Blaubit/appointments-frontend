import { NextResponse } from "next/server";

/**
 * Route handler para logout.
 * Borra cookies relevantes de sesión y redirige a /login.
 * Implementado tanto para POST como GET (GET delega a POST) para facilitar redirecciones server-side.
 */

export async function POST() {
  const res = NextResponse.redirect(
    new URL(
      "/login",
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001"
    )
  );

  // Borrar cookies de sesión de forma explícita (route handlers permiten esto)
  res.cookies.delete("session");
  res.cookies.delete("user");
  // Si usas otras cookies de sesión, agrégalas aquí:
  // res.cookies.delete("next-auth.session-token");

  return res;
}

export async function GET() {
  return POST();
}
