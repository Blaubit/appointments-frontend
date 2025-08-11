"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import LoginClient from "./page.client";
import { Login } from "@/actions/auth/login";
import { loginSchema } from "@/lib/validations/auth";
import { z } from "zod";

// Validación con backend real usando Zod
async function handleServerLogin(formData: FormData) {
  "use server";

  try {
    // Extraer datos del FormData
    const rawData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      remember: formData.get("remember") === "on",
    };

    // Validación con Zod en el servidor
    const validationResult = loginSchema.safeParse(rawData);

    if (!validationResult.success) {
      // Formatear errores de validación por campo
      const fieldErrors: Record<string, string[]> = {};

      validationResult.error.errors.forEach((error) => {
        const field = error.path[0] as string;
        if (!fieldErrors[field]) {
          fieldErrors[field] = [];
        }
        fieldErrors[field].push(error.message);
      });

      return {
        error: "Datos de formulario inválidos",
        fieldErrors,
      };
    }

    // Los datos son válidos, proceder con el login
    const { email, password, remember } = validationResult.data;

    // Usar la función Login importada
    const result = await Login({ email, password });

    // Verificar si la respuesta es exitosa
    if ("data" in result && result.status === 200) {
      // Login exitoso, redirigir al dashboard
      redirect("/dashboard");
    } else if ("message" in result) {
      // Error en el login - determinar si es error de credenciales o del servidor
      const errorMessage = result.message || "Error en el login";
      const statusCode = result.status || 500;

      // Errores específicos basados en el código de estado
      switch (statusCode) {
        case 401:
          return {
            error: "Credenciales incorrectas. Verifica tu email y contraseña.",
          };
        case 404:
          return { error: "Usuario no encontrado. ¿Necesitas registrarte?" };
        case 429:
          return {
            error:
              "Demasiados intentos. Por favor espera antes de intentar nuevamente.",
          };
        case 500:
          return { error: "Error interno del servidor. Intenta más tarde." };
        default:
          return { error: errorMessage };
      }
    }
  } catch (error) {
    console.error("Error durante el login:", error);

    // Distinguir entre diferentes tipos de errores
    if (error instanceof z.ZodError) {
      // Error de validación que se escapó
      const fieldErrors: Record<string, string[]> = {};
      error.errors.forEach((err) => {
        const field = err.path[0] as string;
        if (!fieldErrors[field]) {
          fieldErrors[field] = [];
        }
        fieldErrors[field].push(err.message);
      });

      return {
        error: "Datos de formulario inválidos",
        fieldErrors,
      };
    }

    // Error genérico del servidor
    return { error: "Error interno del servidor. Por favor intenta de nuevo." };
  }
}

// Verifica si ya hay token, y si lo hay redirige al dashboard
async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
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
