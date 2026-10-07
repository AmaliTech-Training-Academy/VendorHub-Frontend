import type {
  vendorProfileResponseSchema,
  vendorProfileSchema,
} from "@/schemas/vendorProfile";

import type { z } from "zod";

export type VendorProfileFormInput = z.input<typeof vendorProfileSchema>;
export type VendorProfileFormValues = z.output<typeof vendorProfileSchema>;
export type VendorProfile = z.output<typeof vendorProfileResponseSchema>;
