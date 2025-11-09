"use server";

import { isAxiosError } from "axios";
import { parsedEnv } from "@/app/env";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { CompanyTypes } from "@/types";
import { getSession } from "@/actions/auth";
import { getServerAxios } from "@/lib/axios";

/**
 * Obtiene todos los tipos de compañía disponibles.
 */
export async function findAllCompanyTypes(): Promise<
  SuccessReponse<CompanyTypes[]> | ErrorResponse
> {
  const session = await getSession();

  // Validación temprana para que el middleware global pueda manejar 401 de forma consistente
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
    const url = `/company-types`;

    const response = await axiosInstance.get<{ data: CompanyTypes[] }>(url);

    return {
      data: response.data?.data ?? [],
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error: unknown) {
    console.error("findAllCompanyTypes error:", error);
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
