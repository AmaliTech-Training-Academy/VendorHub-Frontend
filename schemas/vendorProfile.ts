import { z } from "zod";

const vendorProfileInputSchema = z.object({
  address: z.string().trim().min(1, "Address is required").max(255),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(20, "Phone number is too long"),
  slogans: z
    .array(
      z.object({
        value: z
          .string()
          .trim()
          .min(1, "Slogan can't be empty")
          .max(80, "Keep it short — under 80 characters"),
      }),
    )
    .min(1, "Add at least one slogan")
    .max(5, "Up to 5 slogans"),
  storefrontImage: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      "Image must be under 5MB",
    )
    .refine(
      (file) =>
        !file || ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Only JPG, PNG, or WEBP images are allowed",
    ),
});

export const vendorProfileSchema = vendorProfileInputSchema;
