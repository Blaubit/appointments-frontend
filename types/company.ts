type Company = {
  id: string;
  name: string;
  companyType: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  description: string;
  createdAt: string;
  phones?: string[];
};

type phone = {
  id: string;
  phone: string;
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
  // Admin data
  adminFullName: string;
  adminEmail: string;
  adminPassword: string;
  adminBio: string;
  // Subscription data
  planId: string;
  startDate: string;
  endDate: string;
  createdById: string;
}

export type { Company, CompanyRegistrationPayload };
