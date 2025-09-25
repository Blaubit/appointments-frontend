import { z } from "zod";

// Esquema genérico de paginación (sin status)
const paginationSchema = z.object({
  limit: z.coerce.number().default(12),
  page: z.coerce.number().default(1),
  q: z.string().optional(),
});

export type PaginationParams = z.infer<typeof paginationSchema>;

// Esquema para citas (hereda de paginationSchema y añade status)
const appointmentPaginationSchema = paginationSchema.extend({
  status: z.string().optional(),
  appointmentDate: z.string().optional(),
  professionalId: z.string().optional(),
});

export type AppointmentPaginationParams = z.infer<
  typeof appointmentPaginationSchema
>;

// Parser para PaginationParams
const parsePaginationParams = (
  searchParams: URLSearchParams | undefined
): PaginationParams => {
  const searchParamsObject = Object.fromEntries(searchParams ?? []);
  return paginationSchema.parse(searchParamsObject);
};

// Parser para AppointmentPaginationParams
const parseAppointmentPaginationParams = (
  searchParams: URLSearchParams | undefined
): AppointmentPaginationParams => {
  const searchParamsObject = Object.fromEntries(searchParams ?? []);
  return appointmentPaginationSchema.parse(searchParamsObject);
};

export default parsePaginationParams;
export { parseAppointmentPaginationParams };
