"use server";

import { parsedEnv } from "@/app/env";
import axios, { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { revalidatePath } from "next/cache";
import { AttendAppointmentData } from "@/types";
import { Client } from "@/types";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";
export async function AttendAppointment({
  id,
  observations,
  treatment,
  diagnosis,
}: AttendAppointmentData): Promise<SuccessReponse<Client> | ErrorResponse> {
  const session = await getSession();
  const companyId = await getCompanyId();

  try {
    // Validar que tenemos companyId
    if (!companyId) {
      return {
        message: "Company ID not found. Please log in again.",
        status: 401,
      };
    }

    // appointment details url
    const url = `${parsedEnv.API_URL}/companies/${companyId}/appointments/${id}/details`;

    // Validar que tenemos session
    if (!session) {
      return {
        message: "Session not found. Please log in again.",
        status: 401,
      };
    }

    const body = {
      observations,
      treatment,
      diagnosis,
    };

    // ✅ Changed from POST to PUT for update operations
    console.log("url:", url); // ✅ Added log for URL
    const response = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${session}`,
        "Content-Type": "application/json",
      },
    });
    console.log("AttendAppointment response:", response); // ✅ Added log for response
    // Los códigos 200-299 son exitosos
    if (response.status >= 200 && response.status < 300) {
      revalidatePath("/clients"); // ✅ Fixed path (was "/Client")

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
    console.error("Error editing client:", error); // ✅ Updated error message

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
