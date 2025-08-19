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
export default async function create({
  name,
  durationMinutes,
  price,
}: serviceDto): Promise<SuccessReponse<Appointment> | ErrorResponse> {
  const session = await getSession();
  const User = await getUser();
  try {
    const companyId = User?.company.id;
    const url = `${parsedEnv.API_URL}/companies/${companyId}/services`;
    const body = {
      name,
      durationMinutes,
      price,
    };
    console.log("Creating service at:", url);
    console.log("Request body:", body);
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
