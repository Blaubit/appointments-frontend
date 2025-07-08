import type { ReadonlyURLSearchParams } from "next/navigation"
import PageClient from "./page.client"
import type { Appointment, AppointmentStats, Pagination } from "@/app/types"

type Props = {
  searchParams: ReadonlyURLSearchParams
}

export default async function Page({ searchParams }: Props) {
  //const params = new URLSearchParams(searchParams)

  // Mock data - in real app this would come from database
  const allAppointments: Appointment[] = [
    {
      id: 1,
      clientName: "María González",
      clientEmail: "maria@email.com",
      clientPhone: "+1 (555) 123-4567",
      service: "Consulta General",
      time: "09:00",
      date: "2024-01-15",
      dateFormatted: "Hoy",
      status: "confirmed",
      duration: 30,
      notes: "Primera consulta, revisar historial médico",
      avatar: "/Avatar1.png?height=40&width=40",
    },
    {
      id: 2,
      clientName: "Carlos Rodríguez",
      clientEmail: "carlos@email.com",
      clientPhone: "+1 (555) 234-5678",
      service: "Limpieza Dental",
      time: "10:30",
      date: "2024-01-15",
      dateFormatted: "Hoy",
      status: "pending",
      duration: 45,
      notes: "Paciente con sensibilidad dental",
      avatar: "/Avatar1.png?height=40&width=40",
    },
    {
      id: 3,
      clientName: "Ana Martínez",
      clientEmail: "ana@email.com",
      clientPhone: "+1 (555) 345-6789",
      service: "Corte y Peinado",
      time: "14:00",
      date: "2024-01-16",
      dateFormatted: "Mañana",
      status: "confirmed",
      duration: 60,
      notes: "Corte bob y mechas",
      avatar: "/Avatar1.png?height=40&width=40",
    },
    {
      id: 4,
      clientName: "Luis Fernández",
      clientEmail: "luis@email.com",
      clientPhone: "+1 (555) 456-7890",
      service: "Consulta Especializada",
      time: "11:00",
      date: "2024-01-16",
      dateFormatted: "Mañana",
      status: "cancelled",
      duration: 45,
      notes: "Cancelado por el paciente",
      avatar: "/Avatar1.png?height=40&width=40",
    },
    {
      id: 5,
      clientName: "Carmen López",
      clientEmail: "carmen@email.com",
      clientPhone: "+1 (555) 567-8901",
      service: "Terapia Física",
      time: "15:30",
      date: "2024-01-17",
      dateFormatted: "Pasado mañana",
      status: "confirmed",
      duration: 90,
      notes: "Sesión de rehabilitación",
      avatar: "/Avatar1.png?height=40&width=40",
    },
    {
      id: 6,
      clientName: "Roberto Silva",
      clientEmail: "roberto@email.com",
      clientPhone: "+1 (555) 678-9012",
      service: "Revisión Rutinaria",
      time: "08:30",
      date: "2024-01-18",
      dateFormatted: "Jueves",
      status: "pending",
      duration: 30,
      notes: "Chequeo anual",
      avatar: "/Avatar1.png?height=40&width=40",
    },
    {
      id: 7,
      clientName: "Isabel García",
      clientEmail: "isabel@email.com",
      clientPhone: "+1 (555) 789-0123",
      service: "Manicure y Pedicure",
      time: "16:00",
      date: "2024-01-19",
      dateFormatted: "Viernes",
      status: "confirmed",
      duration: 75,
      notes: "Manicure francesa",
      avatar: "/Avatar1.png?height=40&width=40",
    },
    {
      id: 8,
      clientName: "Miguel Torres",
      clientEmail: "miguel@email.com",
      clientPhone: "+1 (555) 890-1234",
      service: "Reparación Express",
      time: "12:00",
      date: "2024-01-20",
      dateFormatted: "Sábado",
      status: "pending",
      duration: 45,
      notes: "Reparación urgente",
      avatar: "/Avatar1.png?height=40&width=40",
    },
  ]

  // Apply server-side filters based on search params
  const searchTerm =""
  const statusFilter = "all"
  const dateFilter =  "all"

  let filteredAppointments = allAppointments

  // Server-side search filtering
  if (searchTerm) {
    filteredAppointments = filteredAppointments.filter(
      (appointment) =>
        appointment.clientName.toLowerCase().includes(searchTerm) ||
        appointment.service.toLowerCase().includes(searchTerm),
    )
  }

  // Server-side status filtering
  if (statusFilter !== "all") {
    filteredAppointments = filteredAppointments.filter((appointment) => appointment.status === statusFilter)
  }

  // Server-side date filtering
  if (dateFilter !== "all") {
    if (dateFilter === "today") {
      filteredAppointments = filteredAppointments.filter((appointment) => appointment.dateFormatted === "Hoy")
    } else if (dateFilter === "tomorrow") {
      filteredAppointments = filteredAppointments.filter((appointment) => appointment.dateFormatted === "Mañana")
    } else if (dateFilter === "week") {
      filteredAppointments = filteredAppointments.filter((appointment) =>
        ["Hoy", "Mañana", "Pasado mañana", "Jueves", "Viernes", "Sábado"].includes(appointment.dateFormatted),
      )
    }
  }

  // Calculate stats from all appointments (not filtered)
  const stats: AppointmentStats = {
    total: allAppointments.length,
    confirmed: allAppointments.filter((a) => a.status === "confirmed").length,
    pending: allAppointments.filter((a) => a.status === "pending").length,
    cancelled: allAppointments.filter((a) => a.status === "cancelled").length,
  }

  // Pagination metadata
  const pagination: Pagination = {
    page: Number.parseInt("1"),
    totalPages: Math.ceil(filteredAppointments.length / 10),
    totalItems: filteredAppointments.length,
    itemsPerPage: 1,
    hasNext: false,
    hasPrev: false,
    
  }

  return <PageClient appointments={filteredAppointments} stats={stats} pagination={pagination} />
}
