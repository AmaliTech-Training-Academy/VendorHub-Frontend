import { ORDER_STATUSES } from "@/lib/constants";
import type { Order } from "@/types/order";

let orders: Order[] = [];

const LATENCY_MS = 500;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => { resolve(value); }, LATENCY_MS));
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
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
    const nextStatus = ORDER_STATUSES.at(index);
    if (!nextStatus || !orders.some((o) => o.id === orderId)) {return;}

    orders = orders.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o));
    if (index < ORDER_STATUSES.length - 1) {
      setTimeout(advance, STATUS_STEP_MS);
    }
  };
  setTimeout(advance, STATUS_STEP_MS);
}

/**
 * Placing an order is real (lib/api/orders.ts) but the backend has no list or
 * status endpoints yet, so orders it returns are mirrored here to keep the
 * history and vendor pages populated. Delete with this file once they exist.
 */
export function seedMockOrder(order: Order) {
  orders = [order, ...orders.filter((o) => o.id !== order.id)];
  scheduleStatusProgression(order.id);
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
