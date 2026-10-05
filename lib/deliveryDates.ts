import { WEEKDAYS } from "@/schemas/deliverySettingsSchema";

type Weekday = (typeof WEEKDAYS)[number];

export type DeliveryDateOption = { value: string; label: string };

/** How many days ahead an employee can book. */
export const BOOKING_HORIZON_DAYS = 14;

/**
 * Orders start from tomorrow; the backend's same-day cutoff isn't in the API
 * spec, so today is left out rather than guessed at.
 */
const FIRST_OFFSET_DAYS = 1;

const labelFormatter = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

// Built from local date parts: toISOString() converts to UTC and can shift the
// date by a day for users ahead of/behind UTC.
function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Date.getDay() is 0 = Sunday; WEEKDAYS starts at Monday. */
function weekdayOf(date: Date): Weekday {
  return WEEKDAYS[(date.getDay() + 6) % 7];
}

export function upcomingDeliveryDates(
  availableDays: readonly Weekday[],
  from: Date = new Date(),
): DeliveryDateOption[] {
  const options: DeliveryDateOption[] = [];
  for (let offset = FIRST_OFFSET_DAYS; offset <= BOOKING_HORIZON_DAYS; offset++) {
    const date = new Date(from.getFullYear(), from.getMonth(), from.getDate() + offset);
    if (availableDays.includes(weekdayOf(date))) {
      options.push({ value: toIsoDate(date), label: labelFormatter.format(date) });
    }
  }
  return options;
}
