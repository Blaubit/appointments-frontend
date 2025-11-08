"use server";

import { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { ScheduleResponse } from "@/types";
import { parsedEnv } from "@/app/env";
import { getSession } from "@/actions/auth";
import { getServerAxios } from "@/lib/axios";

export default async function findAvailabilities(
  id: string
): Promise<SuccessReponse<ScheduleResponse> | ErrorResponse> {
  const session = await getSession();

  // Early validation so global middleware/interceptor can handle 401 uniformly
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
    const url = `/availabilities/professional/${encodeURIComponent(id)}`;

    const response = await axiosInstance.get<ScheduleResponse>(url);

    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error: unknown) {
    console.error("findAvailabilities error:", error);
    if (isAxiosError(error)) {
      const err = error as any;
      return {
        message: err.response?.data?.message || err.message,
        code: err.code,
        status: err.response?.status || 500,
      };
    } else {
      return {
        message: "An unexpected error occurred.",
        status: 500,
      };
    }
  }
}
