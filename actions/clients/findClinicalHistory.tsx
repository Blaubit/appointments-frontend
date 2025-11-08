"use server";

import { isAxiosError } from "axios";
import { parsedEnv } from "@/app/env";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { ClinicalHistoryResponse } from "@/types";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";
import { getServerAxios } from "@/lib/axios";

export async function getClinicalHistory(
  clientId: string
): Promise<SuccessReponse<ClinicalHistoryResponse["data"]> | ErrorResponse> {
  const companyId = await getCompanyId();
  const session = await getSession();

  // Early validation so global handlers (middleware / client interceptor) can act on 401
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
    const url = `/companies/${companyId}/client-personal-info/${encodeURIComponent(
      clientId
    )}`;

    const response = await axiosInstance.get(url);

    return {
      data: response.data.data,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error: unknown) {
    console.error("getClinicalHistory error:", error);
    if (isAxiosError(error)) {
      return {
        message: error.message,
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
