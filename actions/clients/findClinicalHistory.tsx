"use server";

import axios, { isAxiosError } from "axios";
import { parsedEnv } from "@/app/env";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { ClinicalHistoryResponse } from "@/types";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";

export async function getClinicalHistory(
  clientId: string
): Promise<SuccessReponse<ClinicalHistoryResponse["data"]> | ErrorResponse> {
  const companyId = await getCompanyId();
  const session = await getSession();

  try {
    const url = `${parsedEnv.API_URL}/companies/${companyId}/client-personal-info/${clientId}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${session}`,
      },
    });

    return {
      data: response.data.data,
      status: 200,
      statusText: response.statusText,
    };
  } catch (error) {
    console.log(error);
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
