export interface Client {
  id: number
  firstName: string
  lastName: string
  name: string // computed: firstName + lastName
  email: string
  phone: string
  avatar: string
  dateOfBirth?: string
  gender?: "male" | "female" | "other"
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  medicalHistory?: string[]
  allergies?: string[]
  medications?: string[]
  insuranceInfo?: {
    provider: string
    policyNumber: string
    groupNumber?: string
  }
  preferredLanguage: string
  communicationPreferences: {
    email: boolean
    sms: boolean
    whatsapp: boolean
    phone: boolean
  }
  totalAppointments: number
  completedAppointments: number
  cancelledAppointments: number
  noShowAppointments: number
  totalSpent: number
  averageRating: number
  lastAppointment?: string
  nextAppointment?: string
  status: "active" | "inactive" | "blocked"
  notes?: string
  createdAt: string
  updatedAt: string
  tags?: string[]
  loyaltyPoints: number
  referralSource?: string
}

export interface ClientStats {
  total: number
  active: number
  inactive: number
  blocked: number
  newThisMonth: number
  newThisWeek: number
  averageRating: number
  totalRevenue: number
  averageSpent: number
  averageAppointments: number
}

export interface ClientFilters {
  search?: string
  status?: "active" | "inactive" | "blocked"
  gender?: "male" | "female" | "other"
  ageRange?: {
    min: number
    max: number
  }
  lastAppointment?: {
    from: string
    to: string
  }
  totalSpent?: {
    min: number
    max: number
  }
  tags?: string[]
  communicationPreference?: string
}

export interface ClientFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth?: string
  gender?: "male" | "female" | "other"
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  medicalHistory?: string[]
  allergies?: string[]
  medications?: string[]
  insuranceInfo?: {
    provider: string
    policyNumber: string
    groupNumber?: string
  }
  preferredLanguage: string
  communicationPreferences: {
    email: boolean
    sms: boolean
    whatsapp: boolean
    phone: boolean
  }
  notes?: string
  tags?: string[]
  referralSource?: string
}

export interface ClientSummary {
  client: Client
  upcomingAppointments: number
  recentActivity: string[]
  preferredServices: string[]
  paymentHistory: {
    total: number
    lastPayment: string
    averageAmount: number
  }
}
