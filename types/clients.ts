export interface Client {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "blocked";
  avatar?: string;
  totalAppointments: number;
  totalSpent: number;
  rating: number;
  lastAppointment?: string;
  createdAt: string;
  tags?: string[];
  notes?: string;
  // ... otros campos que ya tengas
}
export interface ClientStats {
  totalClients: number;
  activeClients: number;
  newThisMonth: number;
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
  id?:string;
  fullName: string;
  email: string;
  phone: string;
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
