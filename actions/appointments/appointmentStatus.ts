"use server";

import { parsedEnv } from "@/app/env";
import axios, { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { revalidatePath } from "next/cache";
import { Appointment } from "@/types/";
import { updateAppointmentStatusDto } from "@/types/dto/appointment/appointmentDto";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";
// actualizar estado de la cita
export async function update({
  appointmentId,
  status,
}: updateAppointmentStatusDto): Promise<
  SuccessReponse<Appointment> | ErrorResponse
> {
  const session = await getSession();
  const companyId = await getCompanyId();
  try {
    const url = `${parsedEnv.API_URL}/companies/${companyId}/appointments/${appointmentId}/status`;

    const body = {
      status,
    };
    const response = await axios.patch<Appointment>(url, body, {
      headers: {
        Authorization: `Bearer ${session}`,
      },
    });
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
