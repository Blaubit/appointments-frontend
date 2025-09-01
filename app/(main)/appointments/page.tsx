import type {  User } from "@/types";
import PageClient from "./page.client";
import findAll from "@/actions/appointments/findAll";
import { getRoleName } from "@/actions/user/getRoleName";
import { findAllProfessionals } from "@/actions/user/findAllProfessionals";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Page({ searchParams }: Props) {
  const params = await new URLSearchParams();
  Object.entries(await searchParams).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else {
        params.set(key, value);
      }
    }
  });

  const response = await findAll({ searchParams: params });
  const professionalsResponse = await findAllProfessionals();
  const roleName = await getRoleName();
  if (response.status !== 200 || !("data" in response)) {
    throw new Error("Failed to fetch appointments data");
  }

  if (
    typeof professionalsResponse !== "object" ||
    !("data" in professionalsResponse)
  ) {
    throw new Error("Failed to fetch professionals data");
  }
  // Si el usuario no es profesional, se envían los profesionales al cliente
  const professionals: User[] =
    roleName !== "profesional" ? professionalsResponse.data : [];

  return (
    <PageClient
      appointments={response.data}
      stats={response.stats}
      pagination={response.meta}
      professionals={professionals}
    />
  );
}
