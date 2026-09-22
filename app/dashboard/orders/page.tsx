"use client"

import { CircleAlert, ClipboardList } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { EmptyState } from "@/components/shared/EmptyState"
import { OrdersTable } from "@/components/shared/OrdersTable"
import { OrdersTableSkeleton } from "@/components/shared/OrdersTableSkeleton"
import { useVendorOrders } from "@/hooks/useOrders"
import { MOCK_VENDOR_ID } from "@/lib/constants"

export default function OrdersPage() {
  const vendorId = MOCK_VENDOR_ID
  const { data: orders, isPending, isError } = useVendorOrders(vendorId)

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">Incoming orders</h1>
        <p className="text-sm text-muted-foreground">
          Orders placed by employees through the storefront.
        </p>
      </div>

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
