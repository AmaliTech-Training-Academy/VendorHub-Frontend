import { z } from "zod";

/** Shape of every DRF list endpoint's response: { count, next, previous, results }. */
export function paginatedSchema<T extends z.ZodType>(itemSchema: T) {
  return z.object({
    count: z.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(itemSchema),
  });
}
