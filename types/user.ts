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
]

export interface RegistrationData {
  // Datos de la empresa
  company: Company ,
  // Datos del usuario administrador
  user: {
    email: string
    fullName: string
    password: string
    confirmPassword: string
    bio?: string
  }
}


export type { User, Role };
