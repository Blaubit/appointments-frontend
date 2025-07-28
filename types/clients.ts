export interface Client {
  id: string;
  fullName: string; // computed: firstName + lastName
  email: string;
  phone: string;
  avatar?: string;
  status: "active" | "inactive" | "blocked";
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory?: string[];
  allergies?: string[];
  medications?: string[];
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
  };
  preferredLanguage: string;
  communicationPreferences: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
    phone: boolean;
  };
  notes?: string;
  totalAppointments: number;
  totalSpent: number;
  rating: number;
  lastAppointment?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  loyaltyPoints?: number;
  referralSource?: string;
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
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory?: string[];
  allergies?: string[];
  medications?: string[];
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
  };
  preferredLanguage: string;
  communicationPreferences: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
    phone: boolean;
  };
  notes?: string;
  tags?: string[];
  referralSource?: string;
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
