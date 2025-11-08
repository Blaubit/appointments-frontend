"use server";

import { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { parsedEnv } from "@/app/env";
import { Subscription } from "@/types";
import { getSession } from "@/actions/auth";
import { getServerAxios } from "@/lib/axios";

export async function findCompanySubscription(
  id: string
): Promise<SuccessReponse<Subscription> | ErrorResponse> {
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
    const url = `/companies/${encodeURIComponent(id)}/subscriptions/by-company`;

    const response = await axiosInstance.get(url);

    return {
      data: response.data?.data?.[0],
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error: unknown) {
    console.error("findCompanySubscription error:", error);
    if (isAxiosError(error)) {
      return {
        message: (error as any).message,
        code: (error as any).code,
        status: (error as any).response?.status,
      };
    } else {
      return {
        message: "An unexpected error occurred.",
      };
    }
  }
}
