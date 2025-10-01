"use server";

import axios, { isAxiosError } from "axios";
import { ErrorResponse } from "@/types/api";
import { parsedEnv } from "@/app/env";
import { Subscription } from "@/types";
import { getSession } from "@/actions/auth";
import SuccessResponse from "@/types/api/SuccessResponse";

export async function findCompanySubscription(
  id: string
): Promise<SuccessResponse<Subscription> | ErrorResponse> {
  const session = await getSession();
  try {
    const url = `${parsedEnv.API_URL}/companies/${id}/subscriptions/by-company`;
    if (!session) {
      return {
        message: "Session not found. Please log in again.",
        status: 401,
      };
    }

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${session}`,
      },
    });
    return {
      data: response.data.data[0],
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
