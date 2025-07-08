import type React from "react"

export type ServiceCategory = "consultation" | "treatment" | "emergency" | "specialist" | "diagnostic" | "wellness"

export interface Service {
  id: number
  name: string
  description: string
  category: ServiceCategory
  duration: number
  price: number
  color: string
  isActive: boolean
  requiresPreparation: boolean
  maxAdvanceBooking: number
  minAdvanceBooking: number
  availableSlots: string[]
  createdAt: string
  updatedAt: string
  icon?: string
  totalAppointments: number
  totalRevenue: number
  averageRating: number
  lastUsed: string
}

export interface ServiceCategoryConfig {
  id: ServiceCategory
  name: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  description: string
}

export interface ServiceStats {
  totalServices: number
  activeServices: number
  inactiveServices: number
  totalRevenue: number
  totalAppointments: number
  averagePrice: number
  mostPopular: string
  leastPopular: string
}

export interface ServiceFilters {
  search?: string
  category?: ServiceCategory
  status?: string
  priceRange?: {
    min: number
    max: number
  }
  isActive?: boolean
}

export interface ServiceFormData {
  name: string
  description: string
  category: ServiceCategory
  duration: number
  price: number
  color: string
  isActive: boolean
  requiresPreparation: boolean
  maxAdvanceBooking: number
  minAdvanceBooking: number
  availableSlots: string[]
}
