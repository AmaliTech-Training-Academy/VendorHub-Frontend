import { deliverySettingsSchema } from "@/schemas/deliverySettingsSchema";
import type { DeliverySettings, DeliverySettingsInput } from "@/types/deliverySettings";
import type { Vendor } from "@/types/vendor";

/**
 * In-memory mock data layer, same pattern as lib/api/products-mock.ts: a
 * module-level "table" plus artificial latency standing in for a backend.
 */

let vendors: Vendor[] = [
  {
    id: "vendor-1",
    name: "Mama's Kitchen",
    categories: ["Groceries", "Beverages"],
    deliveryFee: 5,
    isActive: true,
    availableDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    timeWindows: [
      { id: "tw-1", label: "Morning", startTime: "10:00", endTime: "12:00" },
      { id: "tw-2", label: "Afternoon", startTime: "14:00", endTime: "16:00" },
    ],
  },
  {
    id: "vendor-2",
    name: "Fresh Mart",
    categories: ["Produce", "Dairy"],
    deliveryFee: 8,
    isActive: true,
    availableDays: ["monday", "wednesday", "friday", "saturday"],
    timeWindows: [
      { id: "tw-3", label: "Morning", startTime: "09:00", endTime: "11:00" },
    ],
  },
  {
    id: "vendor-3",
    name: "Bake House",
    categories: ["Bakery"],
    deliveryFee: 6,
    isActive: true,
    availableDays: ["tuesday", "thursday", "saturday"],
    timeWindows: [
      { id: "tw-4", label: "Morning", startTime: "08:00", endTime: "10:00" },
      { id: "tw-5", label: "Evening", startTime: "16:00", endTime: "18:00" },
    ],
  },
  {
    id: "vendor-4",
    name: "Closed Stop",
    categories: ["Household"],
    deliveryFee: 4,
    isActive: false,
    availableDays: ["monday"],
    timeWindows: [
      { id: "tw-6", label: "Morning", startTime: "10:00", endTime: "12:00" },
    ],
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

function toDeliverySettings(vendor: Vendor): DeliverySettings {
  return {
    availableDays: vendor.availableDays,
    timeWindows: vendor.timeWindows,
    deliveryFee: vendor.deliveryFee,
  };
}

export async function fetchDeliverySettings(vendorId: string): Promise<DeliverySettings> {
  const vendor = vendors.find((v) => v.id === vendorId);
  if (!vendor) {
    throw new Error("Vendor not found");
  }
  return delay(clone(toDeliverySettings(vendor)));
}

export async function updateDeliverySettings(
  vendorId: string,
  input: DeliverySettingsInput
): Promise<DeliverySettings> {
  const parsed = deliverySettingsSchema.parse(input);
  const existing = vendors.find((v) => v.id === vendorId);
  if (!existing) {
    throw new Error("Vendor not found");
  }

  const updated: Vendor = {
    ...existing,
    availableDays: parsed.availableDays,
    timeWindows: parsed.timeWindows.map((window) => ({
      id: crypto.randomUUID(),
      ...window,
    })),
    deliveryFee: parsed.deliveryFee,
  };
  vendors = vendors.map((v) => (v.id === vendorId ? updated : v));
  return delay(clone(toDeliverySettings(updated)));
}
