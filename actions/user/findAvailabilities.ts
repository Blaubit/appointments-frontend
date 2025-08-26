"use server";

import axios, { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { ScheduleResponse } from "@/types";
import { cookies } from "next/headers";
import { parsedEnv } from "@/app/env";
import { getSession } from "@/actions/auth";
export default async function findAvailabilities(
  id: string,
): Promise<SuccessReponse<ScheduleResponse> | ErrorResponse> {
  const session = await getSession();
  try {
    const url = `${parsedEnv.API_URL}/availabilities/professional/${id}`;
    const response = await axios.get<ScheduleResponse>(url, {
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
