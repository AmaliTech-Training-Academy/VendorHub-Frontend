import { z } from "zod";

export const registerSchema = z.object({
  businessName: z.string("Please this field required only string"),
  ownerName: z.string("Please this field required only strings"),
  email: z.email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
