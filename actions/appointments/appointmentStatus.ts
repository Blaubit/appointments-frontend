"use server";

import { parsedEnv } from "@/app/env";
import { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { revalidatePath } from "next/cache";
import { Appointment } from "@/types/";
import { updateAppointmentStatusDto } from "@/types/dto/appointment/appointmentDto";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";
import { getServerAxios } from "@/lib/axios";

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
    const url = `/companies/${companyId}/appointments/${appointmentId}/status`;

    // Instancia server-side de axios con baseURL y token (si existe)
    const axiosInstance = getServerAxios(
      parsedEnv.API_URL,
      session || undefined
    );

    const body = {
      status,
    };
    const response = await axiosInstance.patch<Appointment>(url, body);

    // Opcional: revalidar si es necesario
    try {
      revalidatePath("/appointments");
    } catch {}

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
