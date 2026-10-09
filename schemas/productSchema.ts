import { z } from "zod";

import { parseDecimal } from "@/lib/api/mapping";

export const MAX_PRODUCT_IMAGE_MB = 2; // mirrors MAX_IMAGE_SIZE_MB on the backend
export const ACCEPTED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
];

/**
 * The backend's category is a free-form nullable string (maxLength 255),
 * not an enum. These are kept as suggestions only — offered in the form's
 * category <datalist>, never enforced — so a vendor can still type anything.
 */
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
      "Price can have at most 2 decimal places",
    ),
  category: z
    .string()
    .trim()
    .min(1, "Enter a category")
    .max(255, "Category must be 255 characters or fewer"),
  inStock: z.boolean(),
  image: z
    .custom<File>((value) => value instanceof File, "Choose a valid image")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Use a PNG, JPG, GIF or WebP image",
    )
    .refine(
      (file) => file.size <= MAX_PRODUCT_IMAGE_MB * 1024 * 1024,
      `Image must be ${MAX_PRODUCT_IMAGE_MB} MB or smaller`,
    )
    .nullable(),
  removeImage: z.boolean(),
});

/**
 * GET/POST/PATCH /api/products/ — the vendor's own product management view.
 * description/category are nullable on read; a null only ever comes from
 * data created outside this app's own form, which always requires both.
 */
const productApiSchema = z.object({
  id: z.number(),
  vendor: z.number(),
  name: z.string(),
  price: z.string(),
  description: z.string().nullable(),
  category: z.string().nullable(),
  in_stock: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  image: z.string().nullable(),
});

export const productResponseSchema = productApiSchema.transform((raw) => ({
  id: raw.id,
  vendorId: raw.vendor,
  name: raw.name,
  description: raw.description ?? "",
  category: raw.category ?? "",
  price: parseDecimal(raw.price),
  inStock: raw.in_stock,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,
  imageUrl: raw.image,
}));

/**
 * GET /api/vendors/products/ — the storefront's browsing view. Leaner than
 * Product: no vendor id (the caller already knows which vendor's catalogue
 * this is), no timestamps.
 */
const vendorProductApiSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  category: z.string().nullable(),
  price: z.string(),
  in_stock: z.boolean(),
  image: z.string().nullable().optional(),
});

export const vendorProductSchema = vendorProductApiSchema.transform((raw) => ({
  id: raw.id,
  name: raw.name,
  description: raw.description ?? "",
  category: raw.category ?? "",
  price: parseDecimal(raw.price),
  inStock: raw.in_stock,
  imageUrl: raw.image ?? null,
}));
