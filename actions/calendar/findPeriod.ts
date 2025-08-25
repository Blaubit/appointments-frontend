"use server";

import axios, { isAxiosError } from "axios";
import { parsedEnv } from "@/app/env";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { Client, ScheduleDay, ScheduleResponse } from "@/types";
import { getUser, getSession } from "@/actions/auth";

export async function findPeriod(
  userId: string,
  date: string,
  periodtype: "day" | "week" | "month" = "month",
): Promise<SuccessReponse<ScheduleResponse> | ErrorResponse | any> {
  const User = await getUser();
  const session = await getSession();
  if (!User) {
    return {
      message: "User not found",
      status: 404,
    };
  }
  try {
    const url = `${parsedEnv.API_URL}/availabilities/professional/${userId}/schedule/${periodtype}/${date}`;
    console.log(`findPeriod: ${url}`);
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
