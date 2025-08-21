import type { Metadata } from "next";
import RegisterClient from "./page.client";
import { findAllCompanyTypes } from "@/actions/companies/findAllCompanyTypes";
import { findAll as findAllRoles } from "@/actions/user/role/findAll";
import createCompany from "@/actions/companies/createCompany";
import { create as createUser } from "@/actions/user/create";

export const metadata: Metadata = {
  title: "Registro de Empresa - CitasFácil",
  description:
    "Registra tu clínica, consultorio o centro médico en CitasFácil y comienza a gestionar citas de forma profesional.",
  keywords: [
    "registro",
    "empresa",
    "clínica",
    "consultorio",
    "citas médicas",
    "Guatemala",
  ],
};

export default async function RegisterPage() {
  // Obtener datos necesarios del servidor
  const [responseCompanyTypes, responseRoles] = await Promise.all([
    findAllCompanyTypes(),
    findAllRoles(),
  ]);

  // Manejar el caso de error o datos faltantes
  const companyTypes = responseCompanyTypes?.data || [];
  const roles = responseRoles?.data || [];

  // Función para manejar la creación de empresa
  async function handleCreateCompany(companyData: any) {
    "use server";
    return await createCompany(companyData);
  }

  // Función para manejar la creación de usuario
  async function handleCreateUser(userData: any) {
    "use server";
    return await createUser(userData);
  }

  return (
    <RegisterClient
      companyTypes={companyTypes}
      roles={roles}
      onCreateCompany={handleCreateCompany}
      onCreateUser={handleCreateUser}
    />
  );
}
