import type { Vendor } from "@/types/vendor";

/**
 * In-memory mock data layer, same pattern as lib/api/products-mock.ts: a
 * module-level "table" plus artificial latency standing in for a backend.
 */

const vendors: Vendor[] = [
  {
    id: "vendor-1",
    name: "Mama's Kitchen",
    categories: ["Groceries", "Beverages"],
    deliveryFee: 5,
    isActive: true,
  },
  {
    id: "vendor-2",
    name: "Fresh Mart",
    categories: ["Produce", "Dairy"],
    deliveryFee: 8,
    isActive: true,
  },
  {
    id: "vendor-3",
    name: "Bake House",
    categories: ["Bakery"],
    deliveryFee: 6,
    isActive: true,
  },
  {
    id: "vendor-4",
    name: "Closed Stop",
    categories: ["Household"],
    deliveryFee: 4,
    isActive: false,
  },
];

const LATENCY_MS = 400;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export async function fetchVendors(): Promise<Vendor[]> {
  const active = vendors.filter((vendor) => vendor.isActive);
  return delay(clone(active));
}

export async function fetchVendorById(vendorId: string): Promise<Vendor | undefined> {
  return delay(clone(vendors.find((vendor) => vendor.id === vendorId)));
}

/** Sync lookup for composing other mock endpoints (e.g. order totals). */
export function getVendorByIdSync(vendorId: string): Vendor | undefined {
  return vendors.find((vendor) => vendor.id === vendorId);
}
