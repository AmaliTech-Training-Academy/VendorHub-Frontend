import { productSchema, type Product, type ProductFormValues } from "@/types/product";


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

/** Server-side validation stand-in: never store anything the form schema would reject. */
function parseProductInput(input: unknown): ProductFormValues {
  const result = productSchema.safeParse(input);
  if (!result.success) {
    throw new Error(result.error.issues[0]?.message ?? "Invalid product data");
  }
  return result.data;
}

export async function fetchProducts(vendorId: string): Promise<Product[]> {
  const vendorProducts = products.filter((product) => product.vendorId === vendorId);
  return delay(clone(vendorProducts));
}

export async function addProduct(
  vendorId: string,
  input: ProductFormValues
): Promise<Product> {
  const data = parseProductInput(input);
  const now = new Date().toISOString();
  const product: Product = {
    ...data,
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
  const data = parseProductInput(input);
  const existing = products.find((product) => product.id === productId);
  if (!existing) {
    throw new Error("Product not found");
  }
  const updated: Product = {
    ...existing,
    ...data,
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
