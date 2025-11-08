import { NextResponse } from "next/server";

// Endpoint que borra cookies de sesión en el servidor.
// Llamar desde el interceptor del cliente cuando recibes 401.
export async function POST() {
  const res = NextResponse.json({ ok: true });

  // Borra cookies relevantes. Ajusta nombres si usas otros.
  res.cookies.set("session", "", { path: "/", maxAge: 0 });
  res.cookies.set("user", "", { path: "/", maxAge: 0 });

  // Si usas otros nombres (p. ej. next-auth), agrégalos aquí:
  // res.cookies.set("next-auth.session-token", "", { path: "/", maxAge: 0 });

  return res;
}
