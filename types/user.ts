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
  company: Company;
  role: Role;
};
export type MeUser = {
  id: string;
  fullName: string;
  email: string;
  avatar: string;
  bio: string;
  companyId: string;
  roleId: string;
  role: Role;
};
// Roles predefinidos del sistema
export const DEFAULT_ROLES: Role[] = [
  {
    id: "admin_empresa",
    name: "Administrador de Empresa",
    description: "Acceso completo a la gestión de la empresa",
  },
  {
    id: "profesional",
    name: "Profesional",
    description: "Doctor, dentista u otro profesional de la salud",
  },
  {
    id: "secretaria",
    name: "Secretaria",
    description: "Asistente administrativa para gestión de citas",
  },
];

export interface RegistrationData {
  // Datos de la empresa
  company: Company;
  // Datos del usuario administrador
  user: {
    email: string;
    fullName: string;
    password: string;
    confirmPassword: string;
    bio?: string;
  };
}

export type { User, Role };
