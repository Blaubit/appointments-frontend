"use server";

import { parsedEnv } from "@/app/env";
import axios, { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { revalidatePath } from "next/cache";
import { Company, CompanyRegistrationPayload } from "@/types";
import { getSession, getUser } from "@/actions/auth";

export default async function createCompany({
  // company data
  companyName: name,
  companyType,
  companyAddress: address,
  companyCity: city,
  companyState: state,
  companyPostalCode: postal_code,
  companyCountry: country,
  companyPhone: phone,
  companyDescription: description,
  //company admin data
  adminFullName,
  adminEmail,
  adminBio,
  // subscription data
  planId,
  startDate,
  endDate,
  createdById,
}: CompanyRegistrationPayload): Promise<
  SuccessReponse<Company> | ErrorResponse
> {
  const session = await getSession();
  try {
    const url = `${parsedEnv.API_URL}/registration/register`;

    // Para crear una empresa nueva, NO necesitamos session ni companyId
    // Esto debería ser un endpoint público para registro

    const body = {
      companyName: name.trim(),
      companyType: companyType,
      companyAddress: address.trim(),
      companyCity: city.trim(),
      companyState: state.trim(),
      companyPostalCode: postal_code.trim(),
      companyCountry: country.trim(),
      companyPhone: phone.trim(),
      companyDescription: description?.trim() || "",
      // Admin data
      adminFullName: adminFullName.trim(),
      adminEmail: adminEmail.trim(),
      adminBio: adminBio?.trim() || "",
      // Subscription data
      planId,
      startDate,
      endDate,
      createdById: createdById,
    };

    const response = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${session}`,
        "Content-Type": "application/json",
      },
    });

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
