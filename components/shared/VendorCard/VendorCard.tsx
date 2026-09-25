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
import { WEEKDAYS, WEEKDAY_LABELS } from "@/schemas/deliverySettingsSchema"
import { formatPrice } from "@/lib/utils"
import type { Vendor } from "@/types/vendor"

type Theme = { icon: LucideIcon; banner: string; iconColor: string }

const CATEGORY_THEMES: Record<string, Theme> = {
  Groceries: {
    icon: ShoppingBasket,
    banner: "from-orange-200 via-orange-100 to-amber-50 dark:from-orange-500/25 dark:via-orange-500/10 dark:to-transparent",
    iconColor: "text-orange-600 dark:text-orange-300",
  },
  Beverages: {
    icon: ShoppingBasket,
    banner: "from-orange-200 via-orange-100 to-amber-50 dark:from-orange-500/25 dark:via-orange-500/10 dark:to-transparent",
    iconColor: "text-orange-600 dark:text-orange-300",
  },
  Produce: {
    icon: Leaf,
    banner: "from-emerald-200 via-emerald-100 to-lime-50 dark:from-emerald-500/25 dark:via-emerald-500/10 dark:to-transparent",
    iconColor: "text-emerald-600 dark:text-emerald-300",
  },
  Dairy: {
    icon: Leaf,
    banner: "from-emerald-200 via-emerald-100 to-lime-50 dark:from-emerald-500/25 dark:via-emerald-500/10 dark:to-transparent",
    iconColor: "text-emerald-600 dark:text-emerald-300",
  },
  Bakery: {
    icon: Croissant,
    banner: "from-amber-200 via-yellow-100 to-orange-50 dark:from-amber-500/25 dark:via-amber-500/10 dark:to-transparent",
    iconColor: "text-amber-600 dark:text-amber-300",
  },
  Household: {
    icon: House,
    banner: "from-sky-200 via-sky-100 to-indigo-50 dark:from-sky-500/25 dark:via-sky-500/10 dark:to-transparent",
    iconColor: "text-sky-600 dark:text-sky-300",
  },
}

const FALLBACK_THEME: Theme = {
  icon: Store,
  banner: "from-primary/25 via-primary/10 to-transparent",
  iconColor: "text-primary",
}

/** "Mon–Fri", "Mon, Wed, Sat" — collapses runs of 3+ consecutive days. */
function formatDays(days: Vendor["availableDays"]) {
  const indexes = WEEKDAYS.map((day, index) => (days.includes(day) ? index : -1)).filter(
    (index) => index >= 0
  )
  const parts: string[] = []
  let start = 0
  while (start < indexes.length) {
    let end = start
    while (end + 1 < indexes.length && indexes[end + 1] === indexes[end] + 1) end++
    const label = (i: number) => WEEKDAY_LABELS[WEEKDAYS[indexes[i]]]
    if (end - start >= 2) {
      parts.push(`${label(start)}–${label(end)}`)
    } else {
      for (let i = start; i <= end; i++) parts.push(label(i))
    }
    start = end + 1
  }
  return parts.join(", ")
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
      <div className={`relative h-20 bg-gradient-to-br ${theme.banner}`}>
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm">
          {/* On hover/focus the truck drives off and the delivered package arrives.
              Both states only swap when motion is allowed; otherwise the truck stays. */}
          <span aria-hidden="true" className="relative size-3.5 overflow-hidden">
            <Truck className="absolute inset-0 size-3.5 text-primary transition-all duration-500 ease-in-out motion-safe:group-hover:translate-x-4 motion-safe:group-hover:opacity-0 motion-safe:group-focus-visible:translate-x-4 motion-safe:group-focus-visible:opacity-0" />
            <PackageCheck className="absolute inset-0 size-3.5 -translate-x-4 text-emerald-600 opacity-0 transition-all duration-500 ease-in-out motion-safe:group-hover:translate-x-0 motion-safe:group-hover:opacity-100 motion-safe:group-focus-visible:translate-x-0 motion-safe:group-focus-visible:opacity-100 dark:text-emerald-400" />
          </span>
          {formatPrice(vendor.deliveryFee)}
        </span>
        <div className="absolute bottom-0 left-4 flex size-12 translate-y-1/2 items-center justify-center rounded-xl border border-border bg-card shadow-sm">
          <Icon
            aria-hidden="true"
            className={`size-6 transition-transform duration-300 group-hover:scale-110 ${theme.iconColor}`}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 pt-9">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-base font-semibold">{vendor.name}</h3>
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

        <span className="mt-auto inline-flex items-center gap-1 pt-1 text-sm font-medium text-primary">
          Browse menu
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  )
}

export { VendorCard }
