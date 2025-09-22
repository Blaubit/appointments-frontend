"use server";

import axios, { isAxiosError } from "axios";
import { parsedEnv } from "@/app/env";
import { ErrorResponse } from "@/types/api";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";

type ExportFormat = "pdf" | "excel" | "both";

type ExportOptions = {
  format?: ExportFormat;
  includeStatistics?: boolean;
  startDate?: string;
  endDate?: string;
};

type ExportSuccessResponse = {
  data: {
    success: boolean;
    message?: string;
    timestamp?: string;
    totalFiles?: number;
    files?: {
      pdf?: {
        filename: string;
        data: string;
        mimeType: string;
      };
      excel?: {
        filename: string;
        data: string;
        mimeType: string;
      };
    };
  };
  status: number;
};

type ExportErrorResponse = {
  message: string;
  code?: string;
  status: number;
};

export async function exportClients(
  options: ExportOptions = {}
): Promise<ExportSuccessResponse | ExportErrorResponse> {
  const session = await getSession();
  const companyId = await getCompanyId();

  try {
    const {
      format = "excel",
      includeStatistics = false,
      startDate,
      endDate,
    } = options;

    const url = `${parsedEnv.API_URL}/companies/${companyId}/clients/export`;

    const params: Record<string, any> = {
      format,
      includeStatistics: includeStatistics.toString(),
    };

    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${session}`,
      },
      params,
      responseType: format === "both" ? "json" : "arraybuffer",
    });

    // Si es formato 'both', la respuesta es JSON
    if (format === "both") {
      return {
        data: response.data,
        status: response.status,
      };
    }

    // Para PDF o Excel individual, convertir buffer a base64
    const buffer = Buffer.from(response.data);
    const base64Data = buffer.toString("base64");

    const contentDisposition = response.headers["content-disposition"];
    const filename =
      contentDisposition?.match(/filename="(.+)"/)?.[1] ||
      `clients-export-${new Date().toISOString().split("T")[0]}.${format === "pdf" ? "pdf" : "xlsx"}`;

    const mimeType =
      format === "pdf"
        ? "application/pdf"
        : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    return {
      data: {
        success: true,
        files: {
          [format]: {
            filename,
            data: base64Data,
            mimeType,
          },
        },
      },
      status: response.status,
    };
  } catch (error) {
    console.error("Export error:", error);

    if (isAxiosError(error)) {
      return {
        message: error.response?.data?.message || error.message,
        code: error.code,
        status: error.response?.status || 500,
      };
    } else {
      return {
        message: "An unexpected error occurred during export.",
        status: 500,
      };
    }
  }
}
