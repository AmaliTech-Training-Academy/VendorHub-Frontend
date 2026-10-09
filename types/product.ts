import type {
  productResponseSchema,
  productSchema,
  vendorProductSchema,
} from "@/schemas/productSchema";

import type { z } from "zod";

export type ProductFormValues = z.infer<typeof productSchema> & {
  image: File | null;
  removeImage: boolean;
};
export type ProductFormInput = z.input<typeof productSchema> & {
  image: File | null;
  removeImage: boolean;
};

/** The vendor's own product, as returned by GET/POST/PATCH /api/products/. */
export type Product = z.infer<typeof productResponseSchema>;

/** The storefront's leaner view of a product, from GET /api/vendors/products/. */
export type VendorProduct = z.infer<typeof vendorProductSchema> & {
  imageUrl?: string | null;
};
