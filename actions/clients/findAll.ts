"use server";

import axios, { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { parsedEnv } from "@/app/env";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import parsePaginationParams from "@/utils/functions/parsePaginationParams";
import { Client } from "@/types";
import { getUser, getSession } from "@/actions/auth";

type Props = {
  searchParams?: URLSearchParams;
};

export async function findAll(
  props: Props = {},
): Promise<SuccessReponse<Client[]> | ErrorResponse | any> {
  const session = await getSession();
  const User = await getUser();
  
  try {
    const companyId = User?.company.id;
    const url = `${parsedEnv.API_URL}/companies/${companyId}/clients`;
    
    // Convertir URLSearchParams a objeto para parsePaginationParams
    const searchParamsObject: Record<string, string> = {};
    if (props.searchParams) {
      props.searchParams.forEach((value, key) => {
        searchParamsObject[key] = value;
      });
    }

    // Construir parámetros para la API
    const params: Record<string, any> = {
      page: searchParamsObject.page || '1',
      limit: searchParamsObject.limit || '10',
    };

    // Agregar filtros opcionales
    if (searchParamsObject.search) {
      params.q = searchParamsObject.search;
    }
    
    if (searchParamsObject.status && searchParamsObject.status !== 'all') {
      params.status = searchParamsObject.status;
    }

    console.log("API URL:", url);
    console.log("API Params:", params);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${session}`,
      },
      params,
    });

    return {
      data: response.data.data,
      status: 200,
      statusText: response.statusText,
      meta: response.data.meta,
      stats: {
        total: response.data.meta.totalItems,
        confirmed: 10,
        pending: 5,
        cancelled: 2,
      },
    };
  } catch (error) {
    console.log("Error in findAll:", error);
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