// lib/validations/auth.ts
import { z } from "zod";

// Esquema de validación para login
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Por favor ingresa un correo electrónico válido")
    .max(255, "El correo electrónico es demasiado largo"),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "La contraseña es demasiado larga"),
  remember: z.boolean().optional().default(false),
});

// Tipo TypeScript inferido del esquema
export type LoginFormData = z.infer<typeof loginSchema>;

// Función helper para validar los datos del formulario
export function validateLoginData(data: unknown) {
  return loginSchema.safeParse(data);
}
