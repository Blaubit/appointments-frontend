"use server";

import { parsedEnv } from "@/app/env";
import { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { revalidatePath } from "next/cache";
import { AttendAppointmentData } from "@/types";
import { Client } from "@/types";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";
import { getServerAxios } from "@/lib/axios";

export async function AttendAppointment({
  id,
  observations,
  treatment,
  diagnosis,
}: AttendAppointmentData): Promise<SuccessReponse<Client> | ErrorResponse> {
  const session = await getSession();
  const companyId = await getCompanyId();

  // Validaciones tempranas para que la lógica global (middleware/interceptor) pueda manejar 401
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

  try {
    const axiosInstance = getServerAxios(
      parsedEnv.API_URL,
      session || undefined
    );

    // appointment details url (ruta relativa, la baseURL la proporciona axiosInstance)
    const url = `/companies/${companyId}/appointments/${encodeURIComponent(id)}/details`;

    const body = {
      observations,
      treatment,
      diagnosis,
    };

    // Ejecutar petición (la instancia ya incluye el Authorization si session existe)
    console.log("AttendAppointment url:", url);
    const response = await axiosInstance.post(url, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("AttendAppointment response:", response);

    // Los códigos 200-299 son exitosos
    if (response.status >= 200 && response.status < 300) {
      revalidatePath("/clients");

      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
      };
    }

    // Si por alguna razón llegamos aquí con un código no exitoso
    return {
      message: `Unexpected status code: ${response.status}`,
      status: response.status,
    };
  } catch (error) {
    console.error("Error editing client (AttendAppointment):", error);

    if (isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      const errorStatus = error.response?.status;

      return {
        message: errorMessage,
        code: error.code,
        status: errorStatus,
      };
    } else {
      return {
        message: "An unexpected error occurred.",
        status: 500,
      };
    }
  }
}
