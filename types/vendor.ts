import type { z } from "zod";
import type { vendorSchema } from "@/schemas/vendorSchema";

export type Vendor = z.infer<typeof vendorSchema>;
