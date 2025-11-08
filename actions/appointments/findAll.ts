"use server";

import { isAxiosError } from "axios";
import { parsedEnv } from "@/app/env";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { parseAppointmentPaginationParams } from "@/utils/functions/parsePaginationParams";
import { Appointment } from "@/types";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";
import { getServerAxios } from "@/lib/axios";

type Props = {
  searchParams?: URLSearchParams;
};

export default async function findAll(
  props: Props = {}
): Promise<SuccessReponse<Appointment[]> | ErrorResponse | any> {
  const companyId = await getCompanyId();
  const session = await getSession();

  // Si falta companyId o session devolvemos 401 para que la lógica superior (middleware/interceptor) los maneje.
  if (!companyId) {
    return {
      message: "Company ID not found. Please log in again.",
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
    // Usamos instancia server-side con baseURL y token
    const axiosInstance = getServerAxios(
      parsedEnv.API_URL,
      session || undefined
    );

    // URL relativa (la baseURL la provee axiosInstance)
    const url = `/companies/${companyId}/appointments/all-with-stats?limit=6`;

    // Obtenemos y transformamos parámetros de paginación/filtrado
    const parsedParams = parseAppointmentPaginationParams(props.searchParams);

    const params: Record<string, any> = {};
    if (parsedParams.page) params.page = parsedParams.page;
    if (parsedParams.q) params.q = parsedParams.q;
    if (parsedParams.status) params.status = parsedParams.status;
    if (parsedParams.appointmentDate)
      params.appointmentDate = parsedParams.appointmentDate;
    if (parsedParams.professionalId)
      params.professionalId = parsedParams.professionalId;

    const response = await axiosInstance.get(url, {
      params,
    });

    return {
      data: response.data.data,
      status: 200,
      statusText: response.statusText,
      meta: response.data.meta,
      stats: response.data.stats,
    };
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        message: error.message,
        code: (error as any).code,
        status: error.response?.status,
      };
    } else {
      return {
        message: "An unexpected error occurred.",
      };
    }
  }
}
