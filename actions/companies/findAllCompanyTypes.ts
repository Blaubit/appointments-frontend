"use server";

import axios, { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { parsedEnv } from "@/app/env";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import parsePaginationParams from "@/utils/functions/parsePaginationParams";
import { CompanyTypes } from "@/types";

type Props = {
  searchParams?: URLSearchParams;
};

export async function findAllCompanyTypes(
  props: Props = {},
): Promise<SuccessReponse<CompanyTypes[]> | ErrorResponse | any> {
  const cookieStore = await cookies();
  try {
    const url = `${parsedEnv.API_URL}/company-types`;
    const session = cookieStore.get("session")?.value || "";
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${session}`,
      },
    });
    
    return {
      data: response.data,
      status: 200,
      statusText: response.statusText,
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
