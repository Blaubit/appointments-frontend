import { Company } from "./company";

export type Plan = {
  id: string;
  name: string;
  price: number;
  billingCycle: number;
  description: string;
  status: string;
};

export type Subscription = {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
  currentUsers: number;
  company: Company;
  plan: Plan;
};
