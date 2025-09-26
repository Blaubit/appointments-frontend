"use server";

import axios, { isAxiosError } from "axios";
import { parsedEnv } from "@/app/env";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import parsePaginationParams from "@/utils/functions/parsePaginationParams";
import { Appointment } from "@/types";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";
type Props = {
  searchParams?: URLSearchParams;
};

export async function findHistory(
  props: Props = {},
  id: string
): Promise<SuccessReponse<Appointment[]> | ErrorResponse | any> {
  const companyId = await getCompanyId();
  const session = await getSession();

  try {
    const url = `${parsedEnv.API_URL}/companies/${companyId}/appointments/client/${id}/with-stats`;

    // Parsear parámetros de paginación
    const paginationParams = parsePaginationParams(props.searchParams);
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${session}`,
      },
      params: paginationParams,
    });

    return {
      data: response.data.data,
      status: 200,
      statusText: response.statusText,
      meta: response.data.meta,
      stats: response.data.stats.client,
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
