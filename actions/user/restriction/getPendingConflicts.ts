"use server";

import { parsedEnv } from "@/app/env";
import axios, { isAxiosError } from "axios";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";
import { ErrorResponse, SuccessReponse } from "@/types/api";

export type AffectedAppointment = {
  id: string;
  clientName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
};

export type Restriction = {
  id: string;
  professionalId: string;
  restrictionDate: string;
  startTime: string | null;
  endTime: string | null;
  reason: string | null;
  notes: string | null;
  hasPendingConflicts: boolean;
  affectedAppointments: AffectedAppointment[];
};

export type PendingConflictsResponse = {
  restrictions: Restriction[];
  totalConflicts: number;
};

export async function getPendingConflicts(
  professionalId: string
): Promise<SuccessReponse<PendingConflictsResponse> | ErrorResponse> {
  const companyId = await getCompanyId();
  const session = await getSession();

  try {
    if (!companyId) {
      return {
        message: "Company ID not found.  Please log in again.",
        status: 401,
      };
    }

    if (!session) {
      return {
        message: "Session not found. Please log in again.",
        status: 401,
      };
    }

    if (!professionalId) {
      return {
        message: "professionalId is required.",
        status: 400,
      };
    }

    const url = `${parsedEnv.API_URL}/companies/${companyId}/availabilities/restrictions/pending-conflicts`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${session}`,
        "Content-Type": "application/json",
      },
      params: {
        professionalId,
      },
    });

    if (response.status >= 200 && response.status < 300) {
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
    console.error("Error fetching pending conflicts:", error);

    if (isAxiosError(error)) {
      const errorMessage =
        (error.response?.data as any)?.message || error.message;
      const errorStatus = error.response?.status;

      return {
        message: errorMessage,
        code: error.code,
        status: errorStatus,
      };
    }

    return {
      message: "An unexpected error occurred.",
      status: 500,
    };
  }
}
