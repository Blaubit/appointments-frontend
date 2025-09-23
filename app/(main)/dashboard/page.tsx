import { ReadonlyURLSearchParams } from "next/navigation";
import DashboardClient from "./page.client";
import { upcomingAppointments } from "@/actions/appointments/upcomingAppointments";
import { getUser } from "@/actions/auth/getUser";
import { findOne } from "@/actions/companies/findOne";
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

  // Obtener citas próximas y estadísticas
  try {
    const response = await upcomingAppointments();

    if ("message" in response) {
      errorMessage = response.message || "Error al cargar citas próximas.";
    } else {
      upcomingAppointmentsData = response.data ?? [];
      stats = response.stats;
    }
  } catch (err) {
    errorMessage = "Error inesperado al cargar citas próximas.";
  }

  // Obtener usuario
  if (!errorMessage) {
    try {
      user = await getUser();
      if (!user) {
        errorMessage = "No se encontró el usuario.";
      }
    } catch (err) {
      errorMessage = "Error inesperado al obtener usuario.";
    }
  }

  // Obtener información del consultorio/empresa
  if (!errorMessage && user) {
    companyInfo = {
      id: "default",
      name: "CitasFácil",
      companyType: "default",
      address: "Calle Falsa 123",
      city: "Ciudad",
      state: "Estado",
      postal_code: "12345",
      country: "País",
      description: "Empresa de citas por defecto",
      createdAt: "2023-01-01T00:00:00Z",
    };
    try {
      const companyResponse = await findOne(user.company?.id);
      if (companyResponse?.status === 200 && "data" in companyResponse) {
        companyInfo = companyResponse.data;
      }
    } catch (err) {
      // Si falla, se mantiene el valor por defecto
    }
  }

  // Renderizar DashboardClient con props + error
  return (
    <DashboardClient
      upcomingAppointments={upcomingAppointmentsData}
      appointmentStats={stats}
      user={user}
      clinicInfo={companyInfo}
      errorMessage={errorMessage}
    />
  );
}
