"use server";

import { isAxiosError } from "axios";
import { PatientRecord } from "@/types";
import { cleanPatientRecordForSubmit } from "@/types";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "../user/getCompanyId";
import { parsedEnv } from "@/app/env";
import { getServerAxios } from "@/lib/axios";

export async function updatePatientRecord(
  clientId: string,
  data: PatientRecord
) {
  const token = await getSession();
  const companyId = await getCompanyId();

  // Early validations so global middleware/interceptor can handle 401 consistently
  if (!token) {
    return {
      success: false,
      error: "No se encontró el token de autenticación",
      status: 401,
    };
  }

  if (!companyId) {
    return {
      success: false,
      error: "No se encontró el ID de la compañía",
      status: 401,
    };
  }

  try {
    // Limpiar los IDs antes de enviar
    const cleanedData = cleanPatientRecordForSubmit(data);

    const axiosInstance = getServerAxios(parsedEnv.API_URL, token || undefined);
    const url = `/companies/${companyId}/client-personal-info/${encodeURIComponent(
      clientId
    )}`;

    const response = await axiosInstance.patch(url, cleanedData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error: unknown) {
    console.error("❌ Error al actualizar el registro del paciente:", error);

    if (isAxiosError(error)) {
      console.error("Error response:", (error as any).response?.data);

      return {
        success: false,
        error:
          (error as any).response?.data?.message ||
          (error as any).response?.data?.error ||
          (error as any).message ||
          "Error al actualizar el registro",
        status: (error as any).response?.status,
      };
    }

    return {
      success: false,
      error: "Error inesperado al actualizar el registro",
      status: 500,
    };
  }
}
