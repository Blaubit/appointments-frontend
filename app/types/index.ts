// Common types
export * from "./common"

// Domain types
export * from "./appointments"
export * from "./services"
export * from "./clients"
export * from "./whatsapp-bot"

// Re-export commonly used types for convenience
export type { User, Notification, Pagination } from "./common"
export type { Appointment, AppointmentStats } from "./appointments"
export type { Service, ServiceStats } from "./services"
export type { Client, ClientStats } from "./clients"
export type { BotFlow, BotMessage, BotStats } from "./whatsapp-bot"
