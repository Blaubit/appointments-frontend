"use server";

import axios, { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { cookies } from "next/headers";
import { parsedEnv } from "@/app/env";
import { Company } from "@/types";

export async function findOne(
  id: string, // Cambiado a string para ser consistente con los IDs
): Promise<SuccessReponse<Company> | ErrorResponse> {
  try {
    const url = `${parsedEnv.API_URL}/companies/${id}`; // Corregido: era /:${id}
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;
    
    if (!session) {
      return {
        message: "Session not found. Please log in again.",
        status: 401,
      };
    }

    const response = await axios.get<Company>(url, {
      headers: {
        Authorization: `Bearer ${session}`,
      },
    });

    return {
      data: response.data,
      status: 200,
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