"use server";

import axios, { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse, User } from "@/types";
import { cookies } from "next/headers";
import { parsedEnv } from "@/app/env";

export default async function findOne(
  id: number,
): Promise<SuccessReponse<User> | ErrorResponse> {
  try {
    const url = `${parsedEnv.API_URL}/users/${id}`;
    const session = cookies().get("session")?.value;
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
