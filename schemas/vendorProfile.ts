import { z } from "zod";

import { parseDecimal } from "@/lib/api/mapping";
import {
  WEEKDAYS,
  storedTimeWindowSchema,
} from "@/schemas/deliverySettingsSchema";

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

const vendorProfileResponseApiSchema = z.object({
  id: z.number(),
  business_name: z.string(),
  email: z.email(),
  address: z.string().nullable(),
  phone: z.string().nullable(),
  categories: z.array(z.string()).nullable(),
  delivery_fee: z.string().nullable(),
  available_days: z.array(z.enum(WEEKDAYS)).nullable(),
  delivery_windows: z.array(storedTimeWindowSchema).nullable(),
  storefront_image: z.string().nullable(),
  slogans: z.array(z.string()).nullable(),
});

export const vendorProfileResponseSchema =
  vendorProfileResponseApiSchema.transform((raw) => ({
    id: raw.id,
    name: raw.business_name,
    email: raw.email,
    address: raw.address ?? "",
    phone: raw.phone ?? "",
    categories: raw.categories ?? [],
    deliveryFee:
      raw.delivery_fee === null ? null : parseDecimal(raw.delivery_fee),
    availableDays: raw.available_days ?? [],
    timeWindows: raw.delivery_windows ?? [],
    storefrontImageUrl: raw.storefront_image,
    slogans: raw.slogans ?? [],
  }));
