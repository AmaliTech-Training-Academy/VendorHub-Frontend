import { ClipboardList } from "lucide-react"

import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate, formatPrice } from "@/lib/utils"
import type { Order } from "@/types/order"

function OrdersTable({ orders }: { orders: Order[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Placed</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ClipboardList aria-hidden="true" className="size-5" />
                  </div>
                  <span className="font-mono text-sm font-semibold">
                    {order.reference}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(order.createdAt)}
              </TableCell>
              <TableCell>
                {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
              </TableCell>
              <TableCell className="font-semibold">{formatPrice(order.total)}</TableCell>
              <TableCell>
                <OrderStatusBadge status={order.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export { OrdersTable }
