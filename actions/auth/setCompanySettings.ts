"use server";

import { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { cookies } from "next/headers";
import { parsedEnv } from "@/app/env";
import { getServerAxios } from "@/lib/axios";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";

export async function SetCompanySettings(): Promise<
  SuccessReponse<string> | ErrorResponse
> {
  const session = await getSession();
  const companyId = await getCompanyId();

  // Validaciones tempranas para que la lógica global pueda manejar 401
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
    // Usar instancia server-side con baseURL y token
    const axiosInstance = getServerAxios(
      parsedEnv.API_URL,
      session || undefined
    );
    const url = `/companies/${companyId}/settings/current`;

    const response = await axiosInstance.get(url);

    const token = JSON.stringify(response.data);
    const cookieStore = await cookies();
    // Cookie de configuración de la empresa (HttpOnly)
    cookieStore.set("CompanySettings", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      // No maxAge ni expires para que se borre al cerrar el navegador
    });

    return {
      data: "Company settings set",
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
