import { z } from "zod";

export const WEEKDAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export const WEEKDAY_LABELS: Record<(typeof WEEKDAYS)[number], string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
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

export const timeWindowSchema = z
  .object(timeWindowShape)
  .refine((window) => window.endTime > window.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

/** The persisted shape, once a mutation has assigned it an id. */
export const storedTimeWindowSchema = z.object({
  id: z.string(),
  ...timeWindowShape,
});

export const deliverySettingsSchema = z.object({
  availableDays: z.array(z.enum(WEEKDAYS)).min(1, "Select at least one available day"),
  timeWindows: z.array(timeWindowSchema).min(1, "Add at least one time window"),
  deliveryFee: z.coerce
    .number({ error: "Enter a valid fee" })
    .nonnegative("Delivery fee can't be negative")
    .max(1_000_000, "Delivery fee must be GHS 1,000,000 or less"),
});
