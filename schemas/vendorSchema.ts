import { z } from "zod";

import { parseDecimal } from "@/lib/api/mapping";
import { WEEKDAYS } from "@/schemas/deliverySettingsSchema";

const weekdaySchema = z
  .string()
  .transform(
    (day) =>
      WEEKDAYS.find((w) => w.toLowerCase() === day.toLowerCase()) ?? null,
  );

const windowApiSchema = z.object({
  id: z.number(),
  window_name: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  sort_order: z.number().optional(),
});

const storefrontApiSchema = z
  .object({
    logo: z.string().nullable().optional(),
    slogan: z.string().nullable().optional(),
    phone_number: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
  })
  .nullable()
  .optional();

export const vendorApiSchema = z.object({
  id: z.number(),
  business_name: z.string(),
  categories: z.array(z.string()).nullable().optional(),
  delivery_fee: z.string().nullable().optional(),
  available_days: z.array(weekdaySchema).nullable().optional(),
  delivery_windows: z.array(windowApiSchema).nullable().optional(),
  storefront: storefrontApiSchema,
});

export const vendorSchema = vendorApiSchema.transform((raw) => {
  const sf = raw.storefront;
  return {
    id: raw.id,
    name: raw.business_name,
    categories: raw.categories ?? [],
    address: sf?.address?.trim() || null,
    phone: sf?.phone_number?.trim() || null,
    storefrontImageUrl: sf?.logo ?? null,
    slogans: sf?.slogan ? [sf.slogan] : [],
    deliveryFee: raw.delivery_fee ? parseDecimal(raw.delivery_fee) : null,
    availableDays: (raw.available_days ?? []).filter(
      (d): d is NonNullable<typeof d> => d !== null,
    ),
    timeWindows: (raw.delivery_windows ?? []).map((w) => ({
      id: w.id,
      label: w.window_name,
      startTime: w.start_time,
      endTime: w.end_time,
    })),
  };
});
