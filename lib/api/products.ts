import type { Product, ProductFormValues } from "@/types/product";

/**
 * In-memory mock data layer. There is no backend yet, so this simulates one:
 * a module-level "table" plus artificial latency. Every function below is
 * async and returns/accepts the same shapes a real HTTP client would, so
 * swapping this out for real requests later shouldn't require touching the
 * React Query hooks that call it.
 *
 * Deleting a product removes it from this single source of truth, so it
 * disappears from both the vendor dashboard and the employee storefront
 * (whichever screen reads it) at the same time.
 */

let products: Product[] = [
  {
    id: "prod-1",
    vendorId: "vendor-1",
    name: "Jollof Rice (1kg)",
    description: "Ready-to-cook party jollof rice mix.",
    price: 45,
    category: "Groceries",
    inStock: true,
    createdAt: new Date("2026-08-01").toISOString(),
    updatedAt: new Date("2026-08-01").toISOString(),
  },
  {
    id: "prod-2",
    vendorId: "vendor-1",
    name: "Sobolo (500ml)",
    description: "Chilled hibiscus drink, no added sugar.",
    price: 15,
    category: "Beverages",
    inStock: false,
    createdAt: new Date("2026-08-03").toISOString(),
    updatedAt: new Date("2026-08-03").toISOString(),
  },
];

const LATENCY_MS = 400;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export async function fetchProducts(vendorId: string): Promise<Product[]> {
  const vendorProducts = products.filter((product) => product.vendorId === vendorId);
  return delay(clone(vendorProducts));
}

export async function addProduct(
  vendorId: string,
  input: ProductFormValues
): Promise<Product> {
  const now = new Date().toISOString();
  const product: Product = {
    ...input,
    id: crypto.randomUUID(),
    vendorId,
    createdAt: now,
    updatedAt: now,
  };
  products = [product, ...products];
  return delay(clone(product));
}

export async function editProduct(
  productId: string,
  input: ProductFormValues
): Promise<Product> {
  const existing = products.find((product) => product.id === productId);
  if (!existing) {
    throw new Error("Product not found");
  }
  const updated: Product = {
    ...existing,
    ...input,
    updatedAt: new Date().toISOString(),
  };
  products = products.map((product) => (product.id === productId ? updated : product));
  return delay(clone(updated));
}

export async function deleteProduct(productId: string): Promise<{ id: string }> {
  products = products.filter((product) => product.id !== productId);
  return delay({ id: productId });
}

export async function toggleProductStock(
  productId: string,
  inStock: boolean
): Promise<Product> {
  const existing = products.find((product) => product.id === productId);
  if (!existing) {
    throw new Error("Product not found");
  }
  const updated: Product = { ...existing, inStock, updatedAt: new Date().toISOString() };
  products = products.map((product) => (product.id === productId ? updated : product));
  return delay(clone(updated));
}
