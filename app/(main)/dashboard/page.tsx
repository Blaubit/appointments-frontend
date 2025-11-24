import { ReadonlyURLSearchParams, redirect } from "next/navigation";
import DashboardClient from "./page.client";
import { upcomingAppointments } from "@/actions/appointments/upcomingAppointments";
import { getUser } from "@/actions/auth/getUser";
import type { Appointment, AppointmentStats, User, Company } from "@/types";

type Props = {
  searchParams?: ReadonlyURLSearchParams;
};

export default async function DashboardPage({ searchParams }: Props) {
  let upcomingAppointmentsData: Appointment[] = [];
  let stats: AppointmentStats | undefined = undefined;
  let user: User | null = null;
  let companyInfo: Company | undefined = undefined;
  let errorMessage: string | undefined = undefined;
  let errorcode: number | undefined = undefined;

  // Obtener citas próximas y estadísticas (server action)
  try {
    const response = await upcomingAppointments();

    if ("message" in response) {
      errorMessage = response.message || "Error al cargar citas próximas.";
      errorcode = response.status;
    } else {
      upcomingAppointmentsData = response.data ?? [];
      stats = response.stats;
    }
  } catch (err) {
    errorMessage = "Error inesperado al cargar citas próximas.";
  }

  // Si la llamada server-side devolvió 401, delegar en el route handler de logout
  if (errorcode === 401) {
    // Redirige al route handler que borra cookies y redirige a /login
    redirect("/api/logout");
  }

  // Obtener usuario (server action)
  if (!errorMessage) {
    try {
      user = await getUser();
      if (!user) {
        errorMessage = "No se encontró el usuario.";
      }
    } catch (err: any) {
      // Si getUser retorna/lanza un 401, delegamos en /api/logout
      const status = err?.status ?? err?.response?.status;
      if (status === 401) {
        redirect("/api/logout");
      }
      errorMessage = "Error inesperado al obtener usuario.";
    }
  }

  // Información por defecto del consultorio (fallback)
  if (!errorMessage && user) {
    companyInfo = {
      id: "default",
      name: "CitasFácil",
      companyType: "default",
      address: "Calle Falsa 123",
      city: "Ciudad",
      state: "Estado",
      postalCode: "12345",
      country: "País",
      description: "Empresa de citas por defecto",
      createdAt: "2023-01-01T00:00:00Z",
    };
  }

  // Renderizar DashboardClient con props + error
  return (
    <DashboardClient
      upcomingAppointments={upcomingAppointmentsData}
      appointmentStats={stats}
      user={user}
      clinicInfo={companyInfo || user?.company}
      errorMessage={errorMessage}
      errorcode={errorcode}
    />
  );
}
