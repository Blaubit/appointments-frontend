"use server";

import axios, { isAxiosError } from "axios";

import { parsedEnv } from "@/app/env";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { parseAppointmentPaginationParams } from "@/utils/functions/parsePaginationParams";
import { Appointment } from "@/types";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";

type Props = {
  searchParams?: URLSearchParams;
};

export default async function findAll(
  props: Props = {}
): Promise<SuccessReponse<Appointment[]> | ErrorResponse | any> {
  const companyId = await getCompanyId();
  const session = await getSession();
  try {
    const url = `${parsedEnv.API_URL}/companies/${companyId}/appointments/all-with-stats?limit=6`;

    // Obtenemos los parámetros y los transformamos correctamente
    const parsedParams = parseAppointmentPaginationParams(props.searchParams);

    // Creamos el objeto de parámetros para axios
    const params: Record<string, any> = {};

    // Solo pasar limit una vez, y el resto de los parámetros
    // Si el backend espera limit en la url y NO en params, puedes quitarlo aquí
    // Pero si el backend espera limit en params, déjalo
    if (parsedParams.page) params.page = parsedParams.page;
    if (parsedParams.q) params.q = parsedParams.q;
    if (parsedParams.status) params.status = parsedParams.status;
    if (parsedParams.appointmentDate)
      params.appointmentDate = parsedParams.appointmentDate;
    if (parsedParams.professionalId)
      params.professionalId = parsedParams.professionalId;
    // Si tienes otros filtros, añádelos aquí
    // if (parsedParams.professional) params.professional = parsedParams.professional;
    // limit solo se pasa una vez (en la url), así que NO lo pongas en params si ya está en la url
    // Si necesitas que sea dinámico, ponlo en params, pero solo UNA vez
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${session}`,
      },
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
        code: error.code,
        status: error.response?.status,
      };
    } else {
      return {
        message: "An unexpected error occurred.",
      };
    }
  }
}
