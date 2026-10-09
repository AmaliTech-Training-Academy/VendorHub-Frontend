import { z } from "zod";

const vendorProfileInputSchema = z.object({
  address: z.string().trim().max(255, "Address is too long"),
  phone: z
    .string()
    .trim()
    // backend: 7-15 digits, optional leading +, no spaces
    .regex(
      /^\+?\d{7,15}$/,
      "Use 7-15 digits, optionally starting with +, no spaces",
    ),
  slogans: z
    .array(
      z.object({
        value: z
          .string()
          .trim()
          .min(1, "Slogan can't be empty")
          .max(150, "Max 150 characters"),
      }),
    )
    .max(1, "Only one slogan is supported"),
  storefrontImage: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 2 * 1024 * 1024,
      "Image must be 2MB or smaller",
    )
    .refine(
      (file) =>
        !file ||
        ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
          file.type,
        ),
      "Only JPG, PNG, WEBP or GIF images are allowed",
    ),
});

export const vendorProfileSchema = vendorProfileInputSchema;

// Matches MyStorefrontApi / StorefrontOutputSerializer exactly
const vendorProfileResponseApiSchema = z.object({
  logo: z.string().nullable().optional(),
  slogan: z.string().nullable().optional(),
  phone_number: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
});

export const vendorProfileResponseSchema =
  vendorProfileResponseApiSchema.transform((raw) => ({
    address: raw.address ?? "",
    phone: raw.phone_number ?? "",
    storefrontImageUrl: raw.logo ?? null,
    slogans: raw.slogan ? [raw.slogan] : [],
  }));
