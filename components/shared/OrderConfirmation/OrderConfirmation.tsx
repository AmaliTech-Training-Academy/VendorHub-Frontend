import Link from "next/link"
import { CircleCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import type { Order } from "@/types/order"

function OrderConfirmation({ order }: { order: Order }) {
  return (
    <div className="flex flex-col items-center gap-5 rounded-2xl border border-border bg-gradient-to-b from-emerald-500/10 via-card to-card p-8 text-center shadow-sm animate-in fade-in zoom-in-95 duration-500 motion-reduce:animate-none">
      <div className="flex size-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 ring-8 ring-emerald-500/10 dark:text-emerald-400">
        <CircleCheck aria-hidden="true" className="size-8" />
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">Order placed!</h2>
        <p className="text-sm text-muted-foreground">
          Sit tight — your order is on its way to the vendor.
        </p>
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">
          Reference
        </span>
        <span className="rounded-full bg-muted px-4 py-1.5 font-mono text-sm">
          {order.reference}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">
        Total charged:{" "}
        <span className="font-semibold text-foreground">
          {formatPrice(order.total)}
        </span>
      </p>
      <Link href="/storefront/vendors">
        <Button className="rounded-full">Continue browsing</Button>
      </Link>
    </div>
  )
}

export { OrderConfirmation }
