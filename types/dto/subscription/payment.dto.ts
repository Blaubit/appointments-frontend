export interface PaymentDto {
  subscriptionId: string;
  amount: number;
  paymentDate: string; // ISO date string (e.g. "2023-01-01")
  paymentMethod: "card" | "cash" | "transfer" | string;
  status: "completed" | "pending" | "failed" | string;
}
