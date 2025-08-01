import type { Appointment, AppointmentStats, Pagination } from "@/types";
import PageClient from "./page.client";
import findAll from "@/actions/appointments/findAll";
import { getUser } from "@/actions/auth/getUser";
type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Page({ searchParams }: Props) {
  // Opción 1: Crear URLSearchParams manualmente iterando sobre las entradas
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        // Si es un array, agregar cada valor
        value.forEach((v) => params.append(key, v));
      } else {
        params.set(key, value);
      }
    }
  });

  const response = await findAll({
    searchParams: params,
  });
  const user = await getUser();
  if (response.status !== 200 || !("data" in response)) {
    throw new Error("Failed to fetch appointments data");
  }
  console.log("response", response);
  return (
    <PageClient
      appointments={response.data}
      stats={response.stats}
      pagination={response.meta}
    />
  );
}
