import type {
  deliverySettingsResponseSchema,
  deliverySettingsSchema,
  storedTimeWindowSchema,
  timeWindowSchema,
} from "@/schemas/deliverySettingsSchema";

import type { z } from "zod";

export type TimeWindowFormValues = z.infer<typeof timeWindowSchema>;
export type TimeWindow = z.infer<typeof storedTimeWindowSchema>;

export type DeliverySettingsFormValues = z.infer<typeof deliverySettingsSchema>;
export type DeliverySettingsInput = z.input<typeof deliverySettingsSchema>;

export type DeliverySettings = z.infer<typeof deliverySettingsResponseSchema>;
