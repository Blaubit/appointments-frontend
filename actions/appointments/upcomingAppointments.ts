"use server";

import { isAxiosError } from "axios";
import { parsedEnv } from "@/app/env";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import parsePaginationParams from "@/utils/functions/parsePaginationParams";
import { Appointment, AppointmentStats } from "@/types";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";
import { getServerAxios } from "@/lib/axios";

type Props = {
  searchParams?: URLSearchParams;
};

// Extensión del tipo de respuesta para incluir "stats"
type UpcomingAppointmentsResponse = SuccessReponse<Appointment[]> & {
  stats: AppointmentStats;
};

export async function upcomingAppointments(
  props: Props = {}
): Promise<UpcomingAppointmentsResponse | ErrorResponse> {
  const companyId = await getCompanyId();
  const session = await getSession();

  // Validaciones tempranas para que la lógica global (middleware + interceptor) pueda expulsar al usuario si corresponde.
  if (!companyId) {
    return {
      message: "Company ID not found in cookies",
      status: 401,
    };
  }
  if (!session) {
    return {
      message: "Session not found. Please log in again.",
      status: 401,
    };
  }

  try {
    const parsedParams = parsePaginationParams(props.searchParams);

    // Instancia server-side de axios con baseURL y token
    const axiosInstance = getServerAxios(
      parsedEnv.API_URL,
      session || undefined
    );

    const url = `/companies/${companyId}/appointments/upcoming-with-stats`;

    const response = await axiosInstance.get(url, {
      params: {
        ...parsedParams,
        query: undefined,
        q: parsedParams.q,
      },
    });

    return {
      data: response.data.data,
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
