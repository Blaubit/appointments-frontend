"use server";

import axios, { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { User } from "@/types";
import { parsedEnv } from "@/app/env";
import { getSession } from "@/actions/auth";

export default async function findMe(): Promise<
  SuccessReponse<User> | ErrorResponse
> {
  const session = await getSession();
  try {
    const url = `${parsedEnv.API_URL}/auth/me`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${session}`,
      },
    });

    return {
      data: response.data.data,
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
