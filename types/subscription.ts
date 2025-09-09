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

export type Payment = {
  id: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  status: string;
  reference: string;
  subscription: Subscription;
};
