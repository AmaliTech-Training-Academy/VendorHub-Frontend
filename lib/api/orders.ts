import { getVendorByIdSync } from "@/lib/api/vendors";
import type { Order, PlaceOrderInput } from "@/types/order";
import { placeOrderSchema } from "@/types/orderSchema";

let orders: Order[] = [];

const LATENCY_MS = 500;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function generateReference(): string {
  return `ORD-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export async function placeOrder(input: PlaceOrderInput): Promise<Order> {
  const parsed = placeOrderSchema.parse(input);
  const vendor = getVendorByIdSync(parsed.vendorId);
  if (!vendor) {
    throw new Error("Vendor not found");
  }

  const subtotal = parsed.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = vendor.deliveryFee;

  const order: Order = {
    id: crypto.randomUUID(),
    reference: generateReference(),
    vendorId: parsed.vendorId,
    employeeId: parsed.employeeId,
    items: parsed.items,
    deliveryWindowId: parsed.deliveryWindowId,
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  orders = [order, ...orders];
  return delay(clone(order));
}

export async function fetchOrdersByVendor(vendorId: string): Promise<Order[]> {
  const vendorOrders = orders.filter((order) => order.vendorId === vendorId);
  return delay(clone(vendorOrders));
}
