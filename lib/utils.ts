import { WEEKDAYS, WEEKDAY_LABELS } from "@/schemas/deliverySettingsSchema";
import type { Vendor } from "@/types/vendor";

export { cn } from "cn";

const ghsFormatter = new Intl.NumberFormat("en-GH", {
  style: "currency",
  currency: "GHS",
});

export function formatPrice(amount: number) {
  return ghsFormatter.format(amount);
}

const dateTimeFormatter = new Intl.DateTimeFormat("en-GH", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatDate(iso: string) {
  return dateTimeFormatter.format(new Date(iso));
}

/** "Mon–Fri", "Mon, Wed, Sat" — collapses runs of 3+ consecutive days. */
export function formatDays(days: Vendor["availableDays"]) {
  const indexes = WEEKDAYS.map((day, index) =>
    days.includes(day) ? index : -1,
  ).filter((index) => index >= 0);
  const parts: string[] = [];
  let start = 0;
  while (start < indexes.length) {
    let end = start;
    while (end + 1 < indexes.length && indexes[end + 1] === indexes[end] + 1)
      end++;
    const label = (i: number) => WEEKDAY_LABELS[WEEKDAYS[indexes[i]]];
    if (end - start >= 2) {
      parts.push(`${label(start)}–${label(end)}`);
    } else {
      for (let i = start; i <= end; i++) parts.push(label(i));
    }
    start = end + 1;
  }
  return parts.join(", ");
}
