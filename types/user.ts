import { Company } from "./company";
type Role = {
  id: string;
  name: string;
  description: string;
};
type User = {
  id: string;
  avatar?: string;
  email: string;
  fullName: string;
  bio: string;
  createdAt: string;
  companyId: string;
  role: Role;
};

export type { User, Role };
