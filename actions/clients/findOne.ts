"use server";

import axios, { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { parsedEnv } from "@/app/env";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { Client } from "@/types";

export async function findOne(
  id: string,
): Promise<SuccessReponse<Client> | ErrorResponse | any> {
  try {
    const cookieStore = await cookies();
    const User = cookieStore.get("user")?.value;
    const companyId = User ? JSON.parse(User).companyId : null;
    const url = `${parsedEnv.API_URL}/companies/${companyId}/clients/${id}`;
    const session = cookieStore.get("session")?.value;
    
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${session}`,
      },
    });

    return {
      data: response.data,
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
