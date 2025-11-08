"use server";

import { isAxiosError } from "axios";
import { parsedEnv } from "@/app/env";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import parsePaginationParams from "@/utils/functions/parsePaginationParams";
import { User } from "@/types";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";
import { getServerAxios } from "@/lib/axios";

type Props = {
  searchParams?: URLSearchParams;
  page?: number;
  limit?: number;
  q?: string; // <-- El parámetro de búsqueda es "q"
  role?: string; // <-- El parámetro de filtro es "role"
};

const FALLBACK_META = {
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 5,
  hasNextPage: false,
  hasPreviousPage: false,
  nextPage: null,
  previousPage: null,
};

export async function findAll(
  props: Props = {}
): Promise<SuccessReponse<User[]> | ErrorResponse | any> {
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
    // Combinar parámetros de searchParams y props directos
    const parsedParams = parsePaginationParams(props.searchParams);

    // Obtener parámetros finales, priorizando props directos sobre searchParams
    const page = props.page || parsedParams.page || 1;
    const limit = props.limit ?? 5;
    const q = props.q || parsedParams.q || ""; // <-- Búsqueda por "q"
    const role = props.role || parsedParams.role || ""; // <-- Filtro por "role"

    const params: Record<string, any> = {
      page,
      limit,
    };
    if (q) params.q = q;
    if (role) params.role = role;

    const axiosInstance = getServerAxios(
      parsedEnv.API_URL,
      session || undefined
    );
    const url = `/companies/${encodeURIComponent(companyId)}/users`;

    const response = await axiosInstance.get(url, { params });

    return {
      data: response.data.data,
      status: response.status,
      statusText: response.statusText,
      meta: response.data.meta,
      stats: {
        total: response.data.meta?.totalItems ?? 0,
        active: response.data.stats?.active ?? 0,
        total_income: response.data.stats?.total_income ?? 0,
        total_Users: response.data.meta?.totalItems ?? 0,
      },
    };
  } catch (error: unknown) {
    console.error("user_find_all error:", error);
    if (isAxiosError(error)) {
      const err = error as any;
      return {
        message: err.response?.data?.message || err.message,
        code: err.code,
        status: err.response?.status || 500,
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
