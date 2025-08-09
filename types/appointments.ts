import { Client } from "./clients"; // Existing types with additions for backend data
import { Company } from "./company";
import { User } from "./user"; // Assuming User is defined in ./user
import { Service } from "./services";

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
  service: Service; // Service is defined in ./services
}

export interface AppointmentStats {
  todayCount: number;
  tomorrowCount: number;
  confirmedCount: number;
  pendingCount: number;
  cancelledCount: number;
}

export interface Pagination {
  page: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}
