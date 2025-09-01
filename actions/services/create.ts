"use server";

import { parsedEnv } from "@/app/env";
import axios, { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { revalidatePath } from "next/cache";
import { serviceDto } from "@/types/dto/service/serviceDto";
import { Appointment } from "@/types/";
import { getUser } from "@/actions/auth/getUser";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";
export default async function create({
  name,
  durationMinutes,
  price,
}: serviceDto): Promise<SuccessReponse<Appointment> | ErrorResponse> {
  const session = await getSession();
  const companyId = await getCompanyId();
  try {
    const url = `${parsedEnv.API_URL}/companies/${companyId}/services`;
    const body = {
      name,
      durationMinutes,
      price,
    };
    const response = await axios.post<Appointment>(url, body, {
      headers: {
        Authorization: `Bearer ${session}`,
      },
    });

    revalidatePath("/services");

    return {
      data: response.data,
      status: response.status,
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
