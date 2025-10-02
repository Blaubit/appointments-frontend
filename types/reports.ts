// Tipos base para los datos del dashboard financiero

export type OverviewStat = {
  title: string;
  count: string | number;
  variant: "total" | "confirmed" | "today" | "cancelled" | string;
  icon: "DollarSign" | "Calendar" | "Users" | "AlertTriangle" | string;
  trend: "up" | "down" | string;
  change: string;
};

export type MonthlyDataItem = {
  month: string; // Ejemplo: "Ene", "Feb", etc.
  appointments: number;
  revenue: number;
  clients?: number;
};

export type TopService = {
  name: string;
  appointments: number;
  revenue?: number;
  percentage: number;
};

export type TopClient = {
  name: string;
  appointments: number;
  revenue?: number;
  lastVisit: string; // ISO string o "YYYY-MM-DD"
};

export type AppointmentByHour = {
  hour: string; // "08:00", "09:00", etc.
  count: number;
};

export type ReportsPageClientProps = {
  overviewStats: OverviewStat[];
  monthlyData: MonthlyDataItem[];
  topServices: TopService[];
  topClients: TopClient[];
  appointmentsByHour: AppointmentByHour[];
};
