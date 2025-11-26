"use server";

import { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { User } from "@/types";
import { parsedEnv } from "@/app/env";
import { getSession } from "@/actions/auth";
import { getServerAxios } from "@/lib/axios";

export default async function findMe(): Promise<
  SuccessReponse<User> | ErrorResponse
> {
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
    const url = `/auth/me`;
    const response = await axiosInstance.get(url);
    return {
      data: response.data.data,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error: unknown) {
    console.error("findMe error:", error);
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
