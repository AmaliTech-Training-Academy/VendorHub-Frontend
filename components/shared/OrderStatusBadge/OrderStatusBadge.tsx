import { Badge, type badgeVariants } from "@/components/ui/badge"
import type { OrderStatus } from "@/types/order"

import type { VariantProps } from "class-variance-authority"

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; variant: VariantProps<typeof badgeVariants>["variant"] }
> = {
  received: { label: "Received", variant: "secondary" },
  preparing: { label: "Preparing", variant: "default" },
  ready_for_collection: { label: "Ready for collection", variant: "success" },
}

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, variant } = STATUS_CONFIG[status]
  return (
    <Badge variant={variant} className="transition-colors duration-300">
      {label}
    </Badge>
  )
}

export { OrderStatusBadge }
