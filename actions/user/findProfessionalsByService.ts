"use server";

import { isAxiosError } from "axios";
import { parsedEnv } from "@/app/env";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { User } from "@/types";
import { getSession } from "@/actions/auth";
import { getServerAxios } from "@/lib/axios";

type Props = {
  serviceId: string;
};

export async function findProfessionalsByService({
  serviceId,
}: Props): Promise<SuccessReponse<User[]> | ErrorResponse> {
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
    const url = `/professional-services/service/${encodeURIComponent(serviceId)}`;

    const response = await axiosInstance.get<User[] | { data: User[] }>(url);

    // Support both response shapes: { data: User[] } or User[]
    const payload: User[] =
      (response.data as any)?.data ?? (response.data as any);

    return {
      data: payload,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error: unknown) {
    console.error("findProfessionalsByService error:", error);
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
