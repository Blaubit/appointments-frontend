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
  const response = await upcomingAppointments();
  if ("message" in response) {
    // ErrorResponse
    console.error("message", response.message);
    throw new Error(response.message);
  }

  const upcomingAppointmentsData: Appointment[] = response.data;
  const stats: AppointmentStats = response.stats;

  const user = await getUser();

  if (!user) {
    throw new Error("User not found");
  }

  let companyInfo: Company = {
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
  const companyResponse = await findOne(user.company.id);
  if (companyResponse.status === 200 && "data" in companyResponse) {
    companyInfo = companyResponse.data;
  }

  return (
    <DashboardClient
      upcomingAppointments={upcomingAppointmentsData}
      appointmentStats={stats}
      user={user}
      clinicInfo={companyInfo}
    />
  );
}
