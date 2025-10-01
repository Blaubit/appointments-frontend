// Archivo: page.tsx (Server Component)

import ReportsPageClient from "./page.client";

const overviewStats = [
  {
    title: "Ingresos Totales",
    count: "$24,580",
    variant: "total",
    icon: "DollarSign",
    trend: "up",
    change: "+12.5%",
  },
  {
    title: "Total Citas",
    count: 342,
    variant: "confirmed",
    icon: "Calendar",
    trend: "up",
    change: "+8.2%",
  },
  {
    title: "Nuevos Clientes",
    count: 28,
    variant: "today",
    icon: "Users",
    trend: "up",
    change: "+15.3%",
  },
  {
    title: "Tasa de Cancelación",
    count: "5.2%",
    variant: "cancelled",
    icon: "AlertTriangle",
    trend: "down",
    change: "-2.1%",
  },
];

const monthlyData = [
  { month: "Ene", appointments: 85, revenue: 4250, clients: 12 },
  { month: "Feb", appointments: 92, revenue: 4600, clients: 15 },
  { month: "Mar", appointments: 78, revenue: 3900, clients: 8 },
  { month: "Apr", appointments: 105, revenue: 5250, clients: 18 },
  { month: "May", appointments: 118, revenue: 5900, clients: 22 },
  { month: "Jun", appointments: 134, revenue: 6700, clients: 25 },
];

const topServices = [
  {
    name: "Consulta General",
    appointments: 89,
    revenue: 4450,
    percentage: 26,
  },
  {
    name: "Limpieza Dental",
    appointments: 67,
    revenue: 3350,
    percentage: 20,
  },
  {
    name: "Corte y Peinado",
    appointments: 54,
    revenue: 2700,
    percentage: 16,
  },
  { name: "Terapia Física", appointments: 43, revenue: 4300, percentage: 13 },
  {
    name: "Consulta Especializada",
    appointments: 38,
    revenue: 3800,
    percentage: 11,
  },
  { name: "Otros", appointments: 51, revenue: 2550, percentage: 14 },
];

const topClients = [
  {
    name: "María González",
    appointments: 12,
    revenue: 1200,
    lastVisit: "2024-01-15",
  },
  {
    name: "Carlos Rodríguez",
    appointments: 8,
    revenue: 800,
    lastVisit: "2024-01-14",
  },
  {
    name: "Ana Martínez",
    appointments: 7,
    revenue: 875,
    lastVisit: "2024-01-13",
  },
  {
    name: "Luis Fernández",
    appointments: 6,
    revenue: 750,
    lastVisit: "2024-01-12",
  },
  {
    name: "Carmen López",
    appointments: 5,
    revenue: 625,
    lastVisit: "2024-01-11",
  },
];

const appointmentsByHour = [
  { hour: "08:00", count: 15 },
  { hour: "09:00", count: 28 },
  { hour: "10:00", count: 35 },
  { hour: "11:00", count: 42 },
  { hour: "12:00", count: 25 },
  { hour: "13:00", count: 18 },
  { hour: "14:00", count: 38 },
  { hour: "15:00", count: 45 },
  { hour: "16:00", count: 32 },
  { hour: "17:00", count: 22 },
  { hour: "18:00", count: 12 },
];

export default function ReportsPage() {
  return (
    <ReportsPageClient
      overviewStats={overviewStats}
      monthlyData={monthlyData}
      topServices={topServices}
      topClients={topClients}
      appointmentsByHour={appointmentsByHour}
    />
  );
}
