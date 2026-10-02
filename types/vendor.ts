import type { vendorSchema } from "@/schemas/vendorSchema";

import type { z } from "zod";

export type Vendor = z.infer<typeof vendorSchema>;
