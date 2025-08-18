"use server";

import axios, { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { parsedEnv } from "@/app/env";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import parsePaginationParams from "@/utils/functions/parsePaginationParams";
import { Appointment } from "@/types";
import { getUser, getSession } from "@/actions/auth";

type Props = {
  searchParams?: URLSearchParams;
};

export default async function findAll(
  props: Props = {},
): Promise<SuccessReponse<Appointment[]> | ErrorResponse | any> {
  const User = await getUser();
  const session = await getSession();
  try {
    
    const companyId = User?.company.id;
    //const UserId = User ? JSON.parse(User).companyId : null;
    //const url = `${parsedEnv.API_URL}/companies/${companyId}/appointments/${User}`;
    const url = `${parsedEnv.API_URL}/companies/${companyId}/appointments/all-with-stats?limit=6`;
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
      stats: response.data.stats,
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
