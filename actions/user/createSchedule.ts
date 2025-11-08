"use server";

import { parsedEnv } from "@/app/env";
import { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { revalidatePath } from "next/cache";
import { CreateScheduleDto } from "@/types/dto/User/createSchedule.dto";
import { ScheduleResponse } from "@/types";
import { getSession } from "@/actions/auth";
import { getServerAxios } from "@/lib/axios";

export async function create({
  professionalId,
  mondayStart,
  mondayEnd,
  tuesdayStart,
  tuesdayEnd,
  wednesdayStart,
  wednesdayEnd,
  thursdayStart,
  thursdayEnd,
  fridayStart,
  fridayEnd,
  saturdayStart,
  saturdayEnd,
  sundayStart,
  sundayEnd,
}: CreateScheduleDto): Promise<
  SuccessReponse<ScheduleResponse> | ErrorResponse
> {
  const session = await getSession();

  // Early validation so global middleware/interceptor can handle 401 uniformly
  if (!session) {
    return {
      message: "Session not found. Please log in again.",
      status: 401,
    };
  }

  try {
    const axiosInstance = getServerAxios(
      parsedEnv.API_URL,
      session || undefined
    );
    const url = `/availabilities`;

    const body = {
      professionalId,
      mondayStart,
      mondayEnd,
      tuesdayStart,
      tuesdayEnd,
      wednesdayStart,
      wednesdayEnd,
      thursdayStart,
      thursdayEnd,
      fridayStart,
      fridayEnd,
      saturdayStart,
      saturdayEnd,
      sundayStart,
      sundayEnd,
    };

    const response = await axiosInstance.post<ScheduleResponse>(url, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Los códigos 200-299 son exitosos
    if (response.status >= 200 && response.status < 300) {
      revalidatePath("/settings?tab=schedule");

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
    console.error("Error creating schedule:", error);

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
