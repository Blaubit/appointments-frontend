"use server";

import { isAxiosError } from "axios";
import { parsedEnv } from "@/app/env";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { Service } from "@/types";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";
import { getServerAxios } from "@/lib/axios";

type Props = {
  // aceptar string | URLSearchParams | objeto plano para robustez al llamar desde paciente
  searchParams?: URLSearchParams | string | Record<string, any>;
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

export async function findAllPayments(
  props: Props = {}
): Promise<SuccessReponse<Service[]> | ErrorResponse | any> {
  const session = await getSession();
  // companyId no usado en payments endpoint actual, pero lo mantenemos por consistencia
  const companyId = await getCompanyId();

  // Early validations so global handlers can act on 401 uniformly
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
    // Normalize incoming searchParams into a URLSearchParams instance
    let localUrlSearchParams = new URLSearchParams();
    if (props.searchParams) {
      if (typeof props.searchParams === "string") {
        localUrlSearchParams = new URLSearchParams(props.searchParams);
      } else if (props.searchParams instanceof URLSearchParams) {
        localUrlSearchParams = props.searchParams;
      } else if (typeof props.searchParams === "object") {
        Object.entries(props.searchParams).forEach(([k, v]) => {
          if (v === undefined || v === null) return;
          localUrlSearchParams.set(k, String(v));
        });
      }
    }

    // Convertir a objeto para facilidad de uso
    const searchParamsObject: Record<string, string> = {};
    localUrlSearchParams.forEach((value, key) => {
      searchParamsObject[key] = value;
    });

    // Construir parámetros para la API
    const params: Record<string, any> = {
      page: searchParamsObject.page ? Number(searchParamsObject.page) : 1,
      limit: searchParamsObject.limit ? Number(searchParamsObject.limit) : 7,
    };

    if (searchParamsObject.q) {
      params.q = searchParamsObject.q;
    } else if (searchParamsObject.search) {
      params.q = searchParamsObject.search;
    }

    if (searchParamsObject.status && searchParamsObject.status !== "all") {
      params.status = searchParamsObject.status;
    }

    // Use centralized server-side axios instance (baseURL + Authorization)
    const axiosInstance = getServerAxios(
      parsedEnv.API_URL,
      session || undefined
    );
    const url = `/payments`;

    const response = await axiosInstance.get(url, {
      params,
    });

    return {
      data: response.data.data,
      status: response.status,
      statusText: response.statusText,
      meta: response.data.meta,
      stats: {
        total: response.data.meta?.totalItems ?? 0,
        // valores fallback si backend no devuelve stats concretas
        active: response.data.stats?.active ?? 0,
        total_income: response.data.stats?.total_income ?? 0,
        total_appointments: response.data.stats?.total_appointments ?? 0,
      },
    };
  } catch (error: unknown) {
    console.error("[findAllPayments] error ->", error);
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
