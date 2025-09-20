"use server";

import axios, { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { LoginDto } from "@/types/dto/auth";
import { parsedEnv } from "@/app/env";

//interface
interface LostPasswordDto {
  email: string;
}

export async function LostPassword({
  email,
}: LostPasswordDto): Promise<SuccessReponse<string> | ErrorResponse> {
  try {
    const url = parsedEnv.API_URL + "/auth/lost-password";

    const response = await axios.post(url, {
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
