import type { User } from "@/types/user";
type LoginResponse = {
  success: boolean;
  data: {
    token: string;
    user: User;
    expiresIn: number;
  };
  message?: string;
};

export type { LoginResponse };
