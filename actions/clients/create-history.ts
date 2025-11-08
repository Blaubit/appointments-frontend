"use server";

import { isAxiosError } from "axios";
import { PatientRecord } from "@/types";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "../user/getCompanyId";
import { parsedEnv } from "@/app/env";
import { getServerAxios } from "@/lib/axios";

export async function savePatientRecord(clientId: string, data: PatientRecord) {
  const token = await getSession();
  const companyId = await getCompanyId();

  // Validaciones tempranas para que la lógica global (middleware / interceptor) pueda manejar 401
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
    const axiosInstance = getServerAxios(parsedEnv.API_URL, token || undefined);
    const url = `/companies/${companyId}/client-personal-info/${encodeURIComponent(clientId)}`;

    console.log("=== CREATE PATIENT RECORD ===");
    console.log("API URL (relative):", url);
    console.log("Payload:", JSON.stringify(data, null, 2));

    // Enviar directamente el PatientRecord sin transformar
    const response = await axiosInstance.post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Response:", response.data);

    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error: unknown) {
    console.error("❌ Error al guardar el registro del paciente:", error);

    if (isAxiosError(error)) {
      console.error("Error response:", (error as any).response?.data);

      return {
        success: false,
        error:
          (error as any).response?.data?.message ||
          (error as any).message ||
          "Error al guardar el registro",
        status: (error as any).response?.status,
      };
    }

    return {
      success: false,
      error: "Error inesperado al guardar el registro",
      status: 500,
    };
  }
}
