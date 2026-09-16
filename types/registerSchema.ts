import { z } from "zod";

export const registerSchema = z.object({
  businessName: z
    .string()
    .min(3, "Business name must be at least 3 characters")
    .max(50, "Business name must be under 50 characters"),

  ownerName: z
    .string()
    .min(3, "Owner name must be at least 3 characters")
    .max(50, "Owner name must be under 50 characters"),
  email: z.email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
