"use server";

import { parsedEnv } from "@/app/env";
import { isAxiosError } from "axios";
import { getServerAxios } from "@/lib/axios";

// Esta función obtiene todos los tickets del backend usando la instancia server-side centralizada.
export async function getTickets() {
  // Validación temprana para ayudar al diagnóstico si la URL no está configurada
  if (!parsedEnv.TICKETS_URL) {
    return {
      message: "TICKETS_URL is not configured in environment.",
      status: 500,
    };
  }

  try {
    // Usar la instancia centralizada para que se aplique la misma configuración/timeout/interceptors
    const axiosInstance = getServerAxios(parsedEnv.TICKETS_URL, undefined);
    const url = `/tickets`;

    const response = await axiosInstance.get(url);

    return {
      data: response.data.data,
      count:
        response.data.count ??
        (Array.isArray(response.data.data) ? response.data.data.length : 0),
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error: unknown) {
    console.error("getTickets error:", error);
    if (isAxiosError(error)) {
      return {
        message:
          (error as any).response?.data?.message || (error as any).message,
        code: (error as any).code,
        status: (error as any).response?.status,
      };
    } else {
      return {
        message: "An unexpected error occurred.",
      };
    }
  }
}
