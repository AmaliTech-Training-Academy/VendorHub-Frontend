import { apiRequest } from "@/lib/api/client";
import { formatDecimal } from "@/lib/api/mapping";
import { paginatedSchema } from "@/schemas/paginationSchema";
import { productResponseSchema, vendorProductSchema } from "@/schemas/productSchema";
import type { Product, ProductFormValues, VendorProduct } from "@/types/product";

const productListResponseSchema = paginatedSchema(productResponseSchema);
const vendorProductListResponseSchema = paginatedSchema(vendorProductSchema);

function toProductPayload(input: ProductFormValues) {
  return {
    name: input.name,
    description: input.description,
    category: input.category,
    price: formatDecimal(input.price),
    in_stock: input.inStock,
  };
}

/**
 * GET /api/products/ — "List My Products", scoped to the logged-in vendor by
 * the JWT. vendorId isn't sent on the wire; it's kept for the hook's cache
 * key, matching the pattern used for vendors' own delivery settings.
 */
export async function fetchProducts(vendorId: string): Promise<Product[]> {
  const raw = await apiRequest<unknown>("products/", { query: { page_size: 100 } });
  return productListResponseSchema.parse(raw).results;
}

/**
 * GET /api/vendors/products/?vendor_id=X — "List Vendor's In-Stock Products",
 * the employee storefront's browsing view of one vendor's catalogue.
 */
export async function fetchVendorCatalogue(vendorId: string): Promise<VendorProduct[]> {
  const raw = await apiRequest<unknown>("vendors/products/", {
    query: { vendor_id: Number(vendorId), page_size: 100 },
  });
  return vendorProductListResponseSchema.parse(raw).results;
}

export async function addProduct(
  vendorId: string,
  input: ProductFormValues,
): Promise<Product> {
  const raw = await apiRequest<unknown>("products/", {
    method: "POST",
    body: toProductPayload(input),
  });
  return productResponseSchema.parse(raw);
}

export async function editProduct(
  productId: number,
  input: ProductFormValues,
): Promise<Product> {
  const raw = await apiRequest<unknown>(`products/${productId}/`, {
    method: "PATCH",
    body: toProductPayload(input),
  });
  return productResponseSchema.parse(raw);
}

export async function deleteProduct(productId: number): Promise<{ id: number }> {
  await apiRequest<void>(`products/${productId}/`, { method: "DELETE" });
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
