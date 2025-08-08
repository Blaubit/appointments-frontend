"use server";

import { parsedEnv } from "@/app/env";
import axios, { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { revalidatePath } from "next/cache";
import { appointmentDto } from "@/types/dto/appointment/appointmentDto";
import { Appointment } from "@/types/";


export default async function create({
    clientId,
    professionalId,
    serviceId,
    appointmentDate,
    startTime,
    status,
    notes = "",
}: appointmentDto): Promise<SuccessReponse<Appointment> | ErrorResponse> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;
    const User = cookieStore.get("user")?.value;
    const companyId = User ? JSON.parse(User).companyId : null;
    const url = `${parsedEnv.API_URL}/companies/${companyId}/appointments`;

    console.log("Fetching appointment from:", url);
    const body = {
        clientId,
        professionalId,
        serviceId,
        appointmentDate,
        startTime,
        status,
        notes,
    };
    console.log("Request body:", body); 
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