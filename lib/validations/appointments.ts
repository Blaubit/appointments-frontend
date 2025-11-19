import { z } from "zod";

export const appointmentSchema = z.object({
  clientName: z.string().min(1, "El nombre del paciente es obligatorio"),
  pacientemail: z.preprocess(
    (val) => {
      // Si es cadena, la normalizamos: trim y convertimos "" a undefined
      if (typeof val === "string") {
        const v = val.trim();
        return v === "" ? undefined : v;
      }
      return val;
    },
    // Después del preprocess, si viene undefined pasa (opcional), si viene string se valida como email.
    z.string().email("Correo electrónico inválido").optional()
  ),
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
