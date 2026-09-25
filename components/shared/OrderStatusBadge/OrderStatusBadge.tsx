import { Badge, type badgeVariants } from "@/components/ui/badge"
import type { VariantProps } from "class-variance-authority"
import type { OrderStatus } from "@/types/order"

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; variant: VariantProps<typeof badgeVariants>["variant"] }
> = {
  placed: { label: "Placed", variant: "secondary" },
  confirmed: { label: "Confirmed", variant: "outline" },
  preparing: { label: "Preparing", variant: "default" },
  ready_for_collection: { label: "Ready for collection", variant: "success" },
  collected: { label: "Collected", variant: "outline" },
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
