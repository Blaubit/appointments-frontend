"use server";

import { parsedEnv } from "@/app/env";
import axios, { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { revalidatePath } from "next/cache";
import { service } from "@/types/service";
import { getUser, getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";
type DeleteServiceRequest = {
  id: string;
};

export default async function deleteService({
  id,
}: DeleteServiceRequest): Promise<SuccessReponse<service> | ErrorResponse> {
  const session = await getSession();
  const companyId = await getCompanyId();
  try {
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
