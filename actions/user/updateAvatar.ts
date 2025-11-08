"use server";

import { parsedEnv } from "@/app/env";
import { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { revalidatePath } from "next/cache";
import { UpdateUserAvatarDto } from "@/types/dto/User/updateUserAvatarDto";
import { User } from "@/types";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";
import { getServerAxios } from "@/lib/axios";

export async function updateAvatar({
  userId,
  avatar,
}: UpdateUserAvatarDto): Promise<SuccessReponse<User> | ErrorResponse> {
  const session = await getSession();
  const companyId = await getCompanyId();

  // Early validation so global middleware/interceptor can handle 401 uniformly
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

  // Validate avatar
  if (!avatar || avatar.trim() === "") {
    return {
      message: "El avatar es requerido.",
      status: 400,
    };
  }

  try {
    const axiosInstance = getServerAxios(
      parsedEnv.API_URL,
      session || undefined
    );
    const url = `/companies/${encodeURIComponent(companyId)}/users/${encodeURIComponent(
      userId
    )}`;

    const body = {
      avatar: avatar.trim(),
    };

    const response = await axiosInstance.patch<User>(url, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status >= 200 && response.status < 300) {
      revalidatePath("/users");

      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
      };
    }

    return {
      message: `Unexpected status code: ${response.status}`,
      status: response.status,
    };
  } catch (error: unknown) {
    console.error("Error updating avatar:", error);

    if (isAxiosError(error)) {
      const err = error as any;
      return {
        message: err.response?.data?.message || err.message,
        code: err.code,
        status: err.response?.status ?? 500,
      };
    } else {
      return {
        message: "An unexpected error occurred while updating avatar.",
        status: 500,
      };
    }
  }
}
