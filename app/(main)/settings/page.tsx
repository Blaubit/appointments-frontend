import { getUser } from "@/actions/auth/getUser";
import { SettingsPageClient } from "./page.client";
import { findAllProfessionals } from "@/actions/user/findAllProfessionals";
import { findAll } from "@/actions/user/findAll";
import { findAll as findAllRoles } from "@/actions/user/role/findAll";

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
  // Manejar posibles errores de autorización u otros errores y caer a valores por defecto
  let scheduleSettings: any;
  let securityData: any;
  let appearanceSettings: any;
  let doctorsRaw: any = null;
  let usersRaw: any = null;
  let rolesRaw: any = null;

  try {
    // Intentamos lanzar todas las llamadas en paralelo
    const [
      _scheduleSettings,
      _securityData,
      _appearanceSettings,
      _doctors,
      _Users,
      _roles,
    ] = await Promise.all([
      getScheduleSettings(),
      getSecurityData(),
      getAppearanceSettings(),
      // findAllProfessionals puede fallar si el usuario no tiene permiso
      findAllProfessionals(),
      // Solo hacer la llamada con paginación si estamos en el tab de usuarios
      currentTab === "users"
        ? findAll({ page: currentPage, limit: 10 })
        : findAll({ page: 1, limit: 10 }), // Cargar página 1 por defecto
      findAllRoles(),
    ]);

    scheduleSettings = _scheduleSettings;
    securityData = _securityData;
    appearanceSettings = _appearanceSettings;
    doctorsRaw = _doctors;
    usersRaw = _Users;
    rolesRaw = _roles;
  } catch (err: any) {
    // Si hay un error (por ejemplo 401/403 al obtener profesionales), caemos a valores por defecto
    // Logging para debugging en el servidor

    // Intentamos obtener los defaults independientes si las llamadas en paralelo fallaron
    scheduleSettings = await getScheduleSettings();
    securityData = await getSecurityData();
    appearanceSettings = await getAppearanceSettings();

    // doctorsRaw, usersRaw, rolesRaw se quedan en null y serán normalizados a arrays vacíos abajo
  }

  // Normalizar los resultados para asegurar que siempre pasamos arrays al cliente.
  // Esto evita errores en el cliente como "professionals.filter is not a function" cuando la API devolvió null o lanzó 403.
  const doctorsArray = Array.isArray(doctorsRaw?.data)
    ? doctorsRaw.data
    : Array.isArray(doctorsRaw)
      ? doctorsRaw
      : []; // fallback a []

  const usersArray = Array.isArray(usersRaw?.data)
    ? usersRaw.data
    : Array.isArray(usersRaw)
      ? usersRaw
      : []; // fallback a []

  const rolesArray = Array.isArray(rolesRaw?.data)
    ? rolesRaw.data
    : Array.isArray(rolesRaw)
      ? rolesRaw
      : []; // fallback a []

  const usersMeta = usersRaw?.meta ?? undefined;

  return (
    <SettingsPageClient
      profileData={profileData}
      scheduleSettings={scheduleSettings}
      securityData={securityData}
      appearanceSettings={appearanceSettings}
      doctors={doctorsArray}
      users={usersArray}
      roles={rolesArray}
      usersMeta={usersMeta} // Pasar metadatos de paginación (puede ser undefined)
    />
  );
}
