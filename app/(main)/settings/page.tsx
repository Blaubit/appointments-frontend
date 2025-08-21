import { getUser } from "@/actions/auth/getUser";
import { SettingsPageClient } from "./page.client";
import { get } from "http";
import { findAllProfessionals } from "@/actions/user/findAllProfessionals";
import { findAll } from "@/actions/user/findAll";
import { findAll as findAllRoles } from "@/actions/user/role/findAll";
import { findOne as findCompany } from "@/actions/companies/findOne";
import { User } from "@/types";

async function getScheduleSettings() {
  // Simular fetch de datos del servidor
  return {
    timezone: "America/Guatemala",
    workingDays: {
      monday: { enabled: true, start: "08:00", end: "18:00" },
      tuesday: { enabled: true, start: "08:00", end: "18:00" },
      wednesday: { enabled: true, start: "08:00", end: "18:00" },
      thursday: { enabled: true, start: "08:00", end: "18:00" },
      friday: { enabled: true, start: "08:00", end: "18:00" },
      saturday: { enabled: false, start: "09:00", end: "14:00" },
      sunday: { enabled: false, start: "09:00", end: "14:00" },
    },
    appointmentDuration: 30,
    bufferTime: 15,
    maxAdvanceBooking: 30,
  };
}

async function getSecurityData() {
  // Simular fetch de datos del servidor
  return {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
    loginAlerts: true,
    sessionTimeout: 60,
  };
}

async function getAppearanceSettings() {
  // Simular fetch de datos del servidor
  return {
    theme: "system",
    language: "es",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    currency: "MXN",
  };
}

// Actualizar la interfaz para esperar searchParams
interface SettingsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SettingsPage({
  searchParams,
}: SettingsPageProps) {
  // Esperar a que searchParams se resuelva
  const resolvedSearchParams = await searchParams;

  // Extraer página específicamente para usuarios si estamos en el tab de usuarios
  const currentTab = resolvedSearchParams.tab as string;
  const currentPage =
    currentTab === "users"
      ? parseInt((resolvedSearchParams.page as string) || "1")
      : 1;

  // Primero obtener los datos del usuario
  const profileData = await getUser();
  if (!profileData) {
    throw new Error("No se pudo obtener la información del usuario");
  }

  // Fetch del resto de datos del servidor
  const [
    scheduleSettings,
    securityData,
    appearanceSettings,
    doctors,
    Users,
    roles,
  ] = await Promise.all([
    getScheduleSettings(),
    getSecurityData(),
    getAppearanceSettings(),
    findAllProfessionals(),
    // Solo hacer la llamada con paginación si estamos en el tab de usuarios
    currentTab === "users"
      ? findAll({ page: currentPage, limit: 10 })
      : findAll({ page: 1, limit: 10 }), // Cargar página 1 por defecto
    findAllRoles(),
  ]);

  return (
    <SettingsPageClient
      profileData={profileData}
      scheduleSettings={scheduleSettings}
      securityData={securityData}
      appearanceSettings={appearanceSettings}
      doctors={doctors.data}
      users={Users.data}
      roles={roles.data}
      usersMeta={Users.meta} // Pasar metadatos de paginación
    />
  );
}
