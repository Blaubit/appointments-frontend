"use server";

import { parsedEnv } from "@/app/env";
import { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { revalidatePath } from "next/cache";
import { appointmentDto } from "@/types/dto/appointment/appointmentDto";
import { Appointment } from "@/types/";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";
import { getServerAxios } from "@/lib/axios";

export default async function create({
  clientId,
  professionalId,
  serviceId,
  appointmentDate,
  startTime,
  status,
  notes = "",
  amount,
}: appointmentDto): Promise<SuccessReponse<Appointment> | ErrorResponse> {
  const session = await getSession();
  const companyId = await getCompanyId();

  try {
    // Usamos getServerAxios con baseURL tomado de parsedEnv
    const axiosInstance = getServerAxios(
      parsedEnv.API_URL,
      session || undefined
    );

    // Con la baseURL ya seteada, enviamos la petición usando la ruta relativa
    const response = await axiosInstance.post<Appointment>(
      `/companies/${companyId}/appointments`,
      {
        clientId,
        professionalId,
        serviceId,
        appointmentDate,
        startTime,
        status,
        notes,
        amount,
      }
    );

    revalidatePath("/appointments");

    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error: unknown) {
    if (isAxiosError(error as any)) {
      const err = error as any;
      return {
        message: err.message,
        code: err.code,
        status: err.response?.status,
      };
    } else {
      return {
        message: "An unexpected error occurred.",
      };
    }
  }
}
