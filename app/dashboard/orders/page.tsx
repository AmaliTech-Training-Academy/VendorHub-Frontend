"use client"

import { Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
  }).format(price)
}

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

      {isPending && (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading orders…
        </div>
      )}

      {isError && (
        <p className="text-sm text-destructive">
          Something went wrong loading your orders. Please try again.
        </p>
      )}

      {orders && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border py-16 text-center">
          <p className="text-sm font-medium">No orders yet</p>
          <p className="text-sm text-muted-foreground">
            New orders from the storefront will appear here immediately.
          </p>
        </div>
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
