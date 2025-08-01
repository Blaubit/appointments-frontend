import { ReadonlyURLSearchParams } from "next/navigation";
import DashboardClient from "./page.client";
import { upcomingAppointments } from "@/actions/appointments/upcomingAppointments";
import { getUser } from "@/actions/auth/getUser";
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

  const user: User = await getUser();
  const companyInfo: Company = {
    id: "123asfdas123",
    name: "Campero",
    company_type: "medicos",
    address: "7ma calle 13-19",
    city: "manchester",
    state: "Guatemala",
    postal_code: "09001",
    country: "Guatemala",
    description: "empresa dedicada a curar pollo campero",
    createdAt: "2025-07-31",
  };
  return (
    <DashboardClient
      upcomingAppointments={upcomingAppointmentsData}
      appointmentStats={stats}
      user={user}
      clinicInfo={companyInfo}
    />
  );
}
