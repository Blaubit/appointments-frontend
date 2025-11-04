"use server";

import axios, { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { User } from "@/types";
import { cookies } from "next/headers";
import { parsedEnv } from "@/app/env";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "./getCompanyId";
export default async function findOne(
  id: string
): Promise<SuccessReponse<User> | ErrorResponse> {
  const session = await getSession();
  const companyId = await getCompanyId();
  try {
    const url = `${parsedEnv.API_URL}/companies/${companyId}/users/${id}`;
    const response = await axios.get<User>(url, {
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
