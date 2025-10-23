"use server";

import { parsedEnv } from "@/app/env";
import axios, { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";
import { User } from "@/types";

/**
 * Obtiene todos los profesionales asignados a una secretaria.
 * @param secretaryId El ID de la secretaria.
 */
export async function getSecretaryProfessionals(
  secretaryId: string
): Promise<SuccessReponse<User[]> | ErrorResponse> {
  const companyId = await getCompanyId();
  const session = await getSession();

  try {
    // Validar que tenemos companyId y session
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

    const url = `${parsedEnv.API_URL}/companies/${companyId}/secretary-professional-assignments/secretary/${secretaryId}/professionals`;

    const response = await axios.get<{ data: User[] }>(url, {
      headers: {
        Authorization: `Bearer ${session}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status >= 200 && response.status < 300) {
      return {
        data: response.data.data,
        status: response.status,
        statusText: response.statusText,
      };
    }

    return {
      message: `Unexpected status code: ${response.status}`,
      status: response.status,
    };
  } catch (error) {
    console.error("Error fetching secretary professionals:", error);

    if (isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      const errorStatus = error.response?.status;

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
}
