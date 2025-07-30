"use server";

import axios, { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { parsedEnv } from "@/app/env";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import parsePaginationParams from "@/utils/functions/parsePaginationParams";
import { Appointment } from "@/types";

type Props = {
  searchParams?: URLSearchParams;
};

type UpcomingAppointmentsStats = {
  total: number;
  confirmed: number;
  pending: number;
  cancelled: number;
};

type UpcomingAppointmentsResponse = SuccessReponse<Appointment[]> & {
  stats?: UpcomingAppointmentsStats;
};

// Función para mapear el status de la API al status esperado por el frontend
function mapAppointmentStatus(apiStatus: string): string {
  const statusMap: { [key: string]: string } = {
    'scheduled': 'pending',
    'confirmed': 'confirmed', 
    'completed': 'confirmed',
    'cancelled': 'cancelled',
    'pending': 'pending'
  };
  
  return statusMap[apiStatus] || 'pending';
}

export async function upcomingAppointments(
  props: Props = {}
): Promise<UpcomingAppointmentsResponse | ErrorResponse> {
  try {
    const cookieStore = await cookies();
    const User = cookieStore.get("user")?.value;
    
    if (!User) {
      return {
        message: "Usuario no autenticado",
        status: 401,
      };
    }

    const userData = JSON.parse(User);
    const companyId = userData.companyId;
    
    if (!companyId) {
      return {
        message: "ID de compañía no encontrado",
        status: 400,
      };
    }

    const parsedParams = parsePaginationParams(props.searchParams);
    
    // Configuración común para las requests
    const requestConfig = {
      headers: {
        Authorization: `Bearer ${cookieStore.get("session")?.value || ""}`,
        'Content-Type': 'application/json',
      },
      params: {
        ...parsedParams,
        query: undefined,
        q: parsedParams.query,
      }
    };

    // URLs para los dos endpoints
    const upcomingUrl = `${parsedEnv.API_URL}/companies/${companyId}/appointments/upcoming`;
    const todayUrl = `${parsedEnv.API_URL}/companies/${companyId}/appointments/today`;
    
    console.log("Making request to upcoming:", upcomingUrl);
    console.log("Making request to today:", todayUrl);
    console.log("With params:", parsedParams);
    
    // Hacer ambas requests en paralelo
    const [responseUpcoming, responseToday] = await Promise.all([
      axios.get(upcomingUrl, requestConfig),
      axios.get(todayUrl, requestConfig)
    ]);

    console.log("Upcoming appointments response:", responseUpcoming.data);
    console.log("Today appointments response:", responseToday.data);

    // Procesar datos de upcoming appointments
    const upcomingData = Array.isArray(responseUpcoming.data) 
      ? responseUpcoming.data 
      : responseUpcoming.data.data || [];
    
    const mappedUpcomingAppointments = upcomingData.map((appointment: any) => ({
      ...appointment,
      status: mapAppointmentStatus(appointment.status),
      client: {
        ...appointment.client,
        avatar: appointment.client.avatar || null
      }
    }));

    // Procesar datos de today appointments para stats
    const todayData = Array.isArray(responseToday.data) 
      ? responseToday.data 
      : responseToday.data.data || [];
    
    const mappedTodayAppointments = todayData.map((appointment: any) => ({
      ...appointment,
      status: mapAppointmentStatus(appointment.status),
      client: {
        ...appointment.client,
        avatar: appointment.client.avatar || null
      }
    }));

    // Calcular estadísticas basadas en las citas de hoy
    const stats = {
      total: mappedTodayAppointments.length, // Solo citas de hoy
      confirmed: mappedUpcomingAppointments.filter((apt: any) => apt.status === 'confirmed').length,
      pending: mappedUpcomingAppointments.filter((apt: any) => apt.status === 'pending').length,
      cancelled: mappedUpcomingAppointments.filter((apt: any) => apt.status === 'cancelled').length,
    };

    // Usar meta de la respuesta de upcoming (o today si upcoming no tiene)
    const meta = responseUpcoming.data.meta || responseToday.data.meta || {
      currentPage: 1,
      totalPages: 1,
      totalCount: mappedUpcomingAppointments.length,
      hasNextPage: false,
      hasPreviousPage: false
    };

    console.log("Final stats from today appointments:", stats);
    console.log("Final upcoming appointments count:", mappedUpcomingAppointments.length);

    return {
      data: mappedUpcomingAppointments, // Próximas citas desde /upcoming
      status: 200,
      statusText: responseUpcoming.statusText,
      meta,
      stats, // Estadísticas desde /today
    };
  } catch (error) {
    console.error("Error en upcomingAppointments:", error);
    
    if (isAxiosError(error)) {
      console.error("Axios error details:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
      
      return {
        message: error.response?.data?.message || error.message,
        code: error.code,
        status: error.response?.status || 500,
      };
    } else {
      return {
        message: "An unexpected error occurred.",
        status: 500,
      };
    }
  }
}