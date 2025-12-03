import { User } from "@/types/user";

export type PeriodType = "day" | "week" | "month";

export interface Period {
  type: PeriodType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

export interface WorkingHours {
  start: string | null; // HH:mm:ss o null
  end: string | null; // HH:mm:ss o null
}

export type DayName =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface OccupiedSlot {
  startTime: string; // HH:mm:ss
  endTime: string; // HH:mm:ss
  appointmentId: string;
  clientName: string;
  serviceName: string;
}

// Nuevo: Tipo para las restricciones
export type RestrictionType = "full-day" | "partial" | null;

// Nuevo: Interface para los detalles de restricciones
export interface Restriction {
  reason: string | null;
  startTime: string | null; // HH:mm:ss - null para full-day
  endTime: string | null; // HH:mm:ss - null para full-day
}

export type PeriodResponse = {
  professional: User;
  period: Period;
  allowOverlap: boolean; // Agregado
  schedule: ScheduleDay[];
};

export interface ScheduleDay {
  date: string; // YYYY-MM-DD
  dayName: DayName;
  isRestricted: boolean; // Nuevo
  restrictionType: RestrictionType; // Nuevo
  availableHours: string[]; // ["09:00", "09:30", ...]
  occupiedSlots: OccupiedSlot[];
  workingHours: WorkingHours;
  restrictions?: Restriction[]; // Nuevo - opcional, solo presente cuando isRestricted es true
}
