export type Phone = {
  id: string;
  phone: string;
};

type Company = {
  id: string;
  name: string;
  companyType: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  description: string;
  phone?: string; // legacy: primer teléfono como string
  createdAt: string;
  phones?: Phone[]; // array de objetos { id, phone }
};

interface CompanyRegistrationPayload {
  // Company data
  companyName: string;
  companyType: string;
  companyAddress: string;
  companyCity: string;
  companyState: string;
  companyPostalCode: string;
  companyCountry: string;
  companyDescription: string;
  companyPhone: string;
  // Admin data
  adminFullName: string;
  adminEmail: string;
  adminBio: string;
  // Subscription data
  planId: string;
  startDate: string;
  endDate: string;
  createdById: string;
}

export type CompanySettings = {
  id: string;
  companyId: string;
  dateFormat: string;
  hourFormat: string;
  timezone: string;
  emailNotificationsEnabled: boolean;
  whatsappNotificationsEnabled: boolean;
  systemNotificationsEnabled: boolean;
  reminderHoursBefore: number;
  defaultAppointmentDuration: number;
  allowOnlineBooking: boolean;
  requireConfirmation: boolean;
  minHoursBeforeBooking: number;
  maxHoursAdvanceBooking: number;
  primaryColor: string;
  secondaryColor: string;
  defaultLanguage: string;
  currency: string;
  createdAt: string; // ISO Date
  updatedAt: string; // ISO Date
  company: Company;
};

export type { Company, CompanyRegistrationPayload };
