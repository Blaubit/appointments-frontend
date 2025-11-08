"use server";

import { parsedEnv } from "@/app/env";
import { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { revalidatePath } from "next/cache";
import { UpdateUserDto } from "@/types/dto/User/updateUserDto";
import { User } from "@/types";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";
import { getServerAxios } from "@/lib/axios";

/**
 * updateUser:
 * - Ahora acepta opcionalmente professionalIds y secretaryIds para actualizar relaciones.
 * - Incluye en el body sólo los campos definidos. Si professionalIds/secretaryIds
 *   se pasan como [] también se incluirán (permite limpiar asignaciones).
 */
export async function updateUser({
  userId,
  email,
  password,
  avatar,
  fullName,
  bio,
  roleId,
  professionalIds,
  secretaryIds,
}: UpdateUserDto & {
  fullName?: string;
  bio?: string;
  roleId?: string;
  professionalIds?: string[] | undefined | null;
  secretaryIds?: string[] | undefined | null;
}): Promise<SuccessReponse<User> | ErrorResponse> {
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

  try {
    const axiosInstance = getServerAxios(
      parsedEnv.API_URL,
      session || undefined
    );
    const url = `/companies/${encodeURIComponent(companyId)}/users/${encodeURIComponent(
      userId
    )}`;

    // Construir el body solo con los campos que se van a actualizar.
    // Nota: para professionalIds/secretaryIds incluimos el campo si es !== undefined
    // (permitiendo arrays vacíos para limpiar asignaciones).
    const body: Partial<{
      email: string;
      password: string;
      avatar: string;
      fullName: string;
      bio: string;
      roleId: string;
      professionalIds: string[];
      secretaryIds: string[];
    }> = {};

    if (
      email !== undefined &&
      email !== null &&
      typeof email === "string" &&
      email.trim() !== ""
    ) {
      body.email = email.trim();
    }

    if (
      password !== undefined &&
      password !== null &&
      typeof password === "string" &&
      password.trim() !== ""
    ) {
      body.password = password;
    }

    if (
      avatar !== undefined &&
      avatar !== null &&
      typeof avatar === "string" &&
      avatar.trim() !== ""
    ) {
      body.avatar = avatar.trim();
    }

    if (
      fullName !== undefined &&
      fullName !== null &&
      typeof fullName === "string" &&
      fullName.trim() !== ""
    ) {
      body.fullName = fullName.trim();
    }

    if (bio !== undefined && bio !== null && typeof bio === "string") {
      // permitimos bio vacío (para limpiar la biografía)
      body.bio = bio.trim();
    }

    if (
      roleId !== undefined &&
      roleId !== null &&
      typeof roleId === "string" &&
      roleId.trim() !== ""
    ) {
      body.roleId = roleId.trim();
    }

    // Relaciones: incluimos si vienen definidas (aunque sean arrays vacíos).
    if (professionalIds !== undefined && professionalIds !== null) {
      body.professionalIds = Array.isArray(professionalIds)
        ? professionalIds
        : [];
    }

    if (secretaryIds !== undefined && secretaryIds !== null) {
      body.secretaryIds = Array.isArray(secretaryIds) ? secretaryIds : [];
    }

    // Validar que al menos un campo se está actualizando
    if (Object.keys(body).length === 0) {
      return {
        message: "No se proporcionaron campos para actualizar.",
        status: 400,
      };
    }

    const response = await axiosInstance.patch<User>(url, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Los códigos 200-299 son exitosos
    if (response.status >= 200 && response.status < 300) {
      // Revalidar ambas rutas por seguridad (profile y listado de usuarios)
      revalidatePath("/profile");
      revalidatePath("/settings?ta=users");

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
  } catch (error: unknown) {
    console.error("Error updating user:", error);

    if (isAxiosError(error)) {
      const err = error as any;
      return {
        message: err.response?.data?.message || err.message,
        code: err.code,
        status: err.response?.status ?? 500,
      };
    } else {
      return {
        message: "An unexpected error occurred.",
        status: 500,
      };
    }
  }
}

// Interface para updateProfile con todos los campos opcionales, ahora con relaciones
interface UpdateProfileParams {
  userId: string;
  email?: string;
  avatar?: string;
  fullName?: string;
  bio?: string;
  roleId?: string;
  professionalIds?: string[] | null;
  secretaryIds?: string[] | null;
}

// Función específica para actualizar el perfil (sin password)
export async function updateProfile({
  userId,
  email,
  avatar,
  fullName,
  bio,
  roleId,
  professionalIds,
  secretaryIds,
}: UpdateProfileParams): Promise<SuccessReponse<User> | ErrorResponse> {
  const session = await getSession();
  const companyId = await getCompanyId();

  // Early validation
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
    console.log("Updating profile for userId:", userId);
    const axiosInstance = getServerAxios(
      parsedEnv.API_URL,
      session || undefined
    );
    const url = `/companies/${encodeURIComponent(companyId)}/users/${encodeURIComponent(
      userId
    )}`;

    // Construir el body solo con los campos que tienen valores válidos
    const body: Partial<{
      email: string;
      avatar: string;
      fullName: string;
      bio: string;
      roleId: string;
      professionalIds: string[];
      secretaryIds: string[];
    }> = {};

    // Solo agregar campos que no sean undefined, null o string vacío (salvo bio)
    if (
      email !== undefined &&
      email !== null &&
      typeof email === "string" &&
      email.trim() !== ""
    ) {
      body.email = email.trim();
    }

    if (
      avatar !== undefined &&
      avatar !== null &&
      typeof avatar === "string" &&
      avatar.trim() !== ""
    ) {
      body.avatar = avatar.trim();
    }

    if (
      fullName !== undefined &&
      fullName !== null &&
      typeof fullName === "string" &&
      fullName.trim() !== ""
    ) {
      body.fullName = fullName.trim();
    }

    if (bio !== undefined && bio !== null && typeof bio === "string") {
      // Para bio permitimos string vacío (para limpiar la biografía)
      body.bio = bio.trim();
    }

    if (
      roleId !== undefined &&
      roleId !== null &&
      typeof roleId === "string" &&
      roleId.trim() !== ""
    ) {
      body.roleId = roleId.trim();
    }

    // Relaciones: incluimos si vienen definidas (permitiendo arrays vacíos para limpiar)
    if (professionalIds !== undefined && professionalIds !== null) {
      body.professionalIds = Array.isArray(professionalIds)
        ? professionalIds
        : [];
    }

    if (secretaryIds !== undefined && secretaryIds !== null) {
      body.secretaryIds = Array.isArray(secretaryIds) ? secretaryIds : [];
    }

    // Validar que al menos un campo se está actualizando
    if (Object.keys(body).length === 0) {
      return {
        message: "No se proporcionaron campos válidos para actualizar.",
        status: 400,
      };
    }

    const response = await axiosInstance.patch<User>(url, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Update profile response:", response.data);
    if (response.status >= 200 && response.status < 300) {
      revalidatePath("/profile");
      revalidatePath("/settings?ta=users");

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
    console.error("Error updating profile:", error);

    if (isAxiosError(error)) {
      const err = error as any;
      return {
        message: err.response?.data?.message || err.message,
        code: err.code,
        status: err.response?.status ?? 500,
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
  avatar: string
): Promise<SuccessReponse<User> | ErrorResponse> {
  return updateProfile({ userId, avatar });
}

// Función helper para actualizar solo el email
export async function updateEmail(
  userId: string,
  email: string
): Promise<SuccessReponse<User> | ErrorResponse> {
  return updateProfile({ userId, email });
}

// Función helper para actualizar solo el nombre completo
export async function updateFullName(
  userId: string,
  fullName: string
): Promise<SuccessReponse<User> | ErrorResponse> {
  return updateProfile({ userId, fullName });
}

// Función helper para actualizar solo la biografía
export async function updateBio(
  userId: string,
  bio: string
): Promise<SuccessReponse<User> | ErrorResponse> {
  return updateProfile({ userId, bio });
}

// Función helper para actualizar solo el rol
export async function updateRole(
  userId: string,
  roleId: string
): Promise<SuccessReponse<User> | ErrorResponse> {
  return updateProfile({ userId, roleId });
}
