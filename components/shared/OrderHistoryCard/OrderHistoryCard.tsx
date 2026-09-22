import { memo } from "react"
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge"
import { formatPrice } from "@/lib/utils"
import type { Order } from "@/types/order"

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso))
}

function OrderHistoryCardComponent({ order }: { order: Order }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col">
          <span className="font-medium">{order.vendorName}</span>
          <span className="text-sm text-muted-foreground">
            {formatDate(order.createdAt)} · {order.reference}
          </span>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
        {order.items.map((item) => (
          <li key={item.productId} className="flex justify-between gap-3">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between border-t border-border pt-3 font-medium">
        <span>Total</span>
        <span>{formatPrice(order.total)}</span>
      </div>
    </div>
  )
}

/**
 * Memoized so a polling refetch that only changes one order's status (a new
 * object reference for that order alone, thanks to React Query's structural
 * sharing) doesn't re-render every other card in the list.
 */
const OrderHistoryCard = memo(OrderHistoryCardComponent)

export { OrderHistoryCard }
