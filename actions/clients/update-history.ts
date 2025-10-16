"use server";

import axios from "axios";
import { PatientRecord } from "@/types";
import { cleanPatientRecordForSubmit } from "@/types";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "../user/getCompanyId";
import { parsedEnv } from "@/app/env";

export async function updatePatientRecord(
  clientId: string,
  data: PatientRecord
) {
  const token = await getSession();
  const companyId = await getCompanyId();

  try {
    if (!token) {
      return {
        success: false,
        error: "No se encontró el token de autenticación",
      };
    }

    if (!companyId) {
      return {
        success: false,
        error: "No se encontró el ID de la compañía",
      };
    }

    // Limpiar los IDs antes de enviar
    const cleanedData = cleanPatientRecordForSubmit(data);

    const apiUrl = `${parsedEnv.API_URL}/companies/${companyId}/client-personal-info/${clientId}`;

    const response = await axios.patch(apiUrl, cleanedData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error("❌ Error al actualizar el registro del paciente:", error);

    if (axios.isAxiosError(error)) {
      console.error("Error response:", error.response?.data);

      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Error al actualizar el registro",
      };
    }

    return {
      success: false,
      error: "Error inesperado al actualizar el registro",
    };
  }
}
