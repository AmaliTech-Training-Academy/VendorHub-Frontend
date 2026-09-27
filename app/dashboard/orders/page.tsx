"use client"

import { CircleAlert, ClipboardList, Clock, Wallet } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { EmptyState } from "@/components/shared/EmptyState"
import { OrdersTable } from "@/components/shared/OrdersTable"
import { OrdersTableSkeleton } from "@/components/shared/OrdersTableSkeleton"
import { StatCard } from "@/components/shared/StatCard"
import { useVendorOrders } from "@/hooks/useOrders"
import { useVendorId } from "@/hooks/useVendorId"
import { formatPrice } from "@/lib/utils"

export default function OrdersPage() {
  const vendorId = useVendorId()
  const { data: orders, isPending, isError } = useVendorOrders(vendorId)

  const pending = orders?.filter((order) => order.status !== "collected") ?? []
  const revenue = orders?.reduce((sum, order) => sum + order.total, 0) ?? 0

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
      <div className="flex items-center gap-4 rounded-2xl bg-linear-to-br from-accent via-accent/60 to-transparent p-5">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-950 text-orange-400 shadow-sm dark:ring-1 dark:ring-white/15">
          <ClipboardList aria-hidden="true" className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Incoming orders</h1>
          <p className="text-sm text-muted-foreground">
            Orders placed by employees through the storefront.
          </p>
        </div>
      </div>

      {orders && orders.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard icon={ClipboardList} label="Total orders" value={orders.length} />
          <StatCard
            icon={Clock}
            tone="warning"
            label="In progress"
            value={pending.length}
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
          description="New orders from the storefront will appear here immediately."
        />
      )}

      {orders && orders.length > 0 && <OrdersTable orders={orders} />}
    </div>
  )
}
