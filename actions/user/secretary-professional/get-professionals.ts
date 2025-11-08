"use server";

import { parsedEnv } from "@/app/env";
import { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";
import { User } from "@/types";
import { getServerAxios } from "@/lib/axios";

/**
 * Obtiene todos los profesionales asignados a una secretaria.
 * @param secretaryId El ID de la secretaria.
 */
export async function getSecretaryProfessionals(
  secretaryId: string
): Promise<SuccessReponse<User[]> | ErrorResponse> {
  const companyId = await getCompanyId();
  const session = await getSession();

  // Early validation so global middleware/interceptor can handle 401 uniformly
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

  try {
    const axiosInstance = getServerAxios(
      parsedEnv.API_URL,
      session || undefined
    );
    const url = `/companies/${encodeURIComponent(
      companyId
    )}/secretary-professional-assignments/secretary/${encodeURIComponent(
      secretaryId
    )}/professionals`;

    const response = await axiosInstance.get<{ data: User[] }>(url);

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
  } catch (error: unknown) {
    console.error("Error fetching secretary professionals:", error);

    if (isAxiosError(error)) {
      const err = error as any;
      const errorMessage = err.response?.data?.message || err.message;
      const errorStatus = err.response?.status;

      return {
        message: errorMessage,
        code: err.code,
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
