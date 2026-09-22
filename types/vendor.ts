import type { z } from "zod";
import type { vendorSchema } from "@/lib/schemas/vendorSchema";

export type Vendor = z.infer<typeof vendorSchema>;
