import type { Metadata } from "next";
import RegisterClient from "./page.client";
import { findAllCompanyTypes } from "@/actions/companies/findAllCompanyTypes";
import { findAll as findAllRoles } from "@/actions/user/role/findAll";
import { findAll as findAllPlans } from "@/actions/plans/findAll";
import createCompany from "@/actions/companies/createCompany";
import { CompanyRegistrationPayload } from "@/types";
import { getUserId } from "@/actions/user/getUserId";
import { logout } from "@/actions/auth/logout";

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
  const [responseCompanyTypes, responseRoles, responsePlans] =
    await Promise.all([findAllCompanyTypes(), findAllRoles(), findAllPlans()]);

  // Manejar el caso de error o datos faltantes
  const companyTypes = responseCompanyTypes?.data || [];
  const roles = responseRoles?.data || [];
  const plans = responsePlans?.data || [];
  const userId = await getUserId();

  // Si no hay tipos de empresa, roles o planes, mostrar un mensaje de error
  if (companyTypes.length === 0 || roles.length === 0 || plans.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Error de carga</h1>
        <p className="text-red-600">
          No se pudieron cargar los datos necesarios para el registro. Por
          favor, inténtalo de nuevo más tarde.
        </p>
      </div>
    );
  }

  // si no hay userId hacer logout
  if (!userId) {
    await logout();
    return null;
  }

  // ✅ Función actualizada para manejar SuccessResponse<Company> | ErrorResponse
  const handleRegister = async (formData: CompanyRegistrationPayload) => {
    "use server";

    console.log("handleRegister invoked with formData:", formData);

    try {
      console.log("Ejecutando Server Action createCompany...");

      // ✅ Validar datos antes de enviar (opcional, ya que el backend debería validar también)
      if (!formData.adminEmail || !formData.companyName) {
        // Retornar ErrorResponse
        return {
          message:
            "Datos requeridos faltantes: email del administrador y nombre de la empresa son obligatorios",
          code: "VALIDATION_ERROR",
          status: 400,
        };
      }

      // ✅ Llamar al action que devuelve SuccessResponse<Company> | ErrorResponse
      const response = await createCompany(formData);

      console.log("Respuesta de createCompany:", response);

      // ✅ El response ya viene en el formato correcto desde el backend
      // Si es un ErrorResponse, se manejará en el cliente
      // Si es un SuccessResponse<Company>, se procesará como éxito
      return response;
    } catch (error) {
      console.error("Error en registerCompany Server Action:", error);

      // ✅ En caso de excepción, retornar ErrorResponse
      if (error instanceof Error) {
        // Determinar el código de error basado en el tipo de excepción
        let code = "UNEXPECTED_ERROR";
        let status = 500;

        const errorMessage = error.message.toLowerCase();

        if (
          errorMessage.includes("network") ||
          errorMessage.includes("fetch")
        ) {
          code = "NETWORK_ERROR";
          status = 0;
        } else if (errorMessage.includes("timeout")) {
          code = "TIMEOUT_ERROR";
          status = 408;
        } else if (errorMessage.includes("unauthorized")) {
          code = "USER_UNAUTHORIZED";
          status = 401;
        } else if (errorMessage.includes("database")) {
          code = "DATABASE_ERROR";
          status = 503;
        }

        return {
          message: error.message,
          code,
          status,
        };
      }

      // Error completamente inesperado
      return {
        message: "Ocurrió un error inesperado al crear la empresa",
        code: "UNKNOWN_ERROR",
        status: 500,
      };
    }
  };

  console.log("Company types loaded:", companyTypes.length);
  console.log("Roles loaded:", roles.length);
  console.log("Plans loaded:", plans.length);

  return (
    <RegisterClient
      companyTypes={companyTypes}
      roles={roles}
      plans={plans}
      onRegisterCompanyComplete={handleRegister}
      currentUserId={userId}
    />
  );
}
