import { z } from "zod";

export const PRODUCT_CATEGORIES = [
  "Groceries",
  "Beverages",
  "Bakery",
  "Produce",
  "Dairy",
  "Household",
  "Other",
] as const;

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Product name is required")
    .max(100, "Product name must be 100 characters or fewer"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(500, "Description must be 500 characters or fewer"),
  price: z.coerce
    .number({ error: "Enter a valid price" })
    .gt(0, "Price must be greater than GHS 0")
    .max(1_000_000, "Price must be GHS 1,000,000 or less")
    .refine(
      (value) => Math.round(value * 100) / 100 === value,
      "Price can have at most 2 decimal places"
    ),
  category: z.enum(PRODUCT_CATEGORIES, { error: "Select a category" }),
  inStock: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
export type ProductFormInput = z.input<typeof productSchema>;

export type Product = ProductFormValues & {
  id: string;
  vendorId: string;
  createdAt: string;
  updatedAt: string;
};
