// Archivo: page.tsx (Server Component adaptado a datos backend)

import formatCurrency from "@/utils/functions/formatCurrency";
import ReportsPageClient from "./page.client";
import { findAll } from "@/actions/reports/findReportsDashboard";

export default async function ReportsPage() {
  // Llamada a tu backend (puedes ajustar si necesitas params)
  const response = await findAll();
  // Si la API retorna un objeto con data, úsalo, si no, usa el propio objeto
  const report = response.data || response;

  // Adaptar datos del backend al formato esperado por ReportsPageClient
  // Overview Stats
  const overviewStats = [
    {
      title: "Ingresos Totales",
      count: report.income?.currentMonth?.total
        ? `${formatCurrency(report.income.currentMonth.total)}`
        : "-",
      variant: "total",
      icon: "DollarSign",
      trend: report.income?.comparison?.isPositive ? "up" : "down",
      change:
        report.income?.comparison?.percentageChange !== undefined
          ? (report.income.comparison.isPositive ? "+" : "-") +
            Math.abs(report.income.comparison.percentageChange) +
            "%"
          : "-",
    },
    {
      title: "Total Citas",
      count: report.appointments?.currentMonth?.total ?? "-",
      variant: "confirmed",
      icon: "Calendar",
      trend: report.appointments?.comparison?.isPositive ? "up" : "down",
      change:
        report.appointments?.comparison?.percentageChange !== undefined
          ? (report.appointments.comparison.isPositive ? "+" : "-") +
            Math.abs(report.appointments.comparison.percentageChange) +
            "%"
          : "-",
    },
    {
      title: "Nuevos pacientes",
      count: report.clients?.newClients ?? "-",
      variant: "today",
      icon: "Users",
      trend: report.clients?.isPositive ? "up" : "down",
      change:
        report.clients?.percentageChange !== undefined
          ? (report.clients.isPositive ? "+" : "-") +
            Math.abs(report.clients.percentageChange) +
            "%"
          : "-",
    },
    {
      title: "Tasa de Cancelación",
      count:
        report.cancellationRate?.cancellationRate !== undefined
          ? report.cancellationRate.cancellationRate.toFixed(1) + "%"
          : "-",
      variant: "cancelled",
      icon: "AlertTriangle",
      trend: report.cancellationRate?.isPositive ? "up" : "down",
      change:
        report.cancellationRate?.percentageChange !== undefined
          ? (report.cancellationRate.isPositive ? "+" : "-") +
            Math.abs(report.cancellationRate.percentageChange) +
            "%"
          : "-",
    },
  ];

  // Monthly Data (para el gráfico de ingresos mensuales)
  const monthlyData =
    report.monthlyIncome?.monthlyData?.map((data: any) => ({
      month: data.month.substring(0, 3), // "Ene", "Feb", etc.
      appointments: data.appointments,
      revenue: data.income,
      clients: undefined, // Si tienes campo para pacientes aquí ponlo, si no déjalo undefined
    })) ?? [];

  // Top Services
  const topServices =
    report.topServices?.topServices?.map((service: any) => ({
      name: service.serviceName,
      appointments: service.appointmentCount,
      revenue: undefined, // Si tienes revenue por servicio, agrégalo aquí
      percentage: service.percentage,
    })) ?? [];

  // Top Clients
  const topClients =
    report.topClients?.topClients?.map((client: any) => ({
      name: client.clientName,
      appointments: client.appointmentCount,
      revenue: undefined, // Si tienes revenue por paciente, agrégalo aquí
      lastVisit: client.lastAppointmentDate,
    })) ?? [];

  // Appointments by Hour
  const appointmentsByHour =
    report.hourlyAppointments?.hourlyData?.map((item: any) => ({
      hour: item.hourDisplay,
      count: item.appointments,
    })) ?? [];

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
