"use server";

import axios, { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { cookies } from "next/headers";
import { parsedEnv } from "@/app/env";
import { Appointment } from "@/types";
import { getUser, getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";
export default async function findOne(
  id: string,
): Promise<SuccessReponse<Appointment> | ErrorResponse> {
  const companyId = await getCompanyId();
  const session = await getSession();
  try {
    const url = `${parsedEnv.API_URL}/companies/${companyId}/appointments/${id}`;

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
