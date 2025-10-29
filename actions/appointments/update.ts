"use server";

import { parsedEnv } from "@/app/env";
import axios, { isAxiosError } from "axios";
import { revalidatePath } from "next/cache";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { Appointment } from "@/types/";
import { appointmentDto } from "@/types/dto/appointment/appointmentDto";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";

/*
  updateAppointment: realiza un PATCH a:
    /companies/{companyId}/appointments/:id

  Firma:
    export default async function update(
      appointment: appointmentDto & { id: string }
    ): Promise<SuccessReponse<Appointment> | ErrorResponse>

  Nota:
  - El body admite serviceId que puede ser string o string[]; si es array se envía como `serviceIds`
    (ajusta la clave si tu backend espera otro nombre).
  - Revalida "/appointments" y "/appointments/:id" tras una actualización exitosa.
*/

export default async function update(
  appointment: appointmentDto & { id: string }
): Promise<SuccessReponse<Appointment> | ErrorResponse> {
  const {
    id,
    clientId,
    professionalId,
    serviceId,
    appointmentDate,
    startTime,
    status,
    notes = "",
    amount,
  } = appointment;

  const session = await getSession();
  const companyId = await getCompanyId();

  try {
    if (!companyId) {
      return {
        message: "Company ID not found. Please log in again.",
        status: 401,
      };
    }
    if (!session) {
      return {
        message: "Session not found. Please log in again.",
        status: 401,
      };
    }
    if (!id) {
      return { message: "Appointment id is required for update.", status: 400 };
    }

    const url = `${parsedEnv.API_URL}/companies/${companyId}/appointments/${encodeURIComponent(id)}`;

    const body: any = {
      clientId,
      professionalId,
      appointmentDate,
      startTime,
      status,
      notes,
      amount,
    };

    if (Array.isArray(serviceId)) {
      body.serviceId = serviceId;
    } else if (serviceId !== undefined) {
      body.serviceId = serviceId;
    }
    console.log("Updating appointment with body:", body);
    const response = await axios.patch<Appointment>(url, body, {
      headers: {
        Authorization: `Bearer ${session}`,
        "Content-Type": "application/json",
      },
    });

    // Revalidar listado y detalle
    revalidatePath("/appointments");
    try {
      revalidatePath(`/appointments/${id}`);
    } catch {
      // evitar fallo si no existe la ruta de detalle como ISR/SSG
    }

    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        message: error.response?.data?.message || error.message,
        code: error.code,
        status: error.response?.status,
      };
    } else {
      return {
        message: "An unexpected error occurred.",
        status: 500,
      };
    }
  }
}
