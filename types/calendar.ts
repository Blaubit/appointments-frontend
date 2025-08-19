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

export interface ScheduleDay {
  date: string; // YYYY-MM-DD
  dayName: DayName;
  availableHours: string[]; // ["09:00", "09:30", ...]
  occupiedSlots: OccupiedSlot[];
  workingHours: WorkingHours;
}

export interface ScheduleResponse {
  professional: User;
  period: Period;
  schedule: ScheduleDay[];
}
