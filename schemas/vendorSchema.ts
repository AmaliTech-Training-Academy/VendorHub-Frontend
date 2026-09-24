import { z } from "zod";
import { WEEKDAYS, storedTimeWindowSchema } from "@/schemas/deliverySettingsSchema";

export const vendorSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  categories: z.array(z.string()).min(1),
  deliveryFee: z.number().nonnegative(),
  isActive: z.boolean(),
  availableDays: z.array(z.enum(WEEKDAYS)),
  timeWindows: z.array(storedTimeWindowSchema),
});
