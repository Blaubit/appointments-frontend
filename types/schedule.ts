// types/schedule.ts
export interface WorkingDaySettings {
  enabled: boolean;
  start: string; // formato HH:MM
  end: string; // formato HH:MM
}

export interface ScheduleSettings {
  timezone: string;
  appointmentDuration: number; // en minutos
  bufferTime: number; // en minutos
  maxAdvanceBooking: number; // en días
  workingDays: {
    monday: WorkingDaySettings;
    tuesday: WorkingDaySettings;
    wednesday: WorkingDaySettings;
    thursday: WorkingDaySettings;
    friday: WorkingDaySettings;
    saturday: WorkingDaySettings;
    sunday: WorkingDaySettings;
  };
}

export interface ScheduleFormProps {
  initialSettings?: ScheduleSettings;
  onSave: (settings: ScheduleSettings) => Promise<void>;
  isLoading?: boolean;
}

export interface TimezoneOption {
  value: string;
  label: string;
}
