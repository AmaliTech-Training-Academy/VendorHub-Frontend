import { getVendorByIdSync } from "@/lib/api/vendors-mock";
import type { Order, OrderStatus, PlaceOrderInput } from "@/types/order";
import { ORDER_STATUSES, placeOrderSchema } from "@/schemas/orderSchema";

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

/**
 * There's no real vendor yet to advance an order through its lifecycle, so
 * each placed order advances itself through ORDER_STATUSES on a timer. This
 * is mock-only behaviour that exists purely so the employee order history
 * page's polling has something real to observe.
 */
const STATUS_STEP_MS = 10_000;

function scheduleStatusProgression(orderId: string) {
  let index = ORDER_STATUSES.indexOf("placed");
  const advance = () => {
    index += 1;
    const nextStatus: OrderStatus | undefined = ORDER_STATUSES[index];
    if (!nextStatus || !orders.some((o) => o.id === orderId)) return;

    orders = orders.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o));
    if (index < ORDER_STATUSES.length - 1) {
      setTimeout(advance, STATUS_STEP_MS);
    }
  };
  setTimeout(advance, STATUS_STEP_MS);
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
    vendorName: vendor.name,
    employeeId: parsed.employeeId,
    items: parsed.items,
    deliveryWindowId: parsed.deliveryWindowId,
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    status: "placed",
    createdAt: new Date().toISOString(),
  };

  orders = [order, ...orders];
  scheduleStatusProgression(order.id);
  return delay(clone(order));
}

export async function fetchOrdersByVendor(vendorId: string): Promise<Order[]> {
  const vendorOrders = orders.filter((order) => order.vendorId === vendorId);
  return delay(clone(vendorOrders));
}

export async function fetchOrdersByEmployee(employeeId: string): Promise<Order[]> {
  const employeeOrders = orders
    .filter((order) => order.employeeId === employeeId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return delay(clone(employeeOrders));
}
