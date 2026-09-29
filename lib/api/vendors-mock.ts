import { deliverySettingsSchema } from "@/schemas/deliverySettingsSchema";
import type {
  DeliverySettings,
  DeliverySettingsInput,
} from "@/types/deliverySettings";
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
  {
    id: "vendor-5",
    name: "Green Grocer Co.",
    categories: ["Produce", "Groceries"],
    deliveryFee: 3,
    isActive: true,
    availableDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    timeWindows: [
      { id: "tw-7", label: "Midday", startTime: "11:00", endTime: "13:00" },
    ],
  },
  {
    id: "vendor-6",
    name: "The Daily Bean",
    categories: ["Beverages", "Bakery"],
    deliveryFee: 4,
    isActive: true,
    availableDays: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ],
    timeWindows: [
      {
        id: "tw-8",
        label: "Early Morning",
        startTime: "07:00",
        endTime: "09:00",
      },
      {
        id: "tw-9",
        label: "Late Morning",
        startTime: "10:00",
        endTime: "11:30",
      },
    ],
  },
  {
    id: "vendor-7",
    name: "Artisan Crumb",
    categories: ["Bakery"],
    deliveryFee: 7,
    isActive: true,
    availableDays: ["wednesday", "thursday", "friday", "saturday", "sunday"],
    timeWindows: [
      {
        id: "tw-10",
        label: "Morning Batch",
        startTime: "08:30",
        endTime: "11:00",
      },
    ],
  },
  {
    id: "vendor-8",
    name: "Pure Dairy Farms",
    categories: ["Dairy"],
    deliveryFee: 5,
    isActive: true,
    availableDays: ["tuesday", "thursday"],
    timeWindows: [
      {
        id: "tw-11",
        label: "Early Delivery",
        startTime: "06:00",
        endTime: "08:30",
      },
    ],
  },
  {
    id: "vendor-9",
    name: "Clean & Co.",
    categories: ["Household"],
    deliveryFee: 6,
    isActive: true,
    availableDays: ["monday", "wednesday", "friday"],
    timeWindows: [
      {
        id: "tw-12",
        label: "Standard Afternoon",
        startTime: "13:00",
        endTime: "16:00",
      },
    ],
  },
  {
    id: "vendor-10",
    name: "Organic Roots",
    categories: ["Produce"],
    deliveryFee: 9,
    isActive: true,
    availableDays: ["monday", "tuesday", "wednesday"],
    timeWindows: [
      {
        id: "tw-13",
        label: "Morning Harvest",
        startTime: "09:30",
        endTime: "12:00",
      },
    ],
  },
  {
    id: "vendor-11",
    name: "Boba Haven",
    categories: ["Beverages"],
    deliveryFee: 4,
    isActive: true,
    availableDays: ["wednesday", "thursday", "friday", "saturday", "sunday"],
    timeWindows: [
      {
        id: "tw-14",
        label: "Afternoon Rush",
        startTime: "12:00",
        endTime: "15:00",
      },
      {
        id: "tw-15",
        label: "Evening Chill",
        startTime: "17:00",
        endTime: "20:00",
      },
    ],
  },
  {
    id: "vendor-12",
    name: "Corner Market",
    categories: ["Groceries", "Household"],
    deliveryFee: 5,
    isActive: true,
    availableDays: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ],
    timeWindows: [
      {
        id: "tw-16",
        label: "All Day Slot",
        startTime: "10:00",
        endTime: "17:00",
      },
    ],
  },
  {
    id: "vendor-13",
    name: "Sweet Treat Patisserie",
    categories: ["Bakery", "Beverages"],
    deliveryFee: 8,
    isActive: true,
    availableDays: ["friday", "saturday", "sunday"],
    timeWindows: [
      {
        id: "tw-17",
        label: "Brunch Window",
        startTime: "10:30",
        endTime: "13:30",
      },
    ],
  },
  {
    id: "vendor-14",
    name: "Nature's Gold",
    categories: ["Produce", "Dairy"],
    deliveryFee: 6,
    isActive: true,
    availableDays: ["tuesday", "thursday", "friday"],
    timeWindows: [
      {
        id: "tw-18",
        label: "Midday Run",
        startTime: "11:00",
        endTime: "14:00",
      },
    ],
  },
  {
    id: "vendor-15",
    name: "The Soda Fountain",
    categories: ["Beverages"],
    deliveryFee: 3,
    isActive: true,
    availableDays: ["thursday", "friday", "saturday"],
    timeWindows: [
      {
        id: "tw-19",
        label: "Evening Run",
        startTime: "16:00",
        endTime: "19:00",
      },
    ],
  },
  {
    id: "vendor-16",
    name: "Essential Living",
    categories: ["Household", "Groceries"],
    deliveryFee: 7,
    isActive: true,
    availableDays: ["monday", "thursday"],
    timeWindows: [
      {
        id: "tw-20",
        label: "Morning Delivery",
        startTime: "08:00",
        endTime: "11:00",
      },
    ],
  },
  {
    id: "vendor-17",
    name: "The Cheese Block",
    categories: ["Dairy"],
    deliveryFee: 10,
    isActive: true,
    availableDays: ["wednesday", "friday"],
    timeWindows: [
      {
        id: "tw-21",
        label: "Afternoon Dispatch",
        startTime: "14:00",
        endTime: "17:00",
      },
    ],
  },
  {
    id: "vendor-18",
    name: "Under Renovation Hub",
    categories: ["Groceries"],
    deliveryFee: 0,
    isActive: false,
    availableDays: ["sunday"],
    timeWindows: [
      { id: "tw-22", label: "Noon", startTime: "12:00", endTime: "13:00" },
    ],
  },
  {
    id: "vendor-19",
    name: "Harvest Moon Orchards",
    categories: ["Produce"],
    deliveryFee: 5,
    isActive: true,
    availableDays: ["monday", "tuesday", "wednesday", "thursday"],
    timeWindows: [
      {
        id: "tw-23",
        label: "Early Shift",
        startTime: "07:30",
        endTime: "10:30",
      },
    ],
  },
  {
    id: "vendor-20",
    name: "The Hydration Depot",
    categories: ["Beverages"],
    deliveryFee: 4,
    isActive: true,
    availableDays: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ],
    timeWindows: [
      {
        id: "tw-24",
        label: "Morning Route",
        startTime: "09:00",
        endTime: "12:00",
      },
      {
        id: "tw-25",
        label: "Afternoon Route",
        startTime: "13:30",
        endTime: "16:30",
      },
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

export async function fetchVendorById(
  vendorId: string,
): Promise<Vendor | undefined> {
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

export async function fetchDeliverySettings(
  vendorId: string,
): Promise<DeliverySettings> {
  const vendor = vendors.find((v) => v.id === vendorId);
  if (!vendor) {
    throw new Error("Vendor not found");
  }
  return delay(clone(toDeliverySettings(vendor)));
}

export async function updateDeliverySettings(
  vendorId: string,
  input: DeliverySettingsInput,
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
