"use server";

import { parsedEnv } from "@/app/env";
import axios, { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { revalidatePath } from "next/cache";
import { Client } from "@/types";
import { getUser, getSession } from "@/actions/auth";

type DeleteClientRequest = {
  id: string;
};

export default async function deleteClient({
  id,
}: DeleteClientRequest): Promise<SuccessReponse<Client> | ErrorResponse> {
  const session = await getSession();
  const User = await getUser();
  try {
    const companyId = User?.company.id;
    const url = `${parsedEnv.API_URL}/companies/${companyId}/Clients/${id}`;

    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${session}`,
      },
    });
    revalidatePath("/Clients");
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
