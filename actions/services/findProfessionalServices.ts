"use server";

import { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { parsedEnv } from "@/app/env";
import { ServiceProfessional } from "@/types";
import { getSession } from "@/actions/auth";
import { getServerAxios } from "@/lib/axios";

export async function findProfessionalServices(
  id: string
): Promise<SuccessReponse<ServiceProfessional> | ErrorResponse> {
  const session = await getSession();

  // Early validation so global middleware/interceptor can handle missing session uniformly
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
    const url = `/professional-services/professional/${encodeURIComponent(id)}`;

    const response = await axiosInstance.get<ServiceProfessional>(url);

    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error: unknown) {
    console.error("findProfessionalServices error:", error);
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
