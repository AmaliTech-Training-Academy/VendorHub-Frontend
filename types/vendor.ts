import type { z } from "zod";
import type { vendorSchema } from "@/types/vendorSchema";

export type Vendor = z.infer<typeof vendorSchema>;
