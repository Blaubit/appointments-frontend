"use server";

import axios, { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { parsedEnv } from "@/app/env";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { Client } from "@/types";
import { getUser, getSession } from "@/actions/auth";

export async function findOne(
  id: string,
): Promise<SuccessReponse<Client> | ErrorResponse | any> {
  const User = await getUser();
  const session = await getSession();
  try {
    const companyId = User?.company.id;
    const url = `${parsedEnv.API_URL}/companies/${companyId}/clients/${id}`;

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
