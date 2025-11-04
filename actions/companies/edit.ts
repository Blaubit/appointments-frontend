"use server";

import { parsedEnv } from "@/app/env";
import axios, { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { revalidatePath } from "next/cache";
import { Company } from "@/types";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";

interface EditCompanyParams {
  id: string;
  name?: string;
  companyType?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  description?: string;
  phone?: string; // legacy
  phones?: { id?: string; phone: string }[]; // nuevo: array de objetos
}

export default async function edit({
  id,
  name,
  companyType,
  address,
  city,
  state,
  postalCode,
  country,
  description,
  phone,
  phones,
}: EditCompanyParams): Promise<SuccessReponse<Company> | ErrorResponse> {
  const session = await getSession();
  const companyId = await getCompanyId();
  try {
    if (!companyId) {
      return {
        message: "Company ID not found. Please log in again.",
        status: 401,
      };
    }

    const url = `${parsedEnv.API_URL}/companies/${id}`;

    if (!session) {
      return {
        message: "Session not found. Please log in again.",
        status: 401,
      };
    }

    const body: Partial<{
      name: string;
      companyType: string;
      address: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      description: string;
      phone: string;
      phones: { id?: string; phone: string }[];
    }> = {};

    if (name !== undefined && name !== null && name.trim() !== "") {
      body.name = name.trim();
    }

    if (
      companyType !== undefined &&
      companyType !== null &&
      companyType.trim() !== ""
    ) {
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

    if (
      postalCode !== undefined &&
      postalCode !== null &&
      postalCode.trim() !== ""
    ) {
      body.postalCode = postalCode.trim();
    }

    if (country !== undefined && country !== null && country.trim() !== "") {
      body.country = country.trim();
    }

    if (description !== undefined && description !== null) {
      body.description = description.trim();
    }

    // phones: acepta el array de objetos si se proporciona (incluye [] para limpiar)
    if (phones !== undefined) {
      if (Array.isArray(phones)) {
        // Normalizar cada objeto: trim a phone y mantener id si existe
        body.phones = phones.map((p) => ({
          ...(p.id ? { id: p.id } : {}),
          phone: p.phone ? p.phone.trim() : p.phone,
        }));
      } else {
        console.warn(
          "edit_company: 'phones' debe ser un array de objetos {id?, phone}"
        );
      }
    }

    // phone (legacy): incluir solo si no es string vacío
    if (phone !== undefined && phone !== null && phone.trim() !== "") {
      body.phone = phone.trim();
    }

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

    if (response.status >= 200 && response.status < 300) {
      revalidatePath("/settings");
      revalidatePath("/dashboard");

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
