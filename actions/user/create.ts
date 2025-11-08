"use server";

import { parsedEnv } from "@/app/env";
import { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { revalidatePath } from "next/cache";
import { CreateUserDto } from "@/types/dto/User/createUserDto";
import { User } from "@/types";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";
import { getServerAxios } from "@/lib/axios";

/**
 * Ahora CreateUserDto puede (opcionalmente) contener:
 * - password?: string
 * - theme?: string
 * - professionalIds?: string[]
 * - secretaryIds?: string[]
 *
 * Esta función solo agrega esos campos al body si vienen presentes.
 */
export async function create({
  roleId,
  fullName,
  email,
  bio,
  password,
  theme,
  professionalIds,
  secretaryIds,
}: CreateUserDto & {
  password?: string;
  theme?: string;
  professionalIds?: string[];
  secretaryIds?: string[];
}): Promise<SuccessReponse<User> | ErrorResponse> {
  const companyId = await getCompanyId();
  const session = await getSession();

  // Early validations so global middleware/interceptor can handle 401 consistently
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
    // Use centralized server-side axios instance (baseURL + Authorization)
    const axiosInstance = getServerAxios(
      parsedEnv.API_URL,
      session || undefined
    );
    const url = `/companies/${encodeURIComponent(companyId)}/Users`;

    const body: any = {
      roleId,
      fullName,
      email,
      bio,
    };

    // Campos opcionales nuevos según el nuevo contrato de la API
    if (password) body.password = password;
    if (theme) body.theme = theme;
    if (Array.isArray(professionalIds) && professionalIds.length > 0)
      body.professionalIds = professionalIds;
    if (Array.isArray(secretaryIds) && secretaryIds.length > 0)
      body.secretaryIds = secretaryIds;

    const response = await axiosInstance.post<User>(url, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Los códigos 200-299 son exitosos
    if (response.status >= 200 && response.status < 300) {
      revalidatePath("/settings?ta=users");

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
  } catch (error: unknown) {
    console.error("Error creating User:", error);

    if (isAxiosError(error)) {
      const err = error as any;
      return {
        message: err.response?.data?.message || err.message,
        code: err.code,
        status: err.response?.status ?? 500,
      };
    } else {
      return {
        message: "An unexpected error occurred.",
        status: 500,
      };
    }
  }
}
