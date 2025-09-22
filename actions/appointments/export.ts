"use server";

import axios, { isAxiosError } from "axios";
import { parsedEnv } from "@/app/env";
import { ErrorResponse } from "@/types/api";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";

type ExportFormat = "pdf" | "excel";

type ExportOptions = {
  format?: ExportFormat;
  includeStatistics?: boolean;
  startDate?: string;
  endDate?: string;
  status?: string | string[];
  professionalId?: string;
  clientId?: string;
  includePaymentInfo?: boolean;
  includeServices?: boolean;
};

type ExportSuccessResponse = {
  data: {
    success: boolean;
    message?: string;
    timestamp?: string;
    filename?: string;
    mimeType?: string;
    fileData?: string;
  };
  status: number;
};

export async function exportAppointments(
  options: ExportOptions = {}
): Promise<ExportSuccessResponse | ErrorResponse> {
  const session = await getSession();
  const companyId = await getCompanyId();

  try {
    const {
      format = "excel",
      includeStatistics = false,
      startDate,
      endDate,
      status,
      professionalId,
      clientId,
      includePaymentInfo = false,
      includeServices = false,
    } = options;

    const url = `${parsedEnv.API_URL}/companies/${companyId}/appointments/export/${format}`;

    const params: Record<string, any> = {
      includeStatistics: includeStatistics.toString(),
      includePaymentInfo: includePaymentInfo.toString(),
      includeServices: includeServices.toString(),
    };

    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (status) params.status = status;
    if (professionalId) params.professionalId = professionalId;
    if (clientId) params.clientId = clientId;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${session}`,
      },
      params,
      responseType: "arraybuffer",
    });

    // Convertir buffer a base64
    const buffer = Buffer.from(response.data);
    const base64Data = buffer.toString("base64");

    const contentDisposition = response.headers["content-disposition"];
    const filename =
      contentDisposition?.match(/filename="(.+)"/)?.[1] ||
      `citas-export-${new Date().toISOString().split("T")[0]}.${format === "pdf" ? "pdf" : "xlsx"}`;

    const mimeType =
      format === "pdf"
        ? "application/pdf"
        : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    return {
      data: {
        success: true,
        filename,
        mimeType,
        fileData: base64Data,
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
