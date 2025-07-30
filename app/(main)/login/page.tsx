"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import LoginClient from "./page.client";
import { Login } from "@/actions/auth/login";

// Validación con backend real
async function handleServerLogin(formData: FormData) {
  "use server";
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const remember = formData.get("remember") === "on";

  if (!email || !password) {
    return { error: "Email y contraseña son requeridos" };
  }

  try {
    // Usar la función Login importada
    const result = await Login({ email, password });

    // Verificar si la respuesta es exitosa
    if ('data' in result && result.status === 200) {
      // Login exitoso, redirigir al dashboard
      redirect("/dashboard");
    } else if ('message' in result) {
      // Error en el login
      return { 
        error: result.message || "Error en el login",
        status: result.status 
      };
    }
  } catch (error) {
    console.error("Error durante el login:", error);
    return { error: "Error interno del servidor" };
  }
}

// Verifica si ya hay token, y si lo hay redirige al dashboard
async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value; // Cambiado de "token" a "session" para coincidir con login.ts
  if (token) {
    redirect("/dashboard");
  }
}

// Información adicional que puedes pasar al cliente
async function getServerMetadata() {
  return {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    version: process.env.APP_VERSION || "1.0.0",
  };
}

export default async function LoginPage() {
  await checkAuth();
  const serverMetadata = await getServerMetadata();

  return (
    <LoginClient
      serverAction={handleServerLogin}
      serverMetadata={serverMetadata}
    />
  );
}
