import { apiRequest } from "@/lib/api/client";
import { formatDecimal } from "@/lib/api/mapping";
import { paginatedSchema } from "@/schemas/paginationSchema";
import {
  productResponseSchema,
  vendorProductSchema,
} from "@/schemas/productSchema";
import type {
  Product,
  ProductFormValues,
  VendorProduct,
} from "@/types/product";

const productListResponseSchema = paginatedSchema(productResponseSchema);
const vendorProductListResponseSchema = paginatedSchema(vendorProductSchema);

function toProductFormData(input: ProductFormValues): FormData {
  const body = new FormData();
  body.append("name", input.name);
  body.append("description", input.description);
  body.append("category", input.category);
  body.append("price", formatDecimal(input.price));
  body.append("in_stock", String(input.inStock));

  if (input.image) {
    body.append("image", input.image);
  } else if (input.removeImage) {
    body.append("image", ""); // DRF reads this as null and clears the image
  }
  // Neither: no "image" key, so PATCH leaves the existing image untouched.
  return body;
}

export async function addProduct(
  vendorId: string,
  input: ProductFormValues,
): Promise<Product> {
  const raw = await apiRequest<unknown>("products/", {
    method: "POST",
    body: toProductFormData(input),
  });
  return productResponseSchema.parse(raw);
}

export async function editProduct(
  productId: number,
  input: ProductFormValues,
): Promise<Product> {
  const raw = await apiRequest<unknown>(`products/${productId}/`, {
    method: "PATCH",
    body: toProductFormData(input),
  });
  return productResponseSchema.parse(raw);
}

/**
 * GET /api/products/ — "List My Products", scoped to the logged-in vendor by
 * the JWT. vendorId isn't sent on the wire; it's kept for the hook's cache
 * key, matching the pattern used for vendors' own delivery settings.
 */
export async function fetchProducts(_vendorId: string): Promise<Product[]> {
  const raw = await apiRequest<unknown>("products/", {
    query: { page_size: 100 },
  });
  return productListResponseSchema.parse(raw).results;
}

/**
 * GET /api/vendors/products/?vendor_id=X — "List Vendor's In-Stock Products",
 * the employee storefront's browsing view of one vendor's catalogue.
 */
export async function fetchVendorCatalogue(
  vendorId: string,
): Promise<VendorProduct[]> {
  const raw = await apiRequest<unknown>("vendors/products/", {
    query: { vendor_id: Number(vendorId), page_size: 100 },
  });
  return vendorProductListResponseSchema.parse(raw).results;
}

export async function deleteProduct(
  productId: number,
): Promise<{ id: number }> {
  await apiRequest<undefined>(`products/${productId}/`, { method: "DELETE" });
  return { id: productId };
}

export async function toggleProductStock(
  productId: number,
  inStock: boolean,
): Promise<Product> {
  const raw = await apiRequest<unknown>(`products/${productId}/`, {
    method: "PATCH",
    body: { in_stock: inStock },
  });
  return productResponseSchema.parse(raw);
}
