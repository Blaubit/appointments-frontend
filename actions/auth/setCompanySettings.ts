"use server";

import axios, { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { LoginDto } from "@/types/dto/auth";
import { cookies } from "next/headers";
import { parsedEnv } from "@/app/env";
import { LoginResponse } from "@/types";
import getSession from "./getSession";

import { getCompanyId } from "../user/getCompanyId";

export async function SetCompanySettings(): Promise<
  SuccessReponse<string> | ErrorResponse
> {
  const session = await getSession();
  const companyId = await getCompanyId();
  try {
    const url = parsedEnv.API_URL + `/companies/${companyId}/settings/current`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${session}` },
    });
    const token = JSON.stringify(response.data);
    const cookieStore = await cookies();
    // Cookie de sesión segura
    cookieStore.set("CompanySettings", token, {
      httpOnly: true,
      secure: false, //process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      // No maxAge ni expires para que se borre al cerrar el navegador
    });

    return {
      data: "Company settings set",
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
