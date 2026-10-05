import type { Order } from "@/types/order";

/** Orders the vendor still has to act on: anything not yet ready for collection. */
export function countPendingOrders(orders: Order[]): number {
  return orders.filter((order) => order.status !== "ready_for_collection")
    .length;
}

/** Midnight local time on the most recent Monday (today, if it's Monday). */
export function startOfWeek(now: Date): Date {
  const daysSinceMonday = (now.getDay() + 6) % 7;
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - daysSinceMonday,
  );
}

export function countOrdersThisWeek(
  orders: Order[],
  now: Date = new Date(),
): number {
  const since = startOfWeek(now).getTime();
  return orders.filter((order) => new Date(order.createdAt).getTime() >= since)
    .length;
}

/** "2× Jollof rice, 1× Meat pie" */
export function summariseItems(order: Order): string {
  return order.items
    .map((item) => `${String(item.quantity)}× ${item.name}`)
    .join(", ");
}
