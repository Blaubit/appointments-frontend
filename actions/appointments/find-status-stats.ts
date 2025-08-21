"use server";

import axios, { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { parsedEnv } from "@/app/env";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import parsePaginationParams from "@/utils/functions/parsePaginationParams";
import { statusStats } from "@/types";
import { getUser } from "@/actions/auth/getUser";
import { getSession } from "../auth";

type Props = {
  searchParams?: URLSearchParams;
};

export default async function findStatusStats(
  props: Props = {},
): Promise<SuccessReponse<statusStats[]> | ErrorResponse | any> {
  const User = await getUser();
  const session = await getSession();
  try {
    const companyId = User?.company.id;
    const url = `${parsedEnv.API_URL}/companies/${companyId}/appointments/count-by-status`;
    const parsedParams = parsePaginationParams(props.searchParams);
    //console.log("url", url);
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${session}`,
      },
      params: {
        ...parsedParams,
        query: undefined,
        q: parsedParams.query,
      },
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
