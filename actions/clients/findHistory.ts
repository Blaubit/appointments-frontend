"use server";

import { isAxiosError } from "axios";
import { parsedEnv } from "@/app/env";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import parsePaginationParams from "@/utils/functions/parsePaginationParams";
import { Appointment } from "@/types";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";
import { getServerAxios } from "@/lib/axios";

type Props = {
  searchParams?: URLSearchParams;
};

export async function findHistory(
  props: Props = {},
  id: string
): Promise<SuccessReponse<Appointment[]> | ErrorResponse | any> {
  const companyId = await getCompanyId();
  const session = await getSession();

  // Early validations so global handlers (middleware / interceptor) can act on 401
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

    // Use a relative URL; baseURL is provided by axiosInstance
    const url = `/companies/${companyId}/appointments/client/${encodeURIComponent(id)}/with-stats`;

    // Parse pagination/search params
    const paginationParams = parsePaginationParams(props.searchParams);

    const response = await axiosInstance.get(url, {
      params: paginationParams,
    });

    return {
      data: response.data.data,
      status: response.status,
      statusText: response.statusText,
      meta: response.data.meta,
      stats: response.data.stats?.client,
    };
  } catch (error: unknown) {
    console.error("findHistory error:", error);
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
