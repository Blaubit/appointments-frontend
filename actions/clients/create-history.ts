"use server";

import axios from "axios";
import { PatientRecord } from "@/types";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "../user/getCompanyId";
import { parsedEnv } from "@/app/env";

export async function savePatientRecord(clientId: string, data: PatientRecord) {
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
    // URL del endpoint
    const apiUrl = `${parsedEnv.API_URL}/companies/${companyId}/client-personal-info/${clientId}`;

    // Hacer la petición con axios
    const response = await axios.post(apiUrl, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Response from savePatientRecord:", response);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error("Error al guardar el registro del paciente:", error);

    // Manejo de errores de axios
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Error al guardar el registro",
      };
    }

    return {
      success: false,
      error: "Error inesperado al guardar el registro",
    };
  }
}
