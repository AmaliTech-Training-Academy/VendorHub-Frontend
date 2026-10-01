import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { upcomingDeliveryDates } from "../lib/deliveryDates";

import type * as OrdersModule from "../lib/api/orders";

const apiUrl = "https://api.vendorhub.test";

describe("upcomingDeliveryDates", () => {
  // Monday 5 Oct 2026, local time.
  const monday = new Date(2026, 9, 5);

  it("only returns dates on the vendor's available days, starting tomorrow", () => {
    const dates = upcomingDeliveryDates(["MONDAY", "WEDNESDAY"], monday);
    expect(dates.map((d) => d.value)).toEqual([
      "2026-10-07",
      "2026-10-12",
      "2026-10-14",
      "2026-10-19",
    ]);
  });

  it("leaves out today even when it is an available day", () => {
    const dates = upcomingDeliveryDates(["MONDAY"], monday);
    expect(dates.map((d) => d.value)).toEqual(["2026-10-12", "2026-10-19"]);
  });

  it("maps Sunday correctly (JS getDay 0 vs the backend's SUNDAY)", () => {
    const saturday = new Date(2026, 9, 10);
    const dates = upcomingDeliveryDates(["SUNDAY"], saturday);
    expect(dates.map((d) => d.value)).toEqual(["2026-10-11", "2026-10-18"]);
  });

  it("returns nothing when the vendor has no days", () => {
    expect(upcomingDeliveryDates([], monday)).toEqual([]);
  });

  it("labels dates for display", () => {
    const [first] = upcomingDeliveryDates(["WEDNESDAY"], monday);
    expect(first.label).toBe("Wed 7 Oct");
  });
});

const orderResponse = {
  id: 17,
  order_code: "ORD-9F2K",
  employee: 4,
  vendor: 3,
  vendor_name: "Mama's Kitchen",
  delivery_window: 8,
  delivery_date: "2026-10-12",
  selected_window_name: "Morning",
  selected_start_time: "10:00:00",
  selected_end_time: "12:00:00",
  items: [
    {
      id: 1,
      product_id: 21,
      product_name: "Jollof rice",
      quantity: 2,
      unit_price: "20.00",
      subtotal: "40.00",
    },
  ],
  subtotal: "40.00",
  delivery_fee: "5.00",
  total_amount: "45.00",
  status: "PENDING",
  created_at: "2026-10-05T09:00:00Z",
  updated_at: "2026-10-05T09:00:00Z",
};

const input = {
  vendorId: "3",
  items: [
    { productId: 21, vendorId: "3", name: "Jollof rice", price: 20, quantity: 2 },
  ],
  deliveryWindowId: 8,
  deliveryDate: "2026-10-12",
};

describe("placeOrder", () => {
  let orders: typeof OrdersModule;

  beforeEach(async () => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_API_URL", apiUrl);
    vi.stubGlobal("fetch", vi.fn());
    orders = await import("../lib/api/orders");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("posts only ids, quantities, window and date — no prices or employee", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify(orderResponse), { status: 201 }),
    );

    await orders.placeOrder(input);

    const [url, init] = vi.mocked(fetch).mock.calls[0];
    expect(url).toBe(`${apiUrl}/orders/`);
    expect(init?.method).toBe("POST");
    expect(JSON.parse(init?.body as string)).toEqual({
      vendor_id: 3,
      items: [{ product_id: 21, quantity: 2 }],
      selected_delivery_window: 8,
      delivery_date: "2026-10-12",
    });
  });

  it("maps the response into the app's Order shape", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify(orderResponse), { status: 201 }),
    );

    const order = await orders.placeOrder(input);

    expect(order).toMatchObject({
      id: "17",
      reference: "ORD-9F2K",
      vendorId: "3",
      vendorName: "Mama's Kitchen",
      employeeId: "4",
      deliveryWindowId: 8,
      deliveryWindowLabel: "Morning · 10:00–12:00",
      deliveryDate: "2026-10-12",
      subtotal: 40,
      deliveryFee: 5,
      total: 45,
      status: "placed",
    });
    expect(order.items).toEqual([
      { productId: 21, vendorId: "3", name: "Jollof rice", price: 20, quantity: 2 },
    ]);
  });

  it("keeps a recognised status and falls back to placed for an unknown one", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ ...orderResponse, status: "PREPARING" }), {
        status: 201,
      }),
    );
    expect((await orders.placeOrder(input)).status).toBe("preparing");

    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ ...orderResponse, status: "SOMETHING_NEW" }), {
        status: 201,
      }),
    );
    expect((await orders.placeOrder(input)).status).toBe("placed");
  });

  it("rejects an invalid order before calling the API", async () => {
    await expect(
      orders.placeOrder({ ...input, deliveryDate: "12/10/2026" }),
    ).rejects.toThrow();
    await expect(orders.placeOrder({ ...input, items: [] })).rejects.toThrow();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("surfaces the backend's error message", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ detail: "Product is out of stock." }), {
        status: 400,
      }),
    );

    await expect(orders.placeOrder(input)).rejects.toThrow("Product is out of stock.");
  });
});
