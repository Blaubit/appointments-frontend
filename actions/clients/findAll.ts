"use server";

import axios, { isAxiosError } from "axios";
import { parsedEnv } from "@/app/env";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import parsePaginationParams from "@/utils/functions/parsePaginationParams";
import { Client } from "@/types";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";

type Props = {
  searchParams?: URLSearchParams;
};

export async function findAll(
  props: Props = {},
): Promise<SuccessReponse<Client[]> | ErrorResponse | any> {
  const session = await getSession();
  const companyId = await getCompanyId();

  try {
    const url = `${parsedEnv.API_URL}/companies/${companyId}/clients`;

    const parsedParams = parsePaginationParams(props.searchParams);

    // Solo page y q para el backend (puedes agregar limit según tu paginación)
    const params: Record<string, any> = {};
    if (parsedParams.page) params.page = parsedParams.page;
    if (parsedParams.q) params.q = parsedParams.q;
    if (1) params.limit = 6; // Solo si lo usas

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${session}`,
      },
      params,
    });

    // La respuesta ya viene en el formato correcto
    return {
      data: response.data.data,
      meta: response.data.meta,
      searchInfo: response.data.searchInfo,
      status: 200,
      statusText: response.statusText,
    };
  } catch (error) {
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
