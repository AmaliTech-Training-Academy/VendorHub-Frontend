import type { vendorSchema } from "@/schemas/vendorSchema";

import type { z } from "zod";

export type Vendor = z.infer<typeof vendorSchema>;
export type VendorGroup = { category: string; vendors: Vendor[] };
export type DeliveryFeeRange = { minimum: number; maximum: number };
