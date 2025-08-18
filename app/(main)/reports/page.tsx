"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Clock,
  Download,
  FileText,
  Target,
  Star,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("30days");
  const [reportType, setReportType] = useState("overview");

  // Mock data - in real app this would come from API
  const overviewStats = [
    {
      title: "Ingresos Totales",
      value: "$24,580",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900",
    },
    {
      title: "Total Citas",
      value: "342",
      change: "+8.2%",
      trend: "up",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900",
    },
    {
      title: "Nuevos Clientes",
      value: "28",
      change: "+15.3%",
      trend: "up",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900",
    },
    {
      title: "Tasa de Cancelación",
      value: "5.2%",
      change: "-2.1%",
      trend: "down",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900",
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
      apartments: 38,
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

  const maxAppointments = Math.max(
    ...appointmentsByHour.map((item) => item.count),
  );
  const maxRevenue = Math.max(...monthlyData.map((item) => item.revenue));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header
        title="Reportes y Análisis"
        showBackButton={true}
        backButtonText="Dashboard"
        backButtonHref="/dashboard"
          />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Actions */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <CardTitle>Panel de Reportes</CardTitle>
                <CardDescription>
                  Analiza el rendimiento de tu negocio
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar PDF
                </Button>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Exportar Excel
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-48">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Últimos 7 días</SelectItem>
                    <SelectItem value="30days">Últimos 30 días</SelectItem>
                    <SelectItem value="90days">Últimos 3 meses</SelectItem>
                    <SelectItem value="6months">Últimos 6 meses</SelectItem>
                    <SelectItem value="1year">Último año</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full md:w-48">
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de reporte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overview">Resumen General</SelectItem>
                    <SelectItem value="financial">Financiero</SelectItem>
                    <SelectItem value="appointments">Citas</SelectItem>
                    <SelectItem value="clients">Clientes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {overviewStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      {stat.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span
                        className={`text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
                        vs mes anterior
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Ingresos Mensuales</CardTitle>
              <CardDescription>
                Evolución de ingresos en los últimos 6 meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyData.map((data, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-12 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {data.month}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          ${data.revenue.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {data.appointments} citas
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${(data.revenue / maxRevenue) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Appointments by Hour */}
          <Card>
            <CardHeader>
              <CardTitle>Citas por Hora</CardTitle>
              <CardDescription>
                Distribución de citas durante el día
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {appointmentsByHour.map((data, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-16 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {data.hour}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {data.count} citas
                        </span>
                        <span className="text-xs text-gray-500">
                          {Math.round((data.count / maxAppointments) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${(data.count / maxAppointments) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Services */}
          <Card>
            <CardHeader>
              <CardTitle>Servicios Más Populares</CardTitle>
              <CardDescription>
                Ranking de servicios por número de citas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topServices.map((service, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {service.name}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          ${service.revenue.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {service.appointments} citas
                        </span>
                        <Badge variant="secondary">{service.percentage}%</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Clients */}
          <Card>
            <CardHeader>
              <CardTitle>Mejores Clientes</CardTitle>
              <CardDescription>
                Clientes con mayor frecuencia de visitas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topClients.map((client, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src="/Avatar1.png?height=40&width=40" />
                      <AvatarFallback>
                        {client.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {client.name}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          ${client.revenue.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {client.appointments} citas
                        </span>
                        <span className="text-xs text-gray-400">
                          Última: {client.lastVisit}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tiempo Promedio por Cita
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45 min</div>
              <p className="text-xs text-muted-foreground">
                +2 min vs mes anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tasa de Ocupación
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">
                +5% vs mes anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Satisfacción Cliente
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8/5</div>
              <p className="text-xs text-muted-foreground">
                +0.2 vs mes anterior
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Summary Table */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen Detallado</CardTitle>
            <CardDescription>
              Métricas clave del período seleccionado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Métrica
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Valor Actual
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Mes Anterior
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Cambio
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      Ingresos Totales
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      $24,580
                    </td>
                    <td className="py-3 px-4 text-right text-gray-500">
                      $21,840
                    </td>
                    <td className="py-3 px-4 text-right text-green-600">
                      +12.5%
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      Total de Citas
                    </td>
                    <td className="py-3 px-4 text-right font-medium">342</td>
                    <td className="py-3 px-4 text-right text-gray-500">316</td>
                    <td className="py-3 px-4 text-right text-green-600">
                      +8.2%
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      Nuevos Clientes
                    </td>
                    <td className="py-3 px-4 text-right font-medium">28</td>
                    <td className="py-3 px-4 text-right text-gray-500">24</td>
                    <td className="py-3 px-4 text-right text-green-600">
                      +15.3%
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      Citas Canceladas
                    </td>
                    <td className="py-3 px-4 text-right font-medium">18</td>
                    <td className="py-3 px-4 text-right text-gray-500">23</td>
                    <td className="py-3 px-4 text-right text-green-600">
                      -21.7%
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      Ingreso Promedio por Cita
                    </td>
                    <td className="py-3 px-4 text-right font-medium">$71.87</td>
                    <td className="py-3 px-4 text-right text-gray-500">
                      $69.11
                    </td>
                    <td className="py-3 px-4 text-right text-green-600">
                      +4.0%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
