"use server";

import { isAxiosError } from "axios";
import { parsedEnv } from "@/app/env";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { Service } from "@/types";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";
import { getServerAxios } from "@/lib/axios";

type Props = {
  searchParams?: URLSearchParams;
};

const FALLBACK_META = {
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 10,
  hasNextPage: false,
  hasPreviousPage: false,
  nextPage: null,
  previousPage: null,
};

export async function findAll(
  props: Props = {}
): Promise<SuccessReponse<Service[]> | ErrorResponse | any> {
  const session = await getSession();
  const companyId = await getCompanyId();

  // Early validation so global middleware/interceptor can handle 401 uniformly
  if (!companyId) {
    return {
      message: "Company ID not found. Please log in again.",
      status: 401,
      data: [],
      meta: FALLBACK_META,
    };
  }
  if (!session) {
    return {
      message: "Session not found. Please log in again.",
      status: 401,
      data: [],
      meta: FALLBACK_META,
    };
  }

  try {
    // Convertir URLSearchParams a objeto plano
    const searchParamsObject: Record<string, string> = {};
    if (props.searchParams) {
      props.searchParams.forEach((value, key) => {
        searchParamsObject[key] = value;
      });
    }

    // Solo tomar page, limit y q
    const params: Record<string, any> = {
      page: searchParamsObject.page || "1",
      limit: searchParamsObject.limit || "10",
    };
    if (searchParamsObject.q) {
      params.q = searchParamsObject.q;
    }

    // Use centralized server-side axios instance (baseURL + Authorization)
    const axiosInstance = getServerAxios(
      parsedEnv.API_URL,
      session || undefined
    );
    const url = `/companies/${encodeURIComponent(companyId)}/services`;

    const response = await axiosInstance.get(url, { params });

    return {
      data: response.data.data,
      status: response.status,
      statusText: response.statusText,
      meta: response.data.meta,
      stats: {
        total: response.data.meta?.totalItems ?? 0,
        active: 10,
        total_income: 5,
        total_appointments: 2,
      },
    };
  } catch (error: unknown) {
    console.error("Error in findAll services:", error);
    if (isAxiosError(error)) {
      return {
        message:
          (error as any).response?.data?.message || (error as any).message,
        code: (error as any).code,
        status: (error as any).response?.status || 500,
        data: [],
        meta: FALLBACK_META,
      };
    } else {
      return {
        message: "An unexpected error occurred.",
        data: [],
        meta: FALLBACK_META,
      };
    }
  }
}
