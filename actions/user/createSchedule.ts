"use server";

import { parsedEnv } from "@/app/env";
import axios, { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { revalidatePath } from "next/cache";
import { CreateScheduleDto } from "@/types/dto/User/createSchedule.dto";
import { ScheduleResponse } from "@/types";
import { getUser, getSession } from "@/actions/auth";

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
  sundayEnd
}: CreateScheduleDto): Promise<SuccessReponse<ScheduleResponse> | ErrorResponse> {
  const session = await getSession();
  try {
    const url = `${parsedEnv.API_URL}/availabilities`;
    // Validar que tenemos session
    if (!session) {
      return {
        message: "Session not found. Please log in again.",
        status: 401,
      };
    }

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
        sundayEnd
    };

    const response = await axios.post<ScheduleResponse>(url, body, {
      headers: {
        Authorization: `Bearer ${session}`,
        
      },
    });
    console.log("Response from create User:", response);
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
  } catch (error) {
    console.error("Error creating User:", error);

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
