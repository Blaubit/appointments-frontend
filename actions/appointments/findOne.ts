"use server";

import axios, { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { cookies } from "next/headers";
import { parsedEnv } from "@/app/env";
import { Appointment } from "@/types";

export default async function findOne(
  id: number,
): Promise<SuccessReponse<Appointment> | ErrorResponse> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;
    const User = cookieStore.get("user")?.value;
    const companyId = User ? JSON.parse(User).companyId : null;
    const url = `${parsedEnv.API_URL}/companies/${companyId}/appointments/${id}`;
    console.log("Fetching appointment from:", url);
    const response = await axios.get<Appointment>(url, {
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
