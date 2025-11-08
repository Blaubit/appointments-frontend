import axios from "axios";

// Cliente para browser (usa NEXT_PUBLIC_API_URL)
export const browserAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  withCredentials: true, // enviar cookies si las usas en el cliente
});

// Detectar 401 en cualquier respuesta cliente y forzar logout
browserAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    try {
      const status =
        error?.response?.status ??
        error?.status ??
        (typeof error?.message === "string" && error.message.includes("401")
          ? 401
          : undefined);

      if (status === 401) {
        console.log(
          "browserAxios interceptor: detectado 401. Llamando a /api/auth/logout y redirigiendo a /login",
          error
        );

        // Llamar endpoint server que borra cookies (necesario si son HttpOnly)
        try {
          await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
          });
        } catch (e) {
          console.log("Error llamando a /api/auth/logout", e);
        }

        // Redirigir al login
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    } catch (e) {
      console.log("Error manejando interceptor 401", e);
    }
    return Promise.reject(error);
  }
);

// Helper para crear una instancia de axios en server (server actions / api routes).
// Le pasas el token de sesión si lo tienes. Usa parsedEnv en los server files.
export function getServerAxios(baseUrl: string, token?: string) {
  const instance = axios.create({
    baseURL: baseUrl,
  });

  if (token) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  // Opcional: puedes agregar interceptors server-side para logging si quieres
  return instance;
}
