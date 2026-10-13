"use client";

import Link from "next/link";

import { Bell, BellRing } from "lucide-react";
import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { useNewOrderNotifications } from "@/hooks/useNewOrderNotifications";
import { useOrders } from "@/hooks/useOrders";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";

type Permission = NotificationPermission | "unsupported";

function readPermission(): Permission {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  return Notification.permission;
}

export function OrderNotificationButton() {
  const userId = useAuthStore((state) => state.userId);
  // Same query key as the Orders page, so both share one cache and one request.
  const { data: orders } = useOrders(userId === null ? "" : String(userId), {
    pollInBackground: true,
  });
  useNewOrderNotifications(orders);

  // Read once when the component first renders. This component only renders
  // on the client (AuthGuard shows a spinner until hydration finishes), so
  // `Notification` is available and no effect is needed.
  const [permission, setPermission] = useState<Permission>(readPermission);

  const incomingCount =
    orders?.filter((order) => order.status === "received").length ?? 0;

  // Browsers only allow this prompt as a response to a click.
  const enableAlerts = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  return (
    <div className="fixed right-6 bottom-6  flex flex-col items-end gap-2">
      {permission === "default" && (
        <Button
          size="sm"
          variant="secondary"
          className="shadow-md"
          onClick={() => {
            void enableAlerts();
          }}
        >
          Turn on order alerts
        </Button>
      )}

      <Link
        href="/dashboard/orders"
        aria-label={`Orders, ${incomingCount} waiting`}
        className={cn(
          buttonVariants({ size: "icon" }),
          "relative size-14 rounded-full bg-orange-500 text-white shadow-lg hover:bg-orange-600",
        )}
      >
        {incomingCount > 0 ? (
          <BellRing className="size-6 motion-safe:animate-pulse" />
        ) : (
          <Bell className="size-6" />
        )}
        {incomingCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute -top-1 -right-1 flex min-w-5 items-center justify-center rounded-full bg-blue-950 px-1 text-[11px] leading-5 font-semibold text-white tabular-nums"
          >
            {incomingCount}
          </span>
        )}
      </Link>
    </div>
  );
}
