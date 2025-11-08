"use server";

import { parsedEnv } from "@/app/env";
import { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { revalidatePath } from "next/cache";
import { Company, CompanyRegistrationPayload } from "@/types";
import { getSession } from "@/actions/auth";
import { getServerAxios } from "@/lib/axios";

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
    // Este endpoint es público, pero si existe session la paso a la instancia.
    const axiosInstance = getServerAxios(
      parsedEnv.API_URL,
      session || undefined
    );
    const url = `/registration/register`;

    const body = {
      companyName: (name || "").trim(),
      companyType,
      companyAddress: (address || "").trim(),
      companyCity: (city || "").trim(),
      companyState: (state || "").trim(),
      companyPostalCode: (postal_code || "").trim(),
      companyCountry: (country || "").trim(),
      companyPhone: (phone || "").trim(),
      companyDescription: description?.trim() || "",
      // Admin data
      adminFullName: (adminFullName || "").trim(),
      adminEmail: (adminEmail || "").trim(),
      adminBio: adminBio?.trim() || "",
      // Subscription data
      planId,
      startDate,
      endDate,
      createdById,
    };

    const response = await axiosInstance.post(url, body, {
      headers: {
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
  } catch (error: unknown) {
    console.error("Error creating company:", error);

    if (isAxiosError(error)) {
      const errorMessage =
        (error as any).response?.data?.message || error.message;
      const errorStatus = (error as any).response?.status;

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
        code: (error as any).code,
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
