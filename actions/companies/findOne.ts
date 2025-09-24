"use server";

import axios, { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { parsedEnv } from "@/app/env";
import { Company } from "@/types";
import { getSession } from "@/actions/auth";

export async function findOne(
  id: string // Cambiado a string para ser consistente con los IDs
): Promise<SuccessReponse<Company> | ErrorResponse> {
  const session = await getSession();
  try {
    const url = `${parsedEnv.API_URL}/companies/${id}`; // Corregido: era /:${id
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
