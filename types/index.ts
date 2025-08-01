// Common types
export * from "./common";

// Domain types
export * from "./appointments";
export * from "./services";
export * from "./clients";
export * from "./whatsapp-bot";

// Re-export commonly used types for convenience
export type { Notification, Pagination } from "./common";
export type { Appointment, AppointmentStats } from "./appointments";
export type { Service, ServiceStats } from "./services";
export type { Client, ClientStats } from "./clients";
export type { BotFlow, BotMessage, BotStats } from "./whatsapp-bot";
export type {
  NotificationSettings,
  NotificationFormProps,
} from "./notifications";
export type {
  WorkingDaySettings,
  ScheduleFormProps,
  ScheduleSettings,
  TimezoneOption,
} from "./schedule";
export type { SecurityData, SecurityFormProps } from "./security";
export type {
  AppearanceSettings,
  Language,
  Currency,
  AppearanceSettingsProps,
} from "./appearence";
export type { User, Role } from "./user";
export type { LoginResponse } from "./login";