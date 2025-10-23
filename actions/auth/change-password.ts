"use server";

import axios, { isAxiosError } from "axios";
import { parsedEnv } from "@/app/env";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { getSession } from "@/actions/auth";

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

    const response = await axios.post(
      `${parsedEnv.API_URL}/auth/change-password`,
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${session}`,
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
        error.response?.data?.message ||
        error.message ||
        "Error changing password";
      const errorStatus = error.response?.status || 500;

      return {
        message: errorMessage,
        code: error.code,
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
