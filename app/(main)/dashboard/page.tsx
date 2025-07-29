import { ReadonlyURLSearchParams } from "next/navigation";
import DashboardClient from "./page.client";
import { upcomingAppointments } from "@/actions/appointments/upcomingAppointments";
import { getUser } from "@/actions/auth/getUser";
import type { Appointment } from "@/types";

// Función para obtener estadísticas del dashboard basadas en las citas reales
async function getDashboardStats(appointmentStats?: any) {
  return [
    {
      title: "Citas Hoy",
      value: appointmentStats?.total?.toString() || "0",
      icon: "Calendar",
      color: "text-blue-600",
      ref: "/appointments",
    },
    {
      title: "Confirmadas",
      value: appointmentStats?.confirmed?.toString() || "0",
      icon: "Users",
      color: "text-green-600",
      ref: "/appointments?status=confirmed",
    },
    {
      title: "Pendientes",
      value: appointmentStats?.pending?.toString() || "0",
      icon: "TrendingUp",
      color: "text-yellow-600",
      ref: "/appointments?status=pending",
    },
    {
      title: "Canceladas",
      value: appointmentStats?.cancelled?.toString() || "0",
      icon: "Clock",
      color: "text-red-600",
      ref: "/appointments?status=cancelled",
    },
  ];
}

async function getUserInfo() {
  try {
    const user = await getUser();
    return {
      name: user?.fullName || "Usuario",
      email: user?.email || "email@ejemplo.com",
      role: "Profesional",
      avatar: user?.avatar || "/Avatar1.png",
      initials: user?.fullName?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "US",
    };
  } catch (error) {
    console.error("Error getting user info:", error);
    return {
      name: "Usuario",
      email: "email@ejemplo.com",
      role: "Profesional",
      avatar: "/Avatar1.png",
      initials: "US",
    };
  }
}

async function getClinicInfo() {
  // Esta información probablemente debería venir de la API también
  return {
    address: "Av. Principal 123, Centro",
    phone: "+1 (555) 123-4567",
    schedule: "Lun-Vie: 8:00-18:00",
  };
}

type Props = {
  searchParams?: ReadonlyURLSearchParams;
};

export default async function DashboardPage({ searchParams }: Props) {
  try {
    // Convertir ReadonlyURLSearchParams a URLSearchParams
    const params = new URLSearchParams();
    if (searchParams) {
      
    }

    console.log("Dashboard - Getting upcoming appointments...");

    // Obtener las citas próximas usando la función corregida
    const appointmentsResponse = await upcomingAppointments({
      searchParams: params
    });

    console.log("Dashboard - Appointments response:", appointmentsResponse);

    // Verificar si la respuesta fue exitosa
    if (appointmentsResponse.status !== 200 || !("data" in appointmentsResponse)) {
      console.error("Error obteniendo citas:", appointmentsResponse);
      
      // En lugar de lanzar error, usar datos de fallback
      const [stats, user, clinicInfo] = await Promise.all([
        getDashboardStats(),
        getUserInfo(),
        getClinicInfo(),
      ]);

      const fallbackData = {
        upcomingAppointments: [],
        appointmentStats: { total: 0, confirmed: 0, pending: 0, cancelled: 0 },
        stats,
        user,
        clinicInfo,
        userType: "professional" as const,
        notifications: { count: 0 },
      };

      return <DashboardClient {...fallbackData} />;
    }

    // Ejecutar el resto de consultas en paralelo
    const [stats, user, clinicInfo] = await Promise.all([
      getDashboardStats(appointmentsResponse.stats),
      getUserInfo(),
      getClinicInfo(),
    ]);

    const dashboardData = {
      upcomingAppointments: appointmentsResponse.data,
      appointmentStats: appointmentsResponse.stats || { total: 0, confirmed: 0, pending: 0, cancelled: 0 },
      stats,
      user,
      clinicInfo,
      userType: "professional" as const,
      notifications: {
        count: 3,
      },
    };

    console.log("Dashboard - Final data:", {
      appointmentsCount: dashboardData.upcomingAppointments.length,
      stats: dashboardData.appointmentStats
    });

    return <DashboardClient {...dashboardData} />;
  } catch (error) {
    console.error("Error loading dashboard data:", error);
    
    // En caso de error, renderizar con datos de fallback
    const [stats, user, clinicInfo] = await Promise.all([
      getDashboardStats(),
      getUserInfo(),
      getClinicInfo(),
    ]);

    const fallbackData = {
      upcomingAppointments: [],
      appointmentStats: { total: 0, confirmed: 0, pending: 0, cancelled: 0 },
      stats,
      user,
      clinicInfo,
      userType: "professional" as const,
      notifications: { count: 0 },
    };

    return <DashboardClient {...fallbackData} />;
  }
}