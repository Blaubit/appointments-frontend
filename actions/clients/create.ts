"use server";

import { parsedEnv } from "@/app/env";
import { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { revalidatePath } from "next/cache";
import { ClientFormData } from "@/types";
import { Client } from "@/types";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";
import { getServerAxios } from "@/lib/axios";

export async function create({
  fullName,
  email,
  phone,
}: ClientFormData): Promise<SuccessReponse<Client> | ErrorResponse> {
  const companyId = await getCompanyId();
  const session = await getSession();

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
    const url = `/companies/${companyId}/clients`;
    const body = {
      fullName,
      email,
      phone,
    };

    // Instancia server-side de axios con baseURL y token
    const axiosInstance = getServerAxios(
      parsedEnv.API_URL,
      session || undefined
    );

    const response = await axiosInstance.post<Client>(url, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Los códigos 200-299 son exitosos
    if (response.status >= 200 && response.status < 300) {
      revalidatePath("/Client");

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
    console.error("Error creating client:", error);

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
