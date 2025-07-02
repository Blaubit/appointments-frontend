import type { ReadonlyURLSearchParams } from "next/navigation"
import PageClient from "./page.client"

type Props = {
  searchParams: ReadonlyURLSearchParams
}

export default async function Page({ searchParams }: Props) {


  // Mock data - in real app this would come from database
  const allServices = [
    {
      id: 1,
      name: "Consulta General",
      description: "Consulta médica general para diagnóstico y seguimiento de pacientes",
      category: "medical",
      duration: 30,
      price: 50,
      color: "#3B82F6",
      isActive: true,
      totalAppointments: 156,
      totalRevenue: 7800,
      averageRating: 4.8,
      lastUsed: "2024-01-15",
    },
    {
      id: 2,
      name: "Limpieza Dental",
      description: "Limpieza profesional y revisión dental completa",
      category: "dental",
      duration: 45,
      price: 75,
      color: "#10B981",
      isActive: true,
      totalAppointments: 89,
      totalRevenue: 6675,
      averageRating: 4.9,
      lastUsed: "2024-01-14",
    },
    {
      id: 3,
      name: "Corte y Peinado",
      description: "Corte de cabello y peinado profesional para hombres y mujeres",
      category: "beauty",
      duration: 60,
      price: 40,
      color: "#F59E0B",
      isActive: true,
      totalAppointments: 234,
      totalRevenue: 9360,
      averageRating: 4.7,
      lastUsed: "2024-01-15",
    },
    {
      id: 4,
      name: "Terapia Física",
      description: "Sesión de rehabilitación y terapia física especializada",
      category: "therapy",
      duration: 90,
      price: 100,
      color: "#8B5CF6",
      isActive: true,
      totalAppointments: 67,
      totalRevenue: 6700,
      averageRating: 4.9,
      lastUsed: "2024-01-13",
    },
    {
      id: 5,
      name: "Consulta Especializada",
      description: "Consulta con especialista para casos complejos",
      category: "medical",
      duration: 45,
      price: 120,
      color: "#EF4444",
      isActive: true,
      totalAppointments: 43,
      totalRevenue: 5160,
      averageRating: 4.8,
      lastUsed: "2024-01-12",
    },
    {
      id: 6,
      name: "Revisión Rutinaria",
      description: "Chequeo médico rutinario y preventivo",
      category: "medical",
      duration: 30,
      price: 60,
      color: "#06B6D4",
      isActive: false,
      totalAppointments: 28,
      totalRevenue: 1680,
      averageRating: 4.6,
      lastUsed: "2024-01-08",
    },
    {
      id: 7,
      name: "Manicure y Pedicure",
      description: "Cuidado completo de uñas de manos y pies",
      category: "beauty",
      duration: 75,
      price: 35,
      color: "#EC4899",
      isActive: true,
      totalAppointments: 145,
      totalRevenue: 5075,
      averageRating: 4.8,
      lastUsed: "2024-01-14",
    },
    {
      id: 8,
      name: "Reparación Express",
      description: "Servicio rápido de reparación y mantenimiento",
      category: "maintenance",
      duration: 45,
      price: 80,
      color: "#F97316",
      isActive: true,
      totalAppointments: 92,
      totalRevenue: 7360,
      averageRating: 4.5,
      lastUsed: "2024-01-15",
    },
  ]

  // Apply filters based on search params
  const searchTerm =  ""
  const categoryFilter =  "all"
  const statusFilter = "all"

  let filteredServices = allServices

  //if (searchTerm) {
  //  filteredServices = filteredServices.filter(
  //    (service) =>
  //      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //      service.description.toLowerCase().includes(searchTerm.toLowerCase()),
  //  )
  //}

  if (categoryFilter !== "all") {
    filteredServices = filteredServices.filter((service) => service.category === categoryFilter)
  }

  if (statusFilter !== "all") {
    filteredServices = filteredServices.filter((service) =>
      statusFilter === "active" ? service.isActive : !service.isActive,
    )
  }

  const pagination = {
    totalItems: filteredServices.length,
    totalPages: Math.ceil(filteredServices.length / 10),
    page: Number.parseInt( "1"),
  }

  return <PageClient services={filteredServices} pagination={pagination} />
}
