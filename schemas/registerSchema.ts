// types/registerSchema.ts
import { z } from "zod";

export const vendorRegisterSchema = z.object({
  role: z.literal("VENDOR"),
  email: z.email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  businessName: z.string().min(1, "Business name is required").max(255),
  ownerName: z.string().min(1, "Owner name is required").max(255),
});

export const employeeRegisterSchema = z.object({
  role: z.literal("EMPLOYEE"),
  email: z.email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(1, "Full name is required").max(255),
  officeAddress: z.string().min(1),
  phone: z
    .union([z.string(), z.number()])
    .nullable()
    .optional()
    .transform((val) => {
      if (val === null || val === undefined) {
        return "";
      }
      return String(val);
    }),
});

export const registerSchema = z.discriminatedUnion("role", [
  vendorRegisterSchema,
  employeeRegisterSchema,
]);

export type VendorRegisterFormData = z.infer<typeof vendorRegisterSchema>;
export type EmployeeRegisterFormData = z.infer<typeof employeeRegisterSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
