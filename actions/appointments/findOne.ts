"use server";

import { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { parsedEnv } from "@/app/env";
import { Appointment } from "@/types";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";
import { getServerAxios } from "@/lib/axios";

export async function findOne(
  id: string
): Promise<SuccessReponse<Appointment> | ErrorResponse> {
  const companyId = await getCompanyId();
  const session = await getSession();

  // Validaciones tempranas para que la lógica global (middleware/interceptor) pueda manejar 401
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
    const url = `/companies/${companyId}/appointments/${encodeURIComponent(id)}`;

    const response = await axiosInstance.get<Appointment>(url);

    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
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
