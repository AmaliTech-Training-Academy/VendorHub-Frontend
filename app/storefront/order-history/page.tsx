"use client";

import { ClipboardList, CircleAlert } from "lucide-react";

import { EmptyState } from "@/components/shared/EmptyState";
import { OrderHistoryCard } from "@/components/shared/OrderHistoryCard";
import { OrderHistorySkeleton } from "@/components/shared/OrderHistorySkeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useOrders } from "@/hooks/useOrders";
import { useAuthStore } from "@/store/useAuthStore";

export default function OrderHistoryPage() {
  const userId = useAuthStore((state) => state.userId);
  const {
    data: orders,
    isPending,
    isError,
  } = useOrders(userId === null ? "" : String(userId));

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6">
      <div className="flex items-center gap-4 rounded-lg p-5 border-b-1">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-950 text-orange-400 shadow-sm dark:ring-1 dark:ring-white/15">
          <ClipboardList aria-hidden="true" className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Your orders</h1>
          <p className="text-sm text-muted-foreground">
            Track everything you&apos;ve ordered, most recent first.
          </p>
        </div>
      </div>

      {isPending && <OrderHistorySkeleton />}

      {isError && (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>Unable to load your orders</AlertTitle>
          <AlertDescription>
            Something went wrong loading your order history. Please try again.
          </AlertDescription>
        </Alert>
      )}

      {orders && orders.length === 0 && (
        <EmptyState
          icon={ClipboardList}
          title="No orders yet"
          description="Orders you place from the storefront will show up here."
        />
      )}

      {orders && orders.length > 0 && (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <OrderHistoryCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
