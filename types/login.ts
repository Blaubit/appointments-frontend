import type { User } from "@/types/user";
type LoginResponse = {
  token: string;
  expiresIn: number;
};

export type { LoginResponse };
