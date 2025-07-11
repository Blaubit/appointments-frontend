import { ReadonlyURLSearchParams } from "next/navigation";
import DashboardClient from "./page.client";

// Mock functions - estas deberían ser reemplazadas por tus acciones reales
async function getUpcomingAppointments() {
  // Simular llamada a API/base de datos
  return [
    {
      id: 1,
      client: {
        Name: "Maria Gonzales",
        phone: "+50212345678",
        mail: "mail@mail.com",
      },
      service: "Consulta General",
      time: "09:00",
      date: "Hoy",
      status: "confirmed" as const,
      avatar: "/Avatar1.png?height=40&width=40",
    },
    {
      id: 2,
      client: {
        Name: "Carlos Rodríguez",
        phone: "+50212345678",
        mail: "mail@mail.com",
      },
      service: "Limpieza Dental",
      time: "10:30",
      date: "Hoy",
      status: "pending" as const,
      avatar: "/Avatar1.png?height=40&width=40",
    },
    {
      id: 3,
      client: {
        Name: "Ana Peraz",
        phone: "+50212345678",
        mail: "mail@mail.com",
      },
      service: "Corte y Peinado",
      time: "14:00",
      date: "Mañana",
      status: "confirmed" as const,
      avatar: "/Avatar1.png?height=40&width=40",
    },
    {
      id: 4,
      client: {
        Name: "Luis Martinez",
        phone: "+50212345678",
        mail: "mail@mail.com",
      },
      service: "Consulta de Control",
      time: "16:00",
      date: "Mañana",
      status: "confirmed" as const,
      avatar: "/Avatar1.png?height=40&width=40",
    },
  ];
}

async function getDashboardStats() {
  // Simular llamada a API/base de datos para obtener estadísticas
  return [
    {
      title: "Citas Hoy",
      value: "8",
      icon: "Calendar",
      color: "text-blue-600",
      ref: "appointments",
    },
    {
      title: "Clientes Atendidos",
      value: "156",
      icon: "Users",
      color: "text-green-600",
      ref: "clients",
    },
    {
      title: "Ingresos del Mes",
      value: "$12,450",
      icon: "TrendingUp",
      color: "text-purple-600",
      ref: "reports",
    },
    {
      title: "Tiempo Promedio",
      value: "45min",
      icon: "Clock",
      color: "text-orange-600",
      ref: "#",
    },
  ];
}

async function getUserInfo() {
  // Simular obtener información del usuario autenticado
  return {
    name: "Dr. Roberto Silva",
    email: "roberto.silva@email.com",
    role: "Médico General",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "DR",
  };
}

async function getClinicInfo() {
  // Simular obtener información de la clínica
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
    // Ejecutar todas las consultas en paralelo para mejor rendimiento
    const [appointments, stats, user, clinicInfo] = await Promise.all([
      getUpcomingAppointments(),
      getDashboardStats(),
      getUserInfo(),
      getClinicInfo(),
    ]);

    const dashboardData = {
      upcomingAppointments: appointments,
      stats,
      user,
      clinicInfo,
      userType: "professional" as const,
      notifications: {
        count: 3,
      },
    };

    return <DashboardClient {...dashboardData} />;
  } catch (error) {
    console.error("Error loading dashboard data:", error);
    throw new Error("Failed to load dashboard data");
  }
}
