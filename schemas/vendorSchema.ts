import { z } from "zod";

import { parseDecimal } from "@/lib/api/mapping";
import {
  WEEKDAYS,
  storedTimeWindowSchema,
} from "@/schemas/deliverySettingsSchema";

/**
 * GET /api/vendors/ — "List Active Vendors". The backend already filters to
 * active vendors, so there's no isActive field to track or filter on here.
 */
const vendorApiSchema = z.object({
  id: z.number(),
  business_name: z.string().min(1),
  categories: z.array(z.string()).nullable(),
  delivery_fee: z.string().nullable(),
  available_days: z.array(z.enum(WEEKDAYS)).nullable(),
  delivery_windows: z.array(storedTimeWindowSchema).nullable(),
  slogans: z.array(z.string().trim().min(1)).nullable().optional(),
  // Nullable: vendors registered before the profile form won't have these yet.
  address: z.string().nullable().optional(),
  // Accepts either type while the backend field is being settled (see note below).
  phone_number: z.union([z.string(), z.number()]).nullable().optional(),
});

export const vendorSchema = vendorApiSchema.transform((raw) => ({
  id: raw.id,
  name: raw.business_name,
  categories: raw.categories ?? [],
  deliveryFee:
    raw.delivery_fee === null ? null : parseDecimal(raw.delivery_fee),
  availableDays: raw.available_days ?? [],
  timeWindows: raw.delivery_windows ?? [],
  slogans: raw.slogans ?? [],
  address: raw.address?.trim() || null,
  phone: raw.phone_number?.toString().trim() || null,
}));
