"use client";

import { CircleAlert, ClipboardList, Clock, Wallet } from "lucide-react";
import { toast } from "sonner";

import { DashboardPageHeader } from "@/components/shared/layout/dashboard/DashboardPageHeader";
import { OrdersTableSkeleton } from "@/components/shared/OrdersTableSkeleton";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatPrice } from "@/lib/utils";
import { useVendorOrders } from "@/hooks/useOrders";
import { useVendorId } from "@/hooks/useVendorId";
import { EmptyState } from "@/components/shared/EmptyState";
import { OrdersTable } from "@/components/shared/OrdersTable";
import { OrdersTableSkeleton } from "@/components/shared/OrdersTableSkeleton";
import { StatCard } from "@/components/shared/StatCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useOrders, useUpdateOrderStatus } from "@/hooks/useOrders";
import { useVendorId } from "@/hooks/useVendorId";

import type { Order, OrderStatus } from "@/types/order";

export default function OrdersPage() {
  const vendorId = useVendorId();
  const { data: orders, isPending, isError } = useVendorOrders(vendorId);
  const vendorId = useVendorId();
  const { data: orders, isPending, isError } = useOrders(vendorId);
  const updateStatus = useUpdateOrderStatus(vendorId);

  const inProgress =
    orders?.filter((order) => order.status !== "ready_for_collection") ?? [];
  const revenue = orders?.reduce((sum, order) => sum + order.total, 0) ?? 0;

  function handleAdvance(order: Order, status: OrderStatus) {
    updateStatus.mutate(
      { orderId: order.id, status },
      {
        onError: (error) => {
          toast.error(error.message || `Couldn't update ${order.reference}`);
        },
      },
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <DashboardPageHeader
        title="Incoming orders"
        description="Orders placed by employees through the storefront."
        icon={ClipboardList}
      />

      {orders && orders.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            icon={ClipboardList}
            label="Total orders"
            value={orders.length}
          />
          <StatCard
            icon={Clock}
            tone="warning"
            label="In progress"
            value={inProgress.length}
          />
          <StatCard
            icon={Wallet}
            tone="success"
            label="Revenue"
            value={formatPrice(revenue)}
          />
        </div>
      )}

      {isPending && <OrdersTableSkeleton />}

      {isError && (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>Unable to load orders</AlertTitle>
          <AlertDescription>
            Something went wrong loading your orders. Please try again.
          </AlertDescription>
        </Alert>
      )}

      {orders && orders.length === 0 && (
        <EmptyState
          icon={ClipboardList}
          title="No orders yet"
          description="New orders from the storefront will appear here."
        />
      )}

      {orders && orders.length > 0 && (
        <OrdersTable
          orders={orders}
          onAdvance={handleAdvance}
          updatingOrderId={
            updateStatus.isPending ? updateStatus.variables.orderId : undefined
          }
        />
      )}
    </div>
  );
}
