import { NextResponse } from "next/server";

export async function POST() {
  // Respuesta que borra cookies y redirige al login
  const res = NextResponse.redirect(
    new URL(
      "/login",
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    )
  );

  // Borra o invalida cookies (usa maxAge 0 para asegurar borrado)
  res.cookies.set("session", "", { maxAge: 0, path: "/" });
  res.cookies.set("user", "", { maxAge: 0, path: "/" });

  return res;
}
