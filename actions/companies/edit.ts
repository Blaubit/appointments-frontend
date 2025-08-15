"use server";

import { parsedEnv } from "@/app/env";
import axios, { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { revalidatePath } from "next/cache";
import { Company } from "@/types";

// Interface para los parámetros de edición usando los nombres correctos del tipo Company
interface EditCompanyParams {
  id: string;
  name?: string;
  companyType?: string; // Corregido: usar companyType en lugar de companyType
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string; // Corregido: usar postal_code en lugar de postalCode
  country?: string;
  description?: string;
}

export default async function edit({
  id,
  name,
  companyType,
  address,
  city,
  state,
  postal_code,
  country,
  description,
}: EditCompanyParams): Promise<SuccessReponse<Company> | ErrorResponse> {
  try {
    const cookieStore = await cookies();
    const User = cookieStore.get("user")?.value;
    const companyId = User ? JSON.parse(User).companyId : null;

    // Validar que tenemos companyId
    if (!companyId) {
      return {
        message: "Company ID not found. Please log in again.",
        status: 401,
      };
    }

    // Corregir la URL - no debería tener `:` antes del id
    const url = `${parsedEnv.API_URL}/companies/${id}`;
    const session = cookieStore.get("session")?.value;
    console.log("url", url);
    
    // Validar que tenemos session
    if (!session) {
      return {
        message: "Session not found. Please log in again.",
        status: 401,
      };
    }

    // Construir el body solo con los campos que tienen valores válidos
    const body: Partial<{
      name: string;
      companyType: string;
      address: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
      description: string;
    }> = {};

    // Solo agregar campos que no sean undefined, null o string vacío
    if (name !== undefined && name !== null && name.trim() !== "") {
      body.name = name.trim();
    }
    
    if (companyType !== undefined && companyType !== null && companyType.trim() !== "") {
      body.companyType = companyType.trim();
    }
    
    if (address !== undefined && address !== null && address.trim() !== "") {
      body.address = address.trim();
    }
    
    if (city !== undefined && city !== null && city.trim() !== "") {
      body.city = city.trim();
    }
    
    if (state !== undefined && state !== null && state.trim() !== "") {
      body.state = state.trim();
    }
    
    if (postal_code !== undefined && postal_code !== null && postal_code.trim() !== "") {
      body.postal_code = postal_code.trim();
    }
    
    if (country !== undefined && country !== null && country.trim() !== "") {
      body.country = country.trim();
    }
    
    if (description !== undefined && description !== null) {
      body.description = description.trim();
    }

    // Validar que al menos un campo se está actualizando
    if (Object.keys(body).length === 0) {
      return {
        message: "No se proporcionaron campos válidos para actualizar.",
        status: 400,
      };
    }
    const response = await axios.patch<Company>(url, body, {
      headers: {
        Authorization: `Bearer ${session}`,
        "Content-Type": "application/json",
      },
    });

    // Los códigos 200-299 son exitosos
    if (response.status >= 200 && response.status < 300) {
      revalidatePath("/settings");
      revalidatePath("/dashboard");

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
    console.error("Error updating company:", error);

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