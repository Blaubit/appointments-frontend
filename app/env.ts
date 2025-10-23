import { z } from "zod";

const envSchema = z.object({
  API_URL: z.string(),
  TICKETS_URL: z.string(),
});

export const parsedEnv = envSchema.parse(process.env);
