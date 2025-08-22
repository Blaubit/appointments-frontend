"use server";

import { parsedEnv } from "@/app/env";
import axios, { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { revalidatePath } from "next/cache";
import { ClientEditFormData } from "@/types";
import { Client } from "@/types";
import { getUser, getSession } from "@/actions/auth";

export default async function edit({
  id,
  fullName,
  email,
  phone,
}: ClientEditFormData): Promise<SuccessReponse<Client> | ErrorResponse> {
  const session = await getSession();
  const User = await getUser();
  
  try {
    const companyId = User?.company.id;

    // Validar que tenemos companyId
    if (!companyId) {
      return {
        message: "Company ID not found. Please log in again.",
        status: 401,
      };
    }

    // ✅ Fixed: Removed the extra colon before id
    const url = `${parsedEnv.API_URL}/companies/${companyId}/clients/${id}`;

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

    // ✅ Changed from POST to PUT for update operations
    const response = await axios.patch<Client>(url, body, {
      headers: {
        Authorization: `Bearer ${session}`,
        "Content-Type": "application/json",
      },
    });

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