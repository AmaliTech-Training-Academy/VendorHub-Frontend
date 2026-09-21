import type { z } from "zod";
import type { productSchema } from "@/types/productSchema";

export type ProductFormValues = z.infer<typeof productSchema>;
export type ProductFormInput = z.input<typeof productSchema>;

export type Product = ProductFormValues & {
  id: string;
  vendorId: string;
  createdAt: string;
  updatedAt: string;
};
