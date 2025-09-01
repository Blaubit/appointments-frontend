"use server";

import { parsedEnv } from "@/app/env";
import axios, { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { revalidatePath } from "next/cache";
import { appointmentDto } from "@/types/dto/appointment/appointmentDto";
import { Appointment } from "@/types/";
import { getUser, getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";
export default async function create({
  clientId,
  professionalId,
  serviceId,
  appointmentDate,
  startTime,
  status,
  notes = "",
}: appointmentDto): Promise<SuccessReponse<Appointment> | ErrorResponse> {
  const session = await getSession();
  const companyId = await getCompanyId();
  try {
    
    const url = `${parsedEnv.API_URL}/companies/${companyId}/appointments`;
    const body = {
      clientId,
      professionalId,
      serviceId,
      appointmentDate,
      startTime,
      status,
      notes,
    };
    const response = await axios.post<Appointment>(url, body, {
      headers: {
        Authorization: `Bearer ${session}`,
      },
    });

    revalidatePath("/appointments");

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
