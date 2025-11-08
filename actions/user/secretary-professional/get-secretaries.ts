"use server";

import { parsedEnv } from "@/app/env";
import { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";
import { User } from "@/types";
import { getServerAxios } from "@/lib/axios";

/**
 * Obtiene todas las secretarias asignadas a un profesional.
 * @param professionalId El ID del profesional.
 */
export async function getProfessionalSecretaries(
  professionalId: string
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
    )}/secretary-professional-assignments/professional/${encodeURIComponent(
      professionalId
    )}/secretaries`;

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
    console.error("Error fetching professional secretaries:", error);

    if (isAxiosError(error)) {
      const err = error as any;
      return {
        message: err.response?.data?.message || err.message,
        code: err.code,
        status: err.response?.status,
      };
    } else {
      return {
        message: "An unexpected error occurred.",
        status: 500,
      };
    }
  }
}
