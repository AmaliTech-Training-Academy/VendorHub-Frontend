import type { DeliveryWindow } from "@/types/order";

const deliveryWindows: DeliveryWindow[] = [
  { id: "dw-1", label: "Today, 10:00 AM – 12:00 PM", available: true },
  { id: "dw-2", label: "Today, 12:00 PM – 2:00 PM", available: true },
  { id: "dw-3", label: "Today, 2:00 PM – 4:00 PM", available: false },
  { id: "dw-4", label: "Tomorrow, 9:00 AM – 11:00 AM", available: true },
];

const LATENCY_MS = 300;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));
}

export async function fetchDeliveryWindows(): Promise<DeliveryWindow[]> {
  return delay(structuredClone(deliveryWindows));
}
