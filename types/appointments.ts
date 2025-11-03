import { Client } from "./clients"; // Existing types with additions for backend data
import { Company } from "./company";
import { User } from "./user"; // Assuming User is defined in ./user
import { Service } from "./services";

interface Payment {
  id: string;
  appointmentId: string;
  amount: string;
  status: string;
  paymentMethod: string;
  paymentDate: string;
  reference: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
interface consultationNotes {
  observations: string;
  diagnosis: string;
  treatment: string;
}
export interface Appointment {
  id: string;
  appointmentDate: Date;
  startTime: string;
  endTime: string;
  status: string; // e.g., "confirmed", "pending", "cancelled"
  notes?: string;
  createdAt: Date;
  company: Company;
  client: Client; // Client is defined in ./clients
  professional: User; // User is defined in ./user
  services: Service[]; // Service is defined in ./services
  payment: Payment; // Payment details
  createdBy?: User; // User who created the appointment
  consultationNotes?: consultationNotes; // Notes from the consultation
}

export interface AppointmentStats {
  todayCount: number;
  tomorrowCount: number;
  confirmedCount: number;
  pendingCount: number;
  cancelledCount: number;
}

export interface CompanyTypes {
  value: string;
  label: string;
}
export interface Pagination {
  page: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}
export interface ClientAppointmentsStats {
  totalCount: number;
  completed: number;
  totalAmountSpent: number;
  resecheduled: number;
  cancelled: number;
}
