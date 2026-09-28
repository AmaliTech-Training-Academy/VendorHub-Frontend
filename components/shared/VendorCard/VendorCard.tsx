import Link from "next/link"
import {
  ArrowRight,
  CalendarDays,
  Clock,
  Croissant,
  House,
  Leaf,
  PackageCheck,
  ShoppingBasket,
  Store,
  Truck,
  type LucideIcon,
} from "lucide-react"
import { formatDays, formatPrice } from "@/lib/utils"
import type { Vendor } from "@/types/vendor"

type Theme = { icon: LucideIcon; iconColor: string }

const CATEGORY_THEMES: Record<string, Theme> = {
  Groceries: {
    icon: ShoppingBasket,
    iconColor: "text-orange-600 dark:text-orange-300",
  },
  Beverages: {
    icon: ShoppingBasket,
    iconColor: "text-orange-600 dark:text-orange-300",
  },
  Produce: {
    icon: Leaf,
    iconColor: "text-emerald-600 dark:text-emerald-300",
  },
  Dairy: {
    icon: Leaf,
    iconColor: "text-emerald-600 dark:text-emerald-300",
  },
  Bakery: {
    icon: Croissant,
    iconColor: "text-amber-600 dark:text-amber-300",
  },
  Household: {
    icon: House,
    iconColor: "text-sky-600 dark:text-sky-300",
  },
}

const FALLBACK_THEME: Theme = {
  icon: Store,
  iconColor: "text-primary",
}

function VendorCard({ vendor, index = 0 }: { vendor: Vendor; index?: number }) {
  const theme = CATEGORY_THEMES[vendor.categories[0]] ?? FALLBACK_THEME
  const Icon = theme.icon
  const [firstWindow, ...otherWindows] = vendor.timeWindows

  return (
    <Link
      href={`/storefront/vendors/${vendor.id}`}
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm outline-none transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 fill-mode-backwards motion-reduce:animate-none hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/10 focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/50">
            <Icon
              aria-hidden="true"
              className={`size-6 transition-transform duration-300 group-hover:scale-110 ${theme.iconColor}`}
            />
          </div>
          <div className="flex min-w-0 flex-col gap-1.5">
            <h3 className="truncate text-base font-semibold">{vendor.name}</h3>
            <div className="flex flex-wrap gap-1.5">
              {vendor.categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>

        <dl className="flex flex-col gap-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <dt className="sr-only">Delivery days</dt>
            <CalendarDays aria-hidden="true" className="size-4 shrink-0" />
            <dd>{formatDays(vendor.availableDays)}</dd>
          </div>
          {firstWindow && (
            <div className="flex items-center gap-2">
              <dt className="sr-only">Delivery times</dt>
              <Clock aria-hidden="true" className="size-4 shrink-0" />
              <dd>
                {firstWindow.startTime}–{firstWindow.endTime}
                {otherWindows.length > 0 && ` +${otherWindows.length} more`}
              </dd>
            </div>
          )}
        </dl>

        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
            Browse menu
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </span>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-muted/40 px-2.5 text-xs font-medium text-foreground">
            {/* On hover/focus the truck grows and drives off to the right while the delivered
                package slides in and grows. Under reduced motion the swap is instant. */}
            <span aria-hidden="true" className="relative h-7 w-16 overflow-hidden">
              <Truck className="absolute top-1/2 left-1 size-4 origin-left -translate-y-1/2 text-primary transition-all delay-100 duration-800 ease-in-out motion-reduce:transition-none group-hover:translate-x-16 group-hover:scale-[1.75] group-hover:opacity-0 group-focus-visible:translate-x-16 group-focus-visible:scale-[1.75] group-focus-visible:opacity-0" />
              <PackageCheck className="absolute top-1/2 left-1 size-4 origin-left -translate-y-1/2 translate-x-16 scale-75 text-blue-950 dark:text-orange-400 opacity-0 transition-all delay-100 duration-700 ease-in-out motion-reduce:transition-none group-hover:translate-x-0 group-hover:scale-150 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:scale-150 group-focus-visible:opacity-100" />
            </span>
            {formatPrice(vendor.deliveryFee)}
          </span>
        </div>
      </div>
    </Link>
  )
}

export { VendorCard }
