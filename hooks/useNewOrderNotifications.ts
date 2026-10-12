"use client";

import { useRouter } from "next/navigation";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types/order";

// 1. Accept router as a parameter here
function showBrowserNotification(
  title: string,
  body: string,
  router: ReturnType<typeof useRouter>,
) {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return;
  }
  if (Notification.permission !== "granted") {
    return;
  }

  try {
    const notification = new Notification(title, { body, icon: "/logo.png" });
    notification.onclick = () => {
      window.focus();

      // 2. Safely use the passed router instance
      router.push("/dashboard/orders");

      notification.close();
    };
  } catch {
    // Some mobile browsers only allow notifications through a service worker.
    // The in-app toast below still covers those.
  }
}

/**
 * Compares each fetch of the vendor's orders against what it has already seen
 * and announces any newly arrived "received" orders.
 */
export function useNewOrderNotifications(orders: Order[] | undefined) {
  const seen = useRef<Set<string> | null>(null);
  // 3. Initialize useRouter correctly inside the hook body
  const router = useRouter();

  useEffect(() => {
    if (!orders) {
      return;
    }

    const incoming = orders.filter((order) => order.status === "received");
    const known = seen.current;

    // First load: remember what's already there, so opening or refreshing the
    // dashboard doesn't re-announce orders the vendor has already seen.
    if (known === null) {
      seen.current = new Set(incoming.map((order) => order.reference));
      return;
    }

    const fresh = incoming.filter((order) => !known.has(order.reference));
    if (fresh.length === 0) {
      return;
    }
    fresh.forEach((order) => known.add(order.reference));

    const title =
      fresh.length === 1
        ? "New order received"
        : `${fresh.length} new orders received`;
    const body =
      fresh.length === 1
        ? `${fresh[0].reference} · ${formatPrice(fresh[0].total)}`
        : "Open your dashboard to review them.";

    // 4. Pass the router instance into the helper function
    showBrowserNotification(title, body, router);
    toast.info(title, { description: body });
  }, [orders, router]); // 5. Added router to the dependency array
}
