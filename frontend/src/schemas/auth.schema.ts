import { z } from "zod";

export const loginSchema = z.object({
  login: z.string().min(3, "Minimum 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type LoginFields = z.infer<typeof loginSchema>;
