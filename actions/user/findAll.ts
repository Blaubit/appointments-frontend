"use server";

import axios, { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { parsedEnv } from "@/app/env";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import parsePaginationParams from "@/utils/functions/parsePaginationParams";
import { User } from "@/types";
import { getUser, getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";

type Props = {
  searchParams?: URLSearchParams;
  page?: number;
  limit?: number;
  q?: string; // <-- El parámetro de búsqueda es "q"
  role?: string; // <-- El parámetro de filtro es "role"
};

export async function findAll(
  props: Props = {}
): Promise<SuccessReponse<User[]> | ErrorResponse | any> {
  const session = await getSession();
  const companyId = await getCompanyId();
  try {
    // Combinar parámetros de searchParams y props directos
    const parsedParams = parsePaginationParams(props.searchParams);

    // Obtener parámetros finales, priorizando props directos sobre searchParams
    const page = props.page || parsedParams.page || 1;
    const limit = 5;
    const q = props.q || parsedParams.q || ""; // <-- Búsqueda por "q"
    const role = props.role || ""; // <-- Filtro por "role"
    const url = `${parsedEnv.API_URL}/companies/${companyId}/users`;

    const finalParams: any = {
      page,
      limit,
    };
    if (q) {
      finalParams.q = q; // <-- Agrega "q" si existe
    }
    if (role) {
      finalParams.role = role; // <-- Agrega "role" si existe
    }

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${session}`,
      },
      params: finalParams,
    });

    return {
      data: response.data.data,
      status: 200,
      statusText: response.statusText,
      meta: response.data.meta,
      stats: {
        total: response.data.meta.totalItems,
        active: 10,
        total_income: 5,
        total_Users: 2,
      },
    };
  } catch (error) {
    console.log(error);
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
