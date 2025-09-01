"use server";

import axios, { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { parsedEnv } from "@/app/env";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import parsePaginationParams from "@/utils/functions/parsePaginationParams";
import { Appointment, AppointmentStats } from "@/types";
import { getUser, getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";
type Props = {
  searchParams?: URLSearchParams;
};

// Extensión del tipo de respuesta para incluir "stats"
type UpcomingAppointmentsResponse = SuccessReponse<Appointment[]> & {
  stats: AppointmentStats;
};

export async function upcomingAppointments(
  props: Props = {},
): Promise<UpcomingAppointmentsResponse | ErrorResponse> {
  const companyId = await getCompanyId();
  const session = await getSession();
  try {
    if (!companyId) {
      return {
        message: "Company ID not found in cookies",
        status: 400,
      };
    }

    const parsedParams = parsePaginationParams(props.searchParams);
    const url = `${parsedEnv.API_URL}/companies/${companyId}/appointments/upcoming-with-stats`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${session}`,
      },
      params: {
        ...parsedParams,
        query: undefined,
        q: parsedParams.query,
      },
    });

    return {
      data: response.data.upcomingAppointments,
      status: response.status,
      statusText: response.statusText,
      meta: response.data.meta,
      stats: response.data.stats,
    };
  } catch (error: unknown) {
    console.error("Error en upcomingAppointments:", error);
    if (isAxiosError(error)) {
      return {
        message: error.message,
        code: error.code,
        status: error.response?.status,
      };
    } else if (error instanceof SyntaxError) {
      return {
        message: "JSON parse error in user cookie",
        status: 500,
      };
    } else {
      return {
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
      };
    }
  }
}
