"use server";

import { parsedEnv } from "@/app/env";
import { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { revalidatePath } from "next/cache";
import { Appointment } from "@/types/";
import { updateServiceDto } from "@/types/dto/service/updateServiceDto";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";
import { getServerAxios } from "@/lib/axios";

export default async function update({
  id,
  name,
  durationMinutes,
  price,
  professionalsIds,
}: updateServiceDto): Promise<SuccessReponse<Appointment> | ErrorResponse> {
  const session = await getSession();
  const companyId = await getCompanyId();

  // Early validation so global middleware/interceptor can handle 401 uniformly
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
    const axiosInstance = getServerAxios(
      parsedEnv.API_URL,
      session || undefined
    );
    const url = `/companies/${encodeURIComponent(companyId)}/services/${encodeURIComponent(id)}`;

    const body: any = {
      name,
      durationMinutes,
      price,
    };
    if (professionalsIds && professionalsIds.length > 0) {
      body.professionalsIds = professionalsIds;
    }

    const response = await axiosInstance.patch<Appointment>(url, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    revalidatePath("/services");

    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error: unknown) {
    console.error("update_service error:", error);
    if (isAxiosError(error)) {
      return {
        message: (error as any).response?.data?.message || error.message,
        code: (error as any).code,
        status: (error as any).response?.status,
      };
    } else {
      return {
        message: "An unexpected error occurred.",
        status: 500,
      };
    }
  }
}
