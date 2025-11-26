"use server";

import { isAxiosError } from "axios";
import { parsedEnv } from "@/app/env";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { ScheduleResponse } from "@/types";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";
import { getServerAxios } from "@/lib/axios";

export async function findPeriod(
  userId: string,
  date: string,
  periodtype: "day" | "week" | "month" = "month"
): Promise<SuccessReponse<ScheduleResponse> | ErrorResponse | any> {
  const companyId = await getCompanyId();
  const session = await getSession();

  // Validaciones tempranas para permitir que la lógica global (middleware/interceptor) maneje 401
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

    const url = `/availabilities/professional/${encodeURIComponent(
      userId
    )}/schedule/${periodtype}/${encodeURIComponent(date)}`;

    const response = await axiosInstance.get(url);

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
