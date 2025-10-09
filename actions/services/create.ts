"use server";

import { parsedEnv } from "@/app/env";
import axios, { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { revalidatePath } from "next/cache";
import { serviceDto } from "@/types/dto/service/serviceDto";
import { Appointment } from "@/types/";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";

type CreateServiceDto = serviceDto;

export default async function create({
  name,
  durationMinutes,
  price,
  professionalsIds,
}: CreateServiceDto): Promise<SuccessReponse<Appointment> | ErrorResponse> {
  const session = await getSession();
  const companyId = await getCompanyId();
  try {
    const url = `${parsedEnv.API_URL}/companies/${companyId}/services`;
    const body: any = {
      name,
      durationMinutes,
      price,
    };

    if (professionalsIds && professionalsIds.length > 0) {
      body.professionalsIds = professionalsIds;
    }

    const response = await axios.post<Appointment>(url, body, {
      headers: {
        Authorization: `Bearer ${session}`,
      },
    });

    revalidatePath("/services");

    return {
      data: response.data,
      status: response.status,
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
