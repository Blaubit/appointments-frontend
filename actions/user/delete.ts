"use server";

import { parsedEnv } from "@/app/env";
import { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { revalidatePath } from "next/cache";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";
import { getServerAxios } from "@/lib/axios"; // De tu axiosInterceptor.ts

/**
 * Elimina un usuario de la compañía actual
 * @param id - ID del usuario a eliminar
 * @returns Respuesta de éxito o error
 */
export async function deleteUser(
  id: string
): Promise<SuccessReponse<void> | ErrorResponse> {
  const companyId = await getCompanyId();
  const session = await getSession();

  // Early validations
  if (!companyId) {
    return {
      message: "Company ID not found. Please log in again.",
      status: 401,
    };
  }

  if (!session) {
    return {
      message: "Session not found. Please log in again.",
      status: 401,
    };
  }

  if (!id) {
    return {
      message: "User ID is required.",
      status: 400,
    };
  }

  try {
    // Usar tu getServerAxios con el token de sesión
    const axiosInstance = getServerAxios(
      parsedEnv.API_URL,
      session // aquí va tu token/sesión
    );

    const url = `/companies/${encodeURIComponent(companyId)}/users/${encodeURIComponent(id)}`;

    const response = await axiosInstance.delete<void>(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Validar respuesta exitosa (200-299)
    if (response.status >= 200 && response.status < 300) {
      // Revalidar la ruta de usuarios
      revalidatePath("/settings?ta=users");

      return {
        data: undefined,
        status: response.status,
        statusText: response.statusText,
      };
    }

    return {
      message: `Unexpected status code: ${response.status}`,
      status: response.status,
    };
  } catch (error: unknown) {
    console.error("Error deleting User:", error);

    if (isAxiosError(error)) {
      const err = error as any;
      return {
        message: err.response?.data?.message || err.message,
        code: err.code,
        status: err.response?.status ?? 500,
      };
    } else {
      return {
        message: "An unexpected error occurred.",
        status: 500,
      };
    }
  }
}
