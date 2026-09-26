import { memo } from "react"
import { Store } from "lucide-react"
import { OrderProgress } from "@/components/shared/OrderProgress"
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge"
import { cn, formatDate, formatPrice } from "@/lib/utils"
import type { Order, OrderStatus } from "@/types/order"

const STATUS_EDGE: Record<OrderStatus, string> = {
  placed: "border-l-slate-300 dark:border-l-slate-600",
  confirmed: "border-l-sky-400",
  preparing: "border-l-primary",
  ready_for_collection: "border-l-emerald-500",
  collected: "border-l-border",
}

function OrderHistoryCardComponent({ order }: { order: Order }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-l-4 border-border bg-card p-4 shadow-sm transition-colors duration-500 sm:p-5",
        STATUS_EDGE[order.status]
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Store aria-hidden="true" className="size-5" />
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-semibold">{order.vendorName}</span>
            <span className="text-sm text-muted-foreground">
              {formatDate(order.createdAt)} · {order.reference}
            </span>
          </div>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <OrderProgress status={order.status} />

      <ul className="flex flex-col gap-1.5 rounded-xl bg-muted/50 p-3 text-sm">
        {order.items.map((item) => (
          <li key={item.productId} className="flex justify-between gap-3">
            <span className="text-muted-foreground">
              {item.name} × {item.quantity}
            </span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Total</span>
        <span className="text-lg font-semibold text-primary">
          {formatPrice(order.total)}
        </span>
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
