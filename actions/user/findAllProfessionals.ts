"use server";

import axios, { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { parsedEnv } from "@/app/env";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import parsePaginationParams from "@/utils/functions/parsePaginationParams";
import { User } from "@/types";

type Props = {
  searchParams?: URLSearchParams;
};

export async function findAllProfessionals(
  props: Props = {},
): Promise<SuccessReponse<User[]> | ErrorResponse | any> {
  const cookieStore = await cookies();
  try {
    const User = cookieStore.get("user")?.value;
    const companyId = User ? JSON.parse(User).companyId : null;
    const url = `${parsedEnv.API_URL}/companies/${companyId}/users`;
    const parsedParams = parsePaginationParams(props.searchParams);
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
      data: response.data.data.filter(
        (user: User) => user.role.name === "profesional",
      ),
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
