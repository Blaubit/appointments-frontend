import axios from "axios";

const axiosClient = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "", // si usas baseURL
  withCredentials: true, // si necesitas enviar cookies
});

// Interceptor de respuestas para detectar 401 en cualquier petición cliente
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    try {
      const status =
        error?.response?.status ?? // axios typical
        error?.status ?? // posible shape
        (typeof error?.message === "string" && error.message.includes("401")
          ? 401
          : undefined);

      if (status === 401) {
        console.log(
          "Interceptor: detectado 401. Limpiando cookies y redirigiendo a /login",
          error
        );

        // Llamamos al endpoint server que borra cookies (necesario si las cookies son HttpOnly)
        try {
          await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
          });
        } catch (e) {
          console.log("Error llamando a /api/auth/logout", e);
        }

        // Redirigimos al login (recarga para limpiar estado cliente)
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    } catch (e) {
      console.log("Error manejando interceptor 401", e);
    }

    // Rechazamos la promesa para que el flujo de error original siga
    return Promise.reject(error);
  }
);

export default axiosClient;
