"use server";

import axios, { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { LoginDto } from "@/types/dto/auth";
import { cookies } from "next/headers";
import { parsedEnv } from "@/app/env";
import { LoginResponse } from "@/types";

export async function Login({
  email,
  password,
}: LoginDto): Promise<SuccessReponse<string> | ErrorResponse> {
  try {
    const url = parsedEnv.API_URL + "/auth/login";
    const response = await axios.post<LoginResponse>(url, {
      email,
      password,
    });
    const token = response.data.token;
    const cookieStore = await cookies();

    // Cookie de sesión segura
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: false, //process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      // No maxAge ni expires para que se borre al cerrar el navegador
    });

    return {
      data: "Logged in",
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
