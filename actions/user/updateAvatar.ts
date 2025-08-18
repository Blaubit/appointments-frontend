"use server";

import { parsedEnv } from "@/app/env";
import axios, { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { revalidatePath } from "next/cache";
import { UpdateUserAvatarDto } from "@/types/dto/User/updateUserAvatarDto";
import { User } from "@/types";
import { getUser, getSession } from "@/actions/auth";

export async function updateAvatar({
  userId,
  avatar,
}: UpdateUserAvatarDto): Promise<SuccessReponse<User> | ErrorResponse> {
  const session = await getSession();
  const User = await getUser();
  try {
    
    const companyId = User?.company.id;

    // Validar que tenemos companyId
    if (!companyId) {
      return {
        message: "Company ID not found. Please log in again.",
        status: 401,
      };
    }

    // Construir la URL correctamente
    const url = `${parsedEnv.API_URL}/companies/${companyId}/users/${userId}`;
    // Validar que tenemos session
    if (!session) {
      return {
        message: "Session not found. Please log in again.",
        status: 401,
      };
    }

    // Validar que el avatar no esté vacío
    if (!avatar || avatar.trim() === "") {
      return {
        message: "El avatar es requerido.",
        status: 400,
      };
    }

    // Body con solo el avatar
    const body = {
      avatar: avatar.trim(),
    };

    console.log("Updating user avatar:", { userId, avatar: body.avatar });

    const response = await axios.patch<User>(url, body, {
      headers: {
        Authorization: `Bearer ${session}`,
        "Content-Type": "application/json",
      },
    });

    // Los códigos 200-299 son exitosos
    if (response.status >= 200 && response.status < 300) {
      revalidatePath("/profile");
      revalidatePath("/users");

      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
      };
    }

    // Si por alguna razón llegamos aquí con un código no exitoso
    return {
      message: `Unexpected status code: ${response.status}`,
      status: response.status,
    };
  } catch (error) {
    console.error("Error updating avatar:", error);

    if (isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      const errorStatus = error.response?.status;

      return {
        message: errorMessage,
        code: error.code,
        status: errorStatus,
      };
    } else {
      return {
        message: "An unexpected error occurred while updating avatar.",
        status: 500,
      };
    }
  }
}
