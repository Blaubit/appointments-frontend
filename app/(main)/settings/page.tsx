import { getUser } from "@/actions/auth/getUser";
import { SettingsPageClient } from "./page.client";
import { get } from "http";
import { findAllProfessionals } from "@/actions/user/findAllProfessionals";
import { findAll } from "@/actions/user/findAll";



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

export default async function SettingsPage() {
  // Fetch de datos del servidor
  
  
  const [
    profileData,
    scheduleSettings,
    securityData,
    appearanceSettings,
    doctors,
    Users,
  ] = await Promise.all([
    getUser(),
    getScheduleSettings(),
    getSecurityData(),
    getAppearanceSettings(),
    findAllProfessionals(),
    findAll()
  ]);

  return (
    <SettingsPageClient
      profileData={profileData}
      scheduleSettings={scheduleSettings}
      securityData={securityData}
      appearanceSettings={appearanceSettings}
      doctors={doctors.data}
      users={Users.data}
    />
  );
}