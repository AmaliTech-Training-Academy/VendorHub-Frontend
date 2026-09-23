// types/registerSchema.ts
import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email().min(1, "Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["vendor", "employee"], "Please select a role"),
});
