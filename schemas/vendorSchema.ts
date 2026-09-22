import { z } from "zod";

export const vendorSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  categories: z.array(z.string()).min(1),
  deliveryFee: z.number().nonnegative(),
  isActive: z.boolean(),
});
