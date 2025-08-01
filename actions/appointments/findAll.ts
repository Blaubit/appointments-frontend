"use server";

import axios, { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { parsedEnv } from "@/app/env";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import parsePaginationParams from "@/utils/functions/parsePaginationParams";
import { Appointment } from "@/types";

type Props = {
  searchParams?: URLSearchParams;
};

export default async function findAll(
  props: Props = {},
): Promise<SuccessReponse<Appointment[]> | ErrorResponse | any> {
  try {
    const cookieStore = await cookies();
    const User = cookieStore.get("user")?.value;
    const companyId = User ? JSON.parse(User).companyId : null;
    const url = `${parsedEnv.API_URL}/companies/${companyId}/appointments`;
    const parsedParams = parsePaginationParams(props.searchParams);
    //console.log("url", url);
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${cookieStore.get("session")?.value || ""}`,
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
