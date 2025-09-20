import { Company } from "./company";
export interface Client {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  rating: string;
  avatar: string;
  createdAt: string;
  status?: "active" | "inactive" | "blocked";
  totalAppointments?: number;
  totalSpent?: number;
  lastAppointment?: string;
  tags?: string[];
  company?: Company;
}
export interface ClientStats {
  totalClients: number;
  activeClients: number;
  newClientsLastDays: number;
  averageRating: number;
}

export interface ClientFilters {
  search?: string;
  status?: "all" | "active" | "inactive" | "blocked";
  gender?: "male" | "female" | "other";
  ageRange?: {
    min: number;
    max: number;
  };
  lastAppointment?: {
    from: string;
    to: string;
  };
  totalSpent?: {
    min: number;
    max: number;
  };
  tags?: string[];
  communicationPreference?: string;
  dateRange?: {
    from: string;
    to: string;
  };
}

export interface ClientFormData {
  fullName: string;
  email: string;
  phone: string;
}
export interface ClientEditFormData {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
}
export interface RateClientFormData {
  id?: string;
  rating?: number;
}
export interface AttendAppointmentData {
  id: string;
  observations?: string;
  treatment: string;
  diagnosis?: string;
}

export interface ClientSummary {
  client: Client;
  upcomingAppointments: number;
  recentActivity: string[];
  preferredServices: string[];
  paymentHistory: {
    total: number;
    lastPayment: string;
    averageAmount: number;
  };
}
