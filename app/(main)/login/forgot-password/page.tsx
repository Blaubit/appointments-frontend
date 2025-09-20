import { Metadata } from "next";
import { redirect } from "next/navigation";
import ForgotPasswordClient from "./page.client";
import { LostPassword } from "@/actions/auth/forgot-password";

// Metadata para SEO
export const metadata: Metadata = {
  title: "Recuperar contraseña | Planit",
  description:
    "Recupera el acceso a tu cuenta de Planit. Te enviaremos un enlace para restablecer tu contraseña de forma segura.",
  keywords: [
    "recuperar contraseña",
    "reset password",
    "planit",
    "olvide contraseña",
  ],
  robots: "noindex, nofollow", // No indexar páginas de auth por seguridad
};

// Función para obtener metadata del servidor
function getServerMetadata() {
  return {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    version: process.env.npm_package_version || "1.0.0",
  };
}

// Server Action para manejar el envío del email de recuperación
async function sendResetEmail(formData: FormData) {
  "use server";

  const email = formData.get("email") as string;

  // Validación básica del servidor
  if (!email || !email.includes("@")) {
    return {
      error: "Por favor ingresa un correo electrónico válido",
    };
  }

  try {
    const result = await LostPassword({ email });

    if (!result.status || result.status >= 400) {
      return {
        error: "Error al enviar el email de recuperación",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error al procesar solicitud de recuperación:", error);

    return {
      error: "Ocurrió un error interno. Por favor intenta de nuevo más tarde.",
    };
  }
}

// Server Component principal
export default async function ForgotPasswordPage() {
  // Metadata del servidor
  const serverMetadata = getServerMetadata();

  // TODO: Verificar si el usuario ya está autenticado
  // Si está logueado, redirigir al dashboard
  /*
  const session = await getServerSession();
  if (session?.user) {
    redirect("/dashboard");
  }
  */

  return (
    <ForgotPasswordClient
      serverAction={sendResetEmail}
      serverMetadata={serverMetadata}
    />
  );
}

// Configuración adicional de la página
export const dynamic = "force-dynamic"; // Siempre renderizar dinámicamente
export const revalidate = 0; // No cachear esta página
