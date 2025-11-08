"use server";

import { isAxiosError } from "axios";
import { parsedEnv } from "@/app/env";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { getSession } from "@/actions/auth";
import { getServerAxios } from "@/lib/axios";

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const changePassword = async (
  data: ChangePasswordRequest
): Promise<any | ErrorResponse> => {
  try {
    // Obtener la sesión del usuario
    const session = await getSession();

    if (!session) {
      return {
        message: "Session not found. Please log in again.",
        status: 401,
      };
    }

    // Validar que los datos existan
    if (!data.currentPassword || !data.newPassword) {
      return {
        message: "Current password and new password are required.",
        status: 400,
      };
    }

    // Validar que las contraseñas sean diferentes
    if (data.currentPassword === data.newPassword) {
      return {
        message: "New password must be different from current password.",
        status: 400,
      };
    }

    // Usar instancia server-side de axios con baseURL y token
    const axiosInstance = getServerAxios(
      parsedEnv.API_URL,
      session || undefined
    );

    const response = await axiosInstance.post(
      `/auth/change-password`,
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Validar que la respuesta sea exitosa
    if (response.status >= 200 && response.status < 300) {
      return {
        status: response.status,
        statusText: response.statusText,
      };
    }

    return {
      message: `Unexpected status code: ${response.status}`,
      status: response.status,
    };
  } catch (error) {
    console.error("Error changing password:", error);

    if (isAxiosError(error)) {
      const errorMessage =
        (error.response as any)?.data?.message ||
        error.message ||
        "Error changing password";
      const errorStatus = (error.response as any)?.status || 500;

      return {
        message: errorMessage,
        code: (error as any).code,
        status: errorStatus,
      };
    } else {
      return {
        message: "An unexpected error occurred.",
        status: 500,
      };
    }
  }
};
