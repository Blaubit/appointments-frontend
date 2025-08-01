"use server";

import { parsedEnv } from "@/app/env";
import axios, { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { revalidatePath } from "next/cache";
import { ClientEditFormData } from "@/types";
import { Client } from "@/types";

export default async function edit({
  id,
  fullName,
  email,
  phone,
}: ClientEditFormData): Promise<SuccessReponse<Client> | ErrorResponse> {
  try {
    const cookieStore = await cookies();
    const User = cookieStore.get("user")?.value;
    const companyId = User ? JSON.parse(User).companyId : null;
    
    // Validar que tenemos companyId
    if (!companyId) {
      return {
        message: "Company ID not found. Please log in again.",
        status: 401,
      };
    }

    const url = `${parsedEnv.API_URL}/companies/${companyId}/clients/:${id}`;
    const session = cookieStore.get("session")?.value;
    console.log("url", url)
    // Validar que tenemos session
    if (!session) {
      return {
        message: "Session not found. Please log in again.",
        status: 401,
      };
    }

    const body = {
      fullName,
      email,
      phone,
    };

    const response = await axios.post<Client>(url, body, {
      headers: {
        Authorization: `Bearer ${session}`,
        'Content-Type': 'application/json',
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