"use server";

import { parsedEnv } from "@/app/env";
import axios, { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { revalidatePath } from "next/cache";
import { serviceDto } from "@/types/dto/service/serviceDto";
import { Appointment } from "@/types/";
import { updateServiceDto } from "@/types/dto/service/updateServiceDto";
import { service } from "@/types/service";

type DeleteServiceRequest = {
  id: string;
};

export default async function deleteService({
  id
}: DeleteServiceRequest): Promise<SuccessReponse<service> | ErrorResponse> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;
    const User = cookieStore.get("user")?.value;
    const companyId = User ? JSON.parse(User).companyId : null;
    const url = `${parsedEnv.API_URL}/companies/${companyId}/services/${id}`;

    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${session}`,
      },
    });
    revalidatePath("/services");
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
