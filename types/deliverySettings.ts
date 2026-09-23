import type { z } from "zod";
import type {
  deliverySettingsSchema,
  storedTimeWindowSchema,
  timeWindowSchema,
} from "@/schemas/deliverySettingsSchema";

export type TimeWindowFormValues = z.infer<typeof timeWindowSchema>;
export type TimeWindow = z.infer<typeof storedTimeWindowSchema>;

export type DeliverySettingsFormValues = z.infer<typeof deliverySettingsSchema>;
export type DeliverySettingsInput = z.input<typeof deliverySettingsSchema>;

export type DeliverySettings = {
  availableDays: DeliverySettingsFormValues["availableDays"];
  timeWindows: TimeWindow[];
  deliveryFee: number;
};
