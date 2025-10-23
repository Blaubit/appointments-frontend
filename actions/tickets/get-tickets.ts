"use server";

import axios, { isAxiosError } from "axios";
import { parsedEnv } from "@/app/env";

// Esta función obtiene todos los tickets del backend usando axios.
export async function getTickets() {
  try {
    // Asegúrate que parsedEnv.TICKETS_URL esté bien configurada
    const url = `${parsedEnv.TICKETS_URL}/tickets`;
    const response = await axios.get(url, {});
    // Devuelve directamente el array de tickets (data.data)
    return {
      data: response.data.data,
      count: response.data.count,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        message: error.response?.data?.message || error.message,
        code: error.code,
        status: error.response?.status,
      };
    } else {
      return {
        message: "An unexpected error occurred.",
      };
    }
  }
}
