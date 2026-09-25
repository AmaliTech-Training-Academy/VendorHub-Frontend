"use client"

import { ClipboardList, CircleAlert } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { EmptyState } from "@/components/shared/EmptyState"
import { OrderHistoryCard } from "@/components/shared/OrderHistoryCard"
import { OrderHistorySkeleton } from "@/components/shared/OrderHistorySkeleton"
import { useEmployeeOrders } from "@/hooks/useOrders"
import { MOCK_EMPLOYEE_ID } from "@/lib/constants"

export default function OrderHistoryPage() {
  const { data: orders, isPending, isError } = useEmployeeOrders(MOCK_EMPLOYEE_ID)

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">Your orders</h1>
        <p className="text-sm text-muted-foreground">
          Everything you&apos;ve ordered, most recent first.
        </p>
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
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <OrderHistoryCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}
