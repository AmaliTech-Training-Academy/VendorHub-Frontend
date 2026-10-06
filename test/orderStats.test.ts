import { describe, expect, it } from "vitest";

import {
  countOrdersThisWeek,
  countPendingOrders,
  startOfWeek,
  summariseItems,
} from "../lib/orderStats";

import type { Order, OrderStatus } from "../types/order";

function makeOrder(status: OrderStatus, createdAt: string): Order {
  return {
    id: createdAt,
    reference: "ORD-1",
    vendorId: "3",
    vendorName: "Mama's Kitchen",
    employeeId: "4",
    items: [
      {
        productId: 1,
        vendorId: "3",
        name: "Jollof rice",
        price: 20,
        quantity: 2,
      },
      { productId: 2, vendorId: "3", name: "Meat pie", price: 5, quantity: 1 },
    ],
    deliveryWindowId: 8,
    deliveryWindowLabel: "Morning · 10:00–12:00",
    deliveryDate: "2026-10-12",
    subtotal: 45,
    deliveryFee: 5,
    total: 50,
    status,
    createdAt,
  };
}

describe("order stats", () => {
  it("counts orders that aren't ready yet as pending", () => {
    const orders = [
      makeOrder("received", "2026-10-05T09:00:00"),
      makeOrder("preparing", "2026-10-05T09:00:00"),
      makeOrder("ready_for_collection", "2026-10-05T09:00:00"),
    ];
    expect(countPendingOrders(orders)).toBe(2);
  });

  it("starts the week at local midnight on Monday", () => {
    // Wednesday 7 Oct 2026, 15:30 local
    expect(startOfWeek(new Date(2026, 9, 7, 15, 30))).toEqual(
      new Date(2026, 9, 5),
    );
    // Sunday belongs to the week that started the previous Monday
    expect(startOfWeek(new Date(2026, 9, 11, 23, 0))).toEqual(
      new Date(2026, 9, 5),
    );
    // Monday itself
    expect(startOfWeek(new Date(2026, 9, 5, 0, 0))).toEqual(
      new Date(2026, 9, 5),
    );
  });

  it("counts only orders placed since Monday", () => {
    const now = new Date(2026, 9, 7, 12, 0);
    const orders = [
      makeOrder("received", new Date(2026, 9, 5, 0, 0).toISOString()),
      makeOrder("received", new Date(2026, 9, 7, 9, 0).toISOString()),
      makeOrder("received", new Date(2026, 9, 4, 23, 59).toISOString()),
    ];
    expect(countOrdersThisWeek(orders, now)).toBe(2);
  });

  it("summarises the items in an order", () => {
    expect(summariseItems(makeOrder("received", "2026-10-05T09:00:00"))).toBe(
      "2× Jollof rice, 1× Meat pie",
    );
  });
});
