"use client";
import { useState } from "react";
import { Header } from "@/components/header";
import { ReportFilterBar } from "@/components/reports/ReportFilterBar";
import { OverviewStatsGrid } from "@/components/reports/OverviewStatsGrid";
import { RevenueChart } from "@/components/reports/RevenueChart";
import { AppointmentsByHourChart } from "@/components/reports/AppointmentsByHourChart";
import { TopServicesList } from "@/components/reports/TopServicesList";
import { TopClientsList } from "@/components/reports/TopClientsList";
import { PerformanceMetricsGrid } from "@/components/reports/PerformanceMetricsGrid";
import { SummaryTable } from "@/components/reports/SummaryTable";
import type { ReportsPageClientProps } from "@/types/reports";
export default function ReportsPageClient({
  overviewStats,
  monthlyData,
  topServices,
  topClients,
  appointmentsByHour,
}: ReportsPageClientProps) {
  const [dateRange, setDateRange] = useState("30days");
  const [reportType, setReportType] = useState("overview");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        title="Reportes y Análisis"
        showBackButton={true}
        backButtonText="Dashboard"
        backButtonHref="/dashboard"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ReportFilterBar
          dateRange={dateRange}
          setDateRange={setDateRange}
          reportType={reportType}
          setReportType={setReportType}
        />
        <OverviewStatsGrid overviewStats={overviewStats} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <RevenueChart monthlyData={monthlyData} />
          <AppointmentsByHourChart appointmentsByHour={appointmentsByHour} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <TopServicesList topServices={topServices} />
          <TopClientsList topClients={topClients} />
        </div>
        <PerformanceMetricsGrid />
        <SummaryTable />
      </div>
    </div>
  );
}
