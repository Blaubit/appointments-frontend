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

// ========== TIPOS PARA HISTORIAL CLÍNICO ==========

export interface ChronicDisease {
  id?: string; // Agregado para manejar la respuesta del API
  diseaseName: string;
  diagnosisDate: string;
  treatment: string;
  severity: string;
}

export interface Allergy {
  id?: string; // Agregado para manejar la respuesta del API
  allergen: string;
  reactionType: string;
  severity: string;
  notes: string;
}

export interface Hospitalization {
  id?: string; // Agregado para manejar la respuesta del API
  admissionDate: string;
  dischargeDate: string;
  hospital: string;
  reason: string;
  diagnosis: string;
}

export interface Medication {
  id?: string; // Agregado para manejar la respuesta del API
  medicationName: string;
  dosage: string;
  frequency: string;
  prescriptionDate: string;
  prescribingDoctor: string;
  purpose: string;
}

export interface FamilyHistory {
  id?: string; // Agregado para manejar la respuesta del API
  relative: string;
  diseaseName: string;
  ageAtDiagnosis: number;
  notes: string;
}

export interface Habit {
  id?: string; // Agregado para manejar la respuesta del API
  habitType: string;
  frequency: string;
  description: string;
  quantity: string;
  notes: string;
  startDate: string;
  endDate?: string | null;
}

export interface PatientRecord {
  gender: string;
  nationalId: string;
  birthDate: string;
  birthPlace: string;
  address: string;
  occupation: string;
  maritalStatus: string;
  chronicDiseases: ChronicDisease[];
  allergies: Allergy[];
  hospitalizations: Hospitalization[];
  currentMedications: Medication[];
  familyHistory: FamilyHistory[];
  habits: Habit[];
}

// ========== TIPOS PARA LA RESPUESTA DEL API ==========

export interface PersonalInfo {
  id: string;
  gender: string;
  nationalId: string;
  birthDate: string;
  age: number;
  birthPlace: string;
  address: string;
  occupation: string;
  maritalStatus: string;
  client: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ClinicalHistoryRecord {
  id: string;
  clientPersonalInfoId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClinicalHistoryData {
  clinicalHistory: ClinicalHistoryRecord;
  chronicDiseases: ChronicDisease[];
  previousSurgeries: any[]; // Puedes definir un tipo más específico si lo necesitas
  allergies: Allergy[];
  hospitalizations: Hospitalization[];
  currentMedications: Medication[];
  familyHistory: FamilyHistory[];
  habits: Habit[];
}

export interface ClinicalHistoryResponse {
  success: boolean;
  data: {
    personalInfo: PersonalInfo;
    clinicalHistory: ClinicalHistoryData;
  };
}
