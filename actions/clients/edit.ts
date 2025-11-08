"use server";

import { parsedEnv } from "@/app/env";
import { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { revalidatePath } from "next/cache";
import { pacienteditFormData } from "@/types";
import { Client } from "@/types";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";
import { getServerAxios } from "@/lib/axios";

export default async function edit({
  id,
  fullName,
  email,
  phone,
}: pacienteditFormData): Promise<SuccessReponse<Client> | ErrorResponse> {
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

    // Validar que tenemos session
    if (!session) {
      return {
        message: "Session not found. Please log in again.",
        status: 401,
      };
    }

    // URL relativa (la baseURL la maneja la instancia)
    const url = `/companies/${companyId}/clients/${id}`;

    const body = {
      fullName,
      email,
      phone,
    };

    // Usar instancia server-side con baseURL y token
    const axiosInstance = getServerAxios(
      parsedEnv.API_URL,
      session || undefined
    );

    const response = await axiosInstance.patch<Client>(url, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

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
    console.error("Error editing client:", error);

    if (isAxiosError(error)) {
      const errorMessage =
        (error as any).response?.data?.message || error.message;
      const errorStatus = (error as any).response?.status;

      return {
        message: errorMessage,
        code: (error as any).code,
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
