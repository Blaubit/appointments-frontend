export interface Company {
  id: string
  name: string
  companyType: string
  address: string
  city: string
  state: string
  postal_code: string
  country: string
  description: string
  contactEmail: string
  contactPhone: string
  createdAt: string
  updatedAt: string
  isActive: boolean
  subscription: Subscription
  users: CompanyUser[]
}

export interface Subscription {
  id: string
  companyId: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  currentPeriodStart: string
  currentPeriodEnd: string
  nextBillingDate: string
  amount: number
  currency: string
  paymentMethod: string
  lastPaymentDate?: string
  createdAt: string
  updatedAt: string
}

export interface CompanyUser {
  id: string
  companyId: string
  name: string
  email: string
  role: "admin" | "doctor" | "secretary"
  isActive: boolean
  lastLogin?: string
  createdAt: string
}

export interface Payment {
  id: string
  companyId: string
  subscriptionId: string
  amount: number
  currency: string
  status: PaymentStatus
  paymentDate: string
  paymentMethod: string
  transactionId?: string
  notes?: string
  createdAt: string
}

export type SubscriptionPlan = "basic" | "professional" | "enterprise"
export type SubscriptionStatus = "active" | "past_due" | "canceled" | "unpaid" | "trialing"
export type PaymentStatus = "paid" | "pending" | "failed" | "refunded"

export interface SaaSMetrics {
  totalCompanies: number
  activeCompanies: number
  totalRevenue: number
  monthlyRevenue: number
  churnRate: number
  newSignups: number
  overduePayments: number
}

export interface CreatePaymentData {
  companyId: string
  amount: number
  paymentDate: string
  paymentMethod: string
  transactionId?: string
  notes?: string
}
