import { z } from "zod";

export const appointmentSchema = z.object({
  clientName: z.string().min(1, "El nombre del paciente es obligatorio"),
  pacientemail: z.string().email("Correo electrónico inválido").optional(),
  clientPhone: z.string().min(1, "El teléfono es obligatorio"),
  professionalId: z.string().min(1, "Debe seleccionar un profesional"),
  selectedServices: z
    .array(z.string())
    .min(1, "Debe seleccionar al menos un servicio"),
  date: z.string().min(1, "Debe seleccionar una fecha"),
  time: z.string().min(1, "Debe seleccionar una hora"),
  notes: z.string().optional(),
  status: z.string().optional(),
});
