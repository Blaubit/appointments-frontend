"use server";

import { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { parsedEnv } from "@/app/env";
import { getServerAxios } from "@/lib/axios";

//interface
interface LostPasswordDto {
  email: string;
}

export async function LostPassword({
  email,
}: LostPasswordDto): Promise<SuccessReponse<string> | ErrorResponse> {
  try {
    // Usamos la instancia server-side centralizada (no session necesaria para este endpoint público)
    const axiosInstance = getServerAxios(parsedEnv.API_URL);

    const response = await axiosInstance.post("/auth/lost-password", {
      email,
    });

    return {
      data: "Email sent",
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
