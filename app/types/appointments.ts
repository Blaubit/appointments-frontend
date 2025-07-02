export interface Appointment {
  id: number
  clientName: string
  clientEmail: string
  clientPhone: string
  service: string
  time: string
  date: string
  dateFormatted: string
  status: "confirmed" | "pending" | "cancelled"
  duration: number
  notes: string
  avatar: string
}

export interface AppointmentStats {
  total: number
  confirmed: number
  pending: number
  cancelled: number
}

export interface AppointmentFilters {
  search: string
  status: string
  date: string
}
