"use server";

import { isAxiosError } from "axios";
import { parsedEnv } from "@/app/env";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import parsePaginationParams from "@/utils/functions/parsePaginationParams";
import { Client } from "@/types";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";
import { getServerAxios } from "@/lib/axios";

type Props = {
  searchParams?: URLSearchParams;
  page?: number;
  limit?: number;
  q?: string;
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
): Promise<SuccessReponse<Client[]> | ErrorResponse | any> {
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
    const axiosInstance = getServerAxios(
      parsedEnv.API_URL,
      session || undefined
    );
    const parsedParams = parsePaginationParams(props.searchParams);

    const page = props.page ?? parsedParams.page ?? 1;
    const limit = props.limit ?? parsedParams.limit ?? 10;
    const q = props.q ?? parsedParams.q ?? "";

    const params: Record<string, any> = {
      page,
      limit,
    };
    if (q) params.q = q;

    const url = `/companies/${encodeURIComponent(companyId)}/clients`;
    const statsUrl = `${url}/statistics`;
    // Hacemos ambas peticiones en paralelo y manejamos fallos de forma aislada
    const [clientsResult, statsResult] = await Promise.allSettled([
      axiosInstance.get(url, { params }),
      axiosInstance.get(statsUrl),
    ]);
    if (clientsResult.status === "rejected") {
      // Si la petición principal falla, lanzamos para que el catch la maneje
      throw clientsResult.reason;
    }

    const clientsResponse = clientsResult.value;
    const statsResponse =
      statsResult.status === "fulfilled" ? statsResult.value : null;

    if (statsResult.status === "rejected") {
      console.warn(
        "findAllClients stats request failed:",
        (statsResult as any).reason
      );
    }

    return {
      data: clientsResponse.data?.data ?? [],
      status: clientsResponse.status,
      statusText: clientsResponse.statusText,
      meta: clientsResponse.data?.meta ?? FALLBACK_META,
      // agregamos stats (puede ser null si la petición de stats falló)
      stats: statsResponse?.data ?? null,
    };
  } catch (error: unknown) {
    console.error("findAllClients error:", error);
    if (isAxiosError(error)) {
      const err = error as any;
      return {
        message: err.response?.data?.message || err.message,
        code: err.code,
        status: err.response?.status || 500,
        data: [],
        meta: FALLBACK_META,
        stats: null,
      };
    } else {
      return {
        message: "An unexpected error occurred.",
        data: [],
        meta: FALLBACK_META,
        stats: null,
      };
    }
  }
}
