import { Check } from "lucide-react"
import { ORDER_STATUSES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { OrderStatus } from "@/types/order"

const STEP_LABELS: Record<OrderStatus, string> = {
  placed: "Placed",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready_for_collection: "Ready",
  collected: "Collected",
}

/** Horizontal tracker showing how far an order has moved through ORDER_STATUSES. */
function OrderProgress({ status }: { status: OrderStatus }) {
  const currentIndex = ORDER_STATUSES.indexOf(status)
  const isFinished = currentIndex === ORDER_STATUSES.length - 1

  return (
    <ol aria-label="Order progress" className="flex items-start">
      {ORDER_STATUSES.map((step, index) => {
        const current = index === currentIndex
        // The last step has nothing after it, so once reached it counts as done.
        const done = index < currentIndex || (isFinished && current)
        return (
          <li
            key={step}
            aria-current={current ? "step" : undefined}
            className="relative flex flex-1 flex-col items-center gap-1.5 text-center"
          >
            {index > 0 && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-3 right-1/2 h-0.5 w-full -translate-y-1/2 transition-colors duration-500",
                  index <= currentIndex ? "bg-primary" : "bg-border"
                )}
              />
            )}
            <span
              className={cn(
                "relative z-10 flex size-6 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors duration-500",
                done && "border-primary bg-primary text-primary-foreground",
                current && !done && "border-primary bg-card text-primary ring-4 ring-primary/15",
                !done && !current && "border-border bg-card text-muted-foreground"
              )}
            >
              {done ? <Check aria-hidden="true" className="size-3.5" /> : index + 1}
            </span>
            <span
              className={cn(
                "text-[11px] leading-tight sm:text-xs",
                current ? "font-semibold text-foreground" : "text-muted-foreground"
              )}
            >
              {STEP_LABELS[step]}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

export { OrderProgress }
