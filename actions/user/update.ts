"use server";

import { parsedEnv } from "@/app/env";
import axios, { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { revalidatePath } from "next/cache";
import { UpdateUserDto } from "@/types/dto/User/updateUserDto";
import { User } from "@/types";

export async function updateUser({
  userId,
  email,
  password,
  avatar,
}: UpdateUserDto): Promise<SuccessReponse<User> | ErrorResponse> {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user")?.value;
    const companyId = userCookie ? JSON.parse(userCookie).companyId : null;

    // Validar que tenemos companyId
    if (!companyId) {
      return {
        message: "Company ID not found. Please log in again.",
        status: 401,
      };
    }

    // Construir la URL correctamente
    const url = `${parsedEnv.API_URL}/companies/${companyId}/users/${userId}`;
    const session = cookieStore.get("session")?.value;

    // Validar que tenemos session
    if (!session) {
      return {
        message: "Session not found. Please log in again.",
        status: 401,
      };
    }

    // Construir el body solo con los campos que se van a actualizar
    const body: Partial<{
      email: string;
      password: string;
      avatar: string;
    }> = {};

    if (email !== undefined && email !== null) body.email = email;
    if (password !== undefined && password !== null) body.password = password;
    if (avatar !== undefined && avatar !== null) body.avatar = avatar;

    // Validar que al menos un campo se está actualizando
    if (Object.keys(body).length === 0) {
      return {
        message: "No se proporcionaron campos para actualizar.",
        status: 400,
      };
    }

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
    console.error("Error updating user:", error);

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
        message: "An unexpected error occurred.",
        status: 500,
      };
    }
  }
}

// Interface para updateProfile con todos los campos opcionales
interface UpdateProfileParams {
  userId: string;
  email?: string;
  avatar?: string;
  fullName?: string;
  bio?: string;
  roleId?: string;
}

// Función específica para actualizar el perfil (sin password)
export async function updateProfile({
  userId,
  email,
  avatar,
  fullName,
  bio,
  roleId,
}: UpdateProfileParams): Promise<SuccessReponse<User> | ErrorResponse> {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user")?.value;
    const companyId = userCookie ? JSON.parse(userCookie).companyId : null;

    if (!companyId) {
      return {
        message: "Company ID not found. Please log in again.",
        status: 401,
      };
    }

    const url = `${parsedEnv.API_URL}/companies/${companyId}/users/${userId}`;
    const session = cookieStore.get("session")?.value;

    if (!session) {
      return {
        message: "Session not found. Please log in again.",
        status: 401,
      };
    }

    // Construir el body solo con los campos que tienen valores válidos
    const body: Partial<{
      email: string;
      avatar: string;
      fullName: string;
      bio: string;
      roleId: string;
    }> = {};

    // Solo agregar campos que no sean undefined, null o string vacío
    if (email !== undefined && email !== null && email.trim() !== "") {
      body.email = email.trim();
    }

    if (avatar !== undefined && avatar !== null && avatar.trim() !== "") {
      body.avatar = avatar.trim();
    }

    if (fullName !== undefined && fullName !== null && fullName.trim() !== "") {
      body.fullName = fullName.trim();
    }

    if (bio !== undefined && bio !== null) {
      // Para bio permitimos string vacío (para limpiar la biografía)
      body.bio = bio.trim();
    }

    if (roleId !== undefined && roleId !== null && roleId.trim() !== "") {
      body.roleId = roleId.trim();
    }

    // Validar que al menos un campo se está actualizando
    if (Object.keys(body).length === 0) {
      return {
        message: "No se proporcionaron campos válidos para actualizar.",
        status: 400,
      };
    }
    const response = await axios.patch<User>(url, body, {
      headers: {
        Authorization: `Bearer ${session}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status >= 200 && response.status < 300) {
      revalidatePath("/profile");

      // Actualizar la cookie del usuario con los nuevos datos
      const updatedUser = response.data;
      if (userCookie) {
        try {
          const currentUser = JSON.parse(userCookie);
          const newUserData = { ...currentUser, ...updatedUser };

          cookieStore.set("user", JSON.stringify(newUserData), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7, // 7 días
          });
        } catch (cookieError) {
          console.error("Error updating user cookie:", cookieError);
          // No fallar la operación si no se puede actualizar la cookie
        }
      }

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
  } catch (error) {
    console.error("Error updating profile:", error);

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
        message: "An unexpected error occurred.",
        status: 500,
      };
    }
  }
}

// Función helper para actualizar solo el avatar
export async function updateAvatar(
  userId: string,
  avatar: string,
): Promise<SuccessReponse<User> | ErrorResponse> {
  return updateProfile({ userId, avatar });
}

// Función helper para actualizar solo el email
export async function updateEmail(
  userId: string,
  email: string,
): Promise<SuccessReponse<User> | ErrorResponse> {
  return updateProfile({ userId, email });
}

// Función helper para actualizar solo el nombre completo
export async function updateFullName(
  userId: string,
  fullName: string,
): Promise<SuccessReponse<User> | ErrorResponse> {
  return updateProfile({ userId, fullName });
}

// Función helper para actualizar solo la biografía
export async function updateBio(
  userId: string,
  bio: string,
): Promise<SuccessReponse<User> | ErrorResponse> {
  return updateProfile({ userId, bio });
}

// Función helper para actualizar solo el rol
export async function updateRole(
  userId: string,
  roleId: string,
): Promise<SuccessReponse<User> | ErrorResponse> {
  return updateProfile({ userId, roleId });
}
