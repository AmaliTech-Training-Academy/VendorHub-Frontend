"use client"

import { CircleAlert } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/shared/EmptyState"
import { OrdersTableSkeleton } from "@/components/shared/OrdersTableSkeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useVendorOrders } from "@/hooks/useOrders"
import { MOCK_VENDOR_ID } from "@/lib/constants"
import { formatPrice } from "@/lib/utils"

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
          title="No orders yet"
          description="New orders from the storefront will appear here immediately."
        />
      )}

      {orders && orders.length > 0 && (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">
                    {order.reference}
                  </TableCell>
                  <TableCell>
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                  </TableCell>
                  <TableCell>{formatPrice(order.total)}</TableCell>
                  <TableCell>
                    <Badge variant={order.status === "pending" ? "secondary" : "success"}>
                      {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
