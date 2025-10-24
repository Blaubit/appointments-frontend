"use server";

import axios, { isAxiosError } from "axios";
import { parsedEnv } from "@/app/env";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { Service } from "@/types";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";

type Props = {
  // Accept multiple shapes to be resilient when called from client: string | URLSearchParams | Record
  searchParams?: URLSearchParams | string | Record<string, any>;
};

export async function findAll(
  props: Props = {}
): Promise<SuccessReponse<Service[]> | ErrorResponse | any> {
  const session = await getSession();
  const companyId = await getCompanyId();

  try {
    const url = `${parsedEnv.API_URL}/companies/${companyId}/subscriptions`;

    // Normalize incoming searchParams into a URLSearchParams instance
    let localUrlSearchParams = new URLSearchParams();
    if (props.searchParams) {
      if (typeof props.searchParams === "string") {
        localUrlSearchParams = new URLSearchParams(props.searchParams);
      } else if (props.searchParams instanceof URLSearchParams) {
        localUrlSearchParams = props.searchParams;
      } else if (typeof props.searchParams === "object") {
        // plain object (e.g., serialised from client)
        Object.entries(props.searchParams).forEach(([k, v]) => {
          if (v === undefined || v === null) return;
          localUrlSearchParams.set(k, String(v));
        });
      }
    }
    // Convertir URLSearchParams a objeto
    const searchParamsObject: Record<string, string> = {};
    localUrlSearchParams.forEach((value, key) => {
      searchParamsObject[key] = value;
    });

    // Construir params que enviaremos al backend respetando page/limit/q/status
    const params: Record<string, any> = {
      page: searchParamsObject.page ? Number(searchParamsObject.page) : 1,
      limit: searchParamsObject.limit ? Number(searchParamsObject.limit) : 10,
    };

    // Soportar 'q' o 'search'
    if (searchParamsObject.q) {
      params.q = searchParamsObject.q;
    } else if (searchParamsObject.search) {
      params.q = searchParamsObject.search;
    }

    if (searchParamsObject.status && searchParamsObject.status !== "all") {
      params.status = searchParamsObject.status;
    }

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${session}`,
      },
      params,
    });

    // Respuesta del backend (esperamos data + meta)
    return {
      data: response.data.data,
      status: 200,
      statusText: response.statusText,
      meta: response.data.meta,
      stats: {
        total: response.data.meta?.totalItems ?? 0,
        active: response.data.stats?.active ?? 0,
        total_income: response.data.stats?.total_income ?? 0,
        total_appointments: response.data.stats?.total_appointments ?? 0,
      },
    };
  } catch (error) {
    console.error("[findAllSubscriptions] error ->", error);
    if (isAxiosError(error)) {
      return {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: [],
        meta: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPreviousPage: false,
          nextPage: null,
          previousPage: null,
        },
      };
    } else {
      return {
        message: "An unexpected error occurred.",
        data: [],
        meta: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPreviousPage: false,
          nextPage: null,
          previousPage: null,
        },
      };
    }
  }
}
