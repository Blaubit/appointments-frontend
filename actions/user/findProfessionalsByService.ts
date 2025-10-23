"use server";

import axios, { isAxiosError } from "axios";
import { parsedEnv } from "@/app/env";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { User } from "@/types";
import { getSession } from "@/actions/auth"; // Si necesitas sesión

type Props = {
  serviceId: string;
};

export async function findProfessionalsByService({
  serviceId,
}: Props): Promise<SuccessReponse<User[]> | ErrorResponse> {
  const session = await getSession(); // Si tu backend requiere auth por token
  // const companyId = await getCompanyId(); // Si necesitas companyId para el endpoint

  try {
    const url = `${parsedEnv.API_URL}/professional-services/service/${serviceId}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${session}`,
      },
    });
    return {
      data: response.data as User[],
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
