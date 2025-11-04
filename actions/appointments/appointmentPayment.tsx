"use server";

import { parsedEnv } from "@/app/env";
import axios, { isAxiosError } from "axios";
import { revalidatePath } from "next/cache";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { Appointment } from "@/types/";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";

export default async function updateAppointmentPayment(payload: {
  id: string;
  paymentStatus?: string;
  paymentMethod?: string;
  paymentDate?: string;
  paymentReference?: string;
}): Promise<SuccessReponse<Appointment> | ErrorResponse> {
  const { id, paymentStatus, paymentMethod, paymentDate, paymentReference } =
    payload;

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

    const url = `${parsedEnv.API_URL}/companies/${companyId}/appointments/${encodeURIComponent(
      id
    )}`;

    // Construir body solo con los campos de pago proporcionados
    const body: any = {};
    if (paymentStatus !== undefined) body.paymentStatus = paymentStatus;
    if (paymentMethod !== undefined) body.paymentMethod = paymentMethod;
    if (paymentDate !== undefined) body.paymentDate = paymentDate;
    if (paymentReference !== undefined)
      body.paymentReference = paymentReference;
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
