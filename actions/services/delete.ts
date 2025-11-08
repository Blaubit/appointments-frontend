"use server";

import { parsedEnv } from "@/app/env";
import { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { revalidatePath } from "next/cache";
import { service } from "@/types/service";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";
import { getServerAxios } from "@/lib/axios";

type DeleteServiceRequest = {
  id: string;
};

export default async function deleteService({
  id,
}: DeleteServiceRequest): Promise<SuccessReponse<service> | ErrorResponse> {
  const session = await getSession();
  const companyId = await getCompanyId();

  // Early validation so global middleware/interceptor can handle 401 consistently
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

    const response = await axiosInstance.delete(url);

    revalidatePath("/services");

    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error: unknown) {
    console.error("Error deleting service:", error);
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
