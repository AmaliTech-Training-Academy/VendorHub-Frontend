import { z } from "zod";

import { formatDecimal, parseDecimal } from "@/lib/api/mapping";

/** Matches the backend's AvailableDaysEnum values exactly, so no mapping is
 *  needed at the API boundary — only WEEKDAY_LABELS lowercases for display. */
export const WEEKDAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

export const WEEKDAY_LABELS: Record<(typeof WEEKDAYS)[number], string> = {
  MONDAY: "Mon",
  TUESDAY: "Tue",
  WEDNESDAY: "Wed",
  THURSDAY: "Thu",
  FRIDAY: "Fri",
  SATURDAY: "Sat",
  SUNDAY: "Sun",
};

const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

const timeWindowShape = {
  label: z
    .string()
    .trim()
    .min(1, "Name this window")
    .max(40, "Keep the name under 40 characters"),
  startTime: z.string().regex(TIME_RE, "Enter a valid start time"),
  endTime: z.string().regex(TIME_RE, "Enter a valid end time"),
};

/** What the vendor edits in the form — a window they haven't saved yet has no id. */
export const timeWindowSchema = z
  .object(timeWindowShape)
  .refine((window) => window.endTime > window.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

/**
 * The backend's DeliveryWindow shape (GET responses, and nested inside a
 * VendorStorefront listing). start_time/end_time may come back with seconds
 * ("14:00:00"); trimmed to "HH:MM" to match the form's <input type="time">.
 */
const deliveryWindowApiSchema = z.object({
  id: z.number(),
  window_name: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  sort_order: z.number(),
});

/** The persisted shape once the backend has assigned it an id. */
export const storedTimeWindowSchema = deliveryWindowApiSchema.transform((raw) => ({
  id: raw.id,
  label: raw.window_name,
  startTime: raw.start_time.slice(0, 5),
  endTime: raw.end_time.slice(0, 5),
}));

export const deliverySettingsSchema = z.object({
  availableDays: z.array(z.enum(WEEKDAYS)).min(1, "Select at least one available day"),
  timeWindows: z.array(timeWindowSchema).min(1, "Add at least one time window"),
  deliveryFee: z.coerce
    .number({ error: "Enter a valid fee" })
    .nonnegative("Delivery fee can't be negative")
    .max(1_000_000, "Delivery fee must be GHS 1,000,000 or less"),
});

/** GET /api/vendors/me/delivery-settings/ — matches DeliverySettings exactly. */
const deliverySettingsApiSchema = z.object({
  available_days: z.array(z.enum(WEEKDAYS)),
  delivery_fee: z.string(),
  time_windows: z.array(deliveryWindowApiSchema),
});

export const deliverySettingsResponseSchema = deliverySettingsApiSchema.transform((raw) => ({
  availableDays: raw.available_days,
  deliveryFee: parseDecimal(raw.delivery_fee),
  timeWindows: raw.time_windows.map((window) => ({
    id: window.id,
    label: window.window_name,
    startTime: window.start_time.slice(0, 5),
    endTime: window.end_time.slice(0, 5),
  })),
}));

/**
 * Builds the PUT body from the form's validated values. Windows never carry
 * an id here (the form's own timeWindowSchema doesn't track one), so every
 * save creates fresh windows server-side — the same behaviour the mock had.
 */
export function toDeliverySettingsPayload(values: {
  availableDays: readonly (typeof WEEKDAYS)[number][];
  timeWindows: { label: string; startTime: string; endTime: string }[];
  deliveryFee: number;
}) {
  return {
    available_days: values.availableDays,
    delivery_fee: formatDecimal(values.deliveryFee),
    time_windows: values.timeWindows.map((window) => ({
      window_name: window.label,
      start_time: window.startTime,
      end_time: window.endTime,
    })),
  };
}
