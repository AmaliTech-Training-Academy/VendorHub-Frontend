import type { z } from "zod";
import type {
  productResponseSchema,
  productSchema,
  vendorProductSchema,
} from "@/schemas/productSchema";

export type ProductFormValues = z.infer<typeof productSchema>;
export type ProductFormInput = z.input<typeof productSchema>;

/** The vendor's own product, as returned by GET/POST/PATCH /api/products/. */
export type Product = z.infer<typeof productResponseSchema>;

/** The storefront's leaner view of a product, from GET /api/vendors/products/. */
export type VendorProduct = z.infer<typeof vendorProductSchema>;
