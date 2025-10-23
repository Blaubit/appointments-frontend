"use server";

import { parsedEnv } from "@/app/env";
import axios, { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { revalidatePath } from "next/cache";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";

// DTO para el body
export interface CreateSecretaryProfessionalAssignmentsDto {
  secretaryId: string;
  professionals: string[];
  isActive?: boolean;
}

/**
 * Crea las asignaciones de una secretaria a varios doctores.
 * @param secretaryId El ID de la secretaria.
 * @param professionals Un array de IDs de doctores.
 * @param isActive Estado de la asignación (por defecto true).
 */
export async function create({
  secretaryId,
  professionals,
  isActive = true,
}: CreateSecretaryProfessionalAssignmentsDto): Promise<
  SuccessReponse<any> | ErrorResponse
> {
  const companyId = await getCompanyId();
  const session = await getSession();

  try {
    // Validar que tenemos companyId y session
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

    const url = `${parsedEnv.API_URL}/companies/${companyId}/secretary-professional-assignments`;

    const body = {
      secretaryId,
      professionals,
      isActive,
    };

    const response = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${session}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status >= 200 && response.status < 300) {
      revalidatePath("/settings?ta=users");
      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
      };
    }

    return {
      message: `Unexpected status code: ${response.status}`,
      status: response.status,
    };
  } catch (error) {
    console.error("Error creating secretary-professional assignments:", error);

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
