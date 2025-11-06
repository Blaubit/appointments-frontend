"use server";

import axios, { isAxiosError } from "axios";
import { parsedEnv } from "@/app/env";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import parsePaginationParams from "@/utils/functions/parsePaginationParams";
import { User } from "@/types";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";

type Props = {
  searchParams?: URLSearchParams;
};

export async function findAllProfessionals(
  props: Props = {}
): Promise<SuccessReponse<User[]> | ErrorResponse | any> {
  const session = await getSession();
  const companyId = await getCompanyId();
  try {
    const url = `${parsedEnv.API_URL}/companies/${companyId}/users/professionals`;
    const parsedParams = parsePaginationParams(props.searchParams);
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${session}`,
      },
      params: {
        ...parsedParams,
        query: undefined,
      },
    });
    return {
      data: response.data,
      status: 200,
      statusText: response.statusText,
      meta: response.data.meta,
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
