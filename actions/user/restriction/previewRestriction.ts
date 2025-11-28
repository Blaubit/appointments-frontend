"use server";

import { parsedEnv } from "@/app/env";
import axios, { isAxiosError } from "axios";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { revalidatePath } from "next/cache";

export type RestrictionPreviewFormData = {
  professionalId: string;
  restrictionDate: string[]; // ["2025-11-26", "2025-11-28"]
  startTime?: string;
  endTime?: string;
};

type RestrictionMode = "preview" | "create";

export async function createRestriction({
  professionalId,
  restrictionDate,
  startTime,
  endTime,
  mode = "preview",
}: RestrictionPreviewFormData & { mode?: RestrictionMode }): Promise<
  SuccessReponse<any> | ErrorResponse
> {
  const companyId = await getCompanyId();
  const session = await getSession();

  try {
    if (!companyId) {
      return {
        message: "Company ID not found.  Please log in again.",
        status: 401,
      };
    }

    if (!session) {
      return {
        message: "Session not found. Please log in again.",
        status: 401,
      };
    }

    if (!professionalId) {
      return {
        message: "professionalId is required.",
        status: 400,
      };
    }

    if (!Array.isArray(restrictionDate) || restrictionDate.length === 0) {
      return {
        message:
          'restrictionDate must be a non-empty array of "YYYY-MM-DD" strings.',
        status: 400,
      };
    }

    // Construir la URL según el modo
    const endpoint =
      mode === "preview"
        ? `/companies/${companyId}/availabilities/restrictions/preview`
        : `/companies/${companyId}/availabilities/restrictions`;

    const url = `${parsedEnv.API_URL}${endpoint}`;

    const body: any = {
      professionalId,
      restrictionDate,
    };
    if (startTime) body.startTime = startTime;
    if (endTime) body.endTime = endTime;

    const response = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${session}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status >= 200 && response.status < 300) {
      // Revalidate paths after creating restrictions
      if (mode === "create") {
        revalidatePath("/appointments");
        revalidatePath("/dashboard");
      }

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
    console.error(
      `Error ${mode === "preview" ? "previewing" : "creating"} restriction:`,
      error
    );

    if (isAxiosError(error)) {
      const errorMessage =
        (error.response?.data as any)?.message || error.message;
      const errorStatus = error.response?.status;

      return {
        message: errorMessage,
        code: error.code,
        status: errorStatus,
      };
    }

    return {
      message: "An unexpected error occurred.",
      status: 500,
    };
  }
}

// Mantener compatibilidad con el nombre anterior
export async function create(
  data: RestrictionPreviewFormData
): Promise<SuccessReponse<any> | ErrorResponse> {
  return createRestriction({ ...data, mode: "preview" });
}
