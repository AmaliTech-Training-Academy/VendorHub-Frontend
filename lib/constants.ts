/** Lifecycle of an order, in the order a vendor moves it through. */
export const ORDER_STATUSES = [
  "received",
  "preparing",
  "ready_for_collection",
] as const;

// 🔧 TEMPORARY — placeholder image until the backend adds a real image field
// to the product schema. Drop a file at this path in /public.
export const PLACEHOLDER_IMAGE = "/jollof.jpg";
