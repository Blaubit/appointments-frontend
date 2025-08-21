"use server";

import { parsedEnv } from "@/app/env";
import axios, { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { revalidatePath } from "next/cache";
import { Company } from "@/types";

interface CreateCompanyParams {
  name: string;
  companyType: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  description?: string;
}

export default async function createCompany({
  name,
  companyType,
  address,
  city,
  state,
  postal_code,
  country,
  description,
}: CreateCompanyParams): Promise<SuccessReponse<Company> | ErrorResponse> {
  try {
    const url = `${parsedEnv.API_URL}/companies`;

    console.log("Creating company with URL:", url);

    // Para crear una empresa nueva, NO necesitamos session ni companyId
    // Esto debería ser un endpoint público para registro

    const body = {
      name: name.trim(),
      companyType: companyType,
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      postalCode: postal_code.trim(), // El DTO usa postalCode, no postal_code
      country: country.trim(),
      description: description?.trim() || "",
    };

    console.log("Company creation payload:", body);

    const response = await axios.post<Company>(url, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Company created successfully:", response.data);

    if (response.status >= 200 && response.status < 300) {
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
    console.error("Error creating company:", error);

    if (isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      const errorStatus = error.response?.status;

      // Manejar errores específicos
      if (errorStatus === 409) {
        return {
          message: "Ya existe una empresa con este nombre",
          status: errorStatus,
        };
      }

      if (errorStatus === 400) {
        return {
          message: errorMessage || "Datos de empresa inválidos",
          status: errorStatus,
        };
      }

      return {
        message: errorMessage,
        code: error.code,
        status: errorStatus,
      };
    } else {
      return {
        message: "An unexpected error occurred creating company.",
        status: 500,
      };
    }
  }
}
