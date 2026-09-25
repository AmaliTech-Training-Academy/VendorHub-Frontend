import Link from "next/link";
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
} from "lucide-react";
import { WEEKDAYS, WEEKDAY_LABELS } from "@/schemas/deliverySettingsSchema";
import { formatPrice } from "@/lib/utils";
import type { Vendor } from "@/types/vendor";

// Native shadcn/ui atoms
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Theme = { icon: LucideIcon };

const CATEGORY_THEMES: Record<string, Theme> = {
  Groceries: { icon: ShoppingBasket },
  Beverages: { icon: ShoppingBasket },
  Produce: { icon: Leaf },
  Dairy: { icon: Leaf },
  Bakery: { icon: Croissant },
  Household: { icon: House },
};

const FALLBACK_THEME: Theme = {
  icon: Store,
};

function formatDays(days: Vendor["availableDays"]) {
  const indexes = WEEKDAYS.map((day, index) =>
    days.includes(day) ? index : -1,
  ).filter((index) => index >= 0);
  const parts: string[] = [];
  let start = 0;
  while (start < indexes.length) {
    let end = start;
    while (end + 1 < indexes.length && indexes[end + 1] === indexes[end] + 1)
      end++;
    const label = (i: number) => WEEKDAY_LABELS[WEEKDAYS[indexes[i]]];
    if (end - start >= 2) {
      parts.push(`${label(start)}–${label(end)}`);
    } else {
      for (let i = start; i <= end; i++) parts.push(label(i));
    }
    start = end + 1;
  }
  return parts.join(", ");
}

function VendorCard({ vendor, index = 0 }: { vendor: Vendor; index?: number }) {
  const theme = CATEGORY_THEMES[vendor.categories[0]] ?? FALLBACK_THEME;
  const Icon = theme.icon;
  const [firstWindow, ...otherWindows] = vendor.timeWindows;

  return (
    <Link
      href={`/storefront/vendors/${vendor.id}`}
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
      className="group block w-full max-w-xl outline-none transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 fill-mode-backwards motion-reduce:animate-none hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-orange-500 rounded-xl p-2"
    >
      <Card className="overflow-hidden     dark:border-slate-800 bg-orange-50/20 dark:bg-slate-950 shadow transition-shadow group-hover:shadow-md group-hover:border-green-900">
        {/* Fixed wrapping configuration to cleanly manage left-to-right structure on mobile devices */}
        <div className="flex flex-col sm:flex-row min-h-30 gap-2 p-3 sm:p-4 items-start sm:items-center">
          {/* Brand Icon Frame: Kept separate so content flows properly to its right */}
          <div className="shrink-0 mb-1 sm:mb-0">
            <span className="inline-flex bg-orange-50 dark:bg-slate-900 p-3 sm:p-4 rounded-full">
              <Icon
                aria-hidden="true"
                className="size-5 sm:size-5.5 text-orange-600 group-hover:scale-110 delay-100 duration-150 transition-all"
              />
            </span>
          </div>

          {/* Unified layout layer resolving internal content collisions */}
          <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center sm:gap-4 p-0 w-full min-w-0">
            {/* Main Metadata Cluster */}
            <div className="flex flex-col gap-2 w-full min-w-0  sm:mb-0">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  {vendor.categories.slice(0, 1).map((category) => (
                    <Badge
                      key={category}
                      variant="outline"
                      className="rounded-md font-normal text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 px-1.5 bg-slate-50 dark:bg-slate-900 shrink-0"
                    >
                      {category}
                    </Badge>
                  ))}
                </div>

                <h2 className=" text-base font-extrabold sm:text-base  tracking-tight text-slate-900 dark:text-slate-50 group-hover:text-orange-500 transition-colors truncate">
                  {vendor.name}
                </h2>
              </div>

              {/* Delivery Days & Window Identifiers */}
              <dl className="grid gap-0.5 text-xs text-slate-500 dark:text-slate-400 min-w-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <dt className="sr-only">Delivery days</dt>
                  <CalendarDays
                    aria-hidden="true"
                    className="size-3.5 shrink-0 text-slate-400"
                  />
                  <dd className="truncate text-slate-600 dark:text-slate-400">
                    {formatDays(vendor.availableDays)}
                  </dd>
                </div>
                {firstWindow && (
                  <div className="flex items-center gap-1.5 min-w-0">
                    <dt className="sr-only">Delivery times</dt>
                    <Clock
                      aria-hidden="true"
                      className="size-3.5 shrink-0 text-slate-400"
                    />
                    <dd className="font-medium text-slate-700 dark:text-slate-300 truncate">
                      {firstWindow.startTime}–{firstWindow.endTime}
                      {otherWindows.length > 0 && (
                        <span className="text-[10px] font-normal text-slate-400 ml-1 truncate">
                          +{otherWindows.length} slots
                        </span>
                      )}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Transactional Right-Hand Info Column */}
            <div className="flex items-center justify-between w-full sm:w-auto border-t sm:border-none border-slate-200 dark:border-slate-800 pt-2.5 sm:pt-0 sm:flex-col sm:items-end sm:justify-center sm:gap-1 shrink-0">
              {/* Delivery pricing tag containing your sliding animations */}
              <div className="flex flex-col gap-0.5 text-xs font-medium text-slate-600 dark:text-slate-400">
                <div className="relative w-24 h-5 flex items-center overflow-hidden dark:bg-slate-900 rounded px-1 p-2 dark:border-slate-800">
                  {/* Sliding Truck */}
                  <Truck
                    aria-hidden="true"
                    className="absolute left-1 size-3.5 text-orange-500 transition-all duration-800 delay-100 ease-in-out transform group-hover:translate-x-32 group-hover:opacity-0 group-hover:size-7"
                  />
                  {/* Arriving Checked Box */}
                  <PackageCheck
                    aria-hidden="true"
                    className=" size-3.5 text-blue-950 dark:text-orange-500 opacity-0 translate-x-32 transition-all duration-700 delay-100 ease-in-out transform group-hover:translate-x-0 group-hover:opacity-100 group-hover:size-6 "
                  />
                </div>
                <span className="text-slate-500 text-[11px] sm:text-xs">
                  Fee:{" "}
                  <strong className="text-slate-900 dark:text-slate-100 font-semibold">
                    {formatPrice(vendor.deliveryFee)}
                  </strong>
                </span>
              </div>

              {/* Functional Link Hint - hidden on mobile viewports for cleaner aesthetics */}
              <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-orange-500 mt-1">
                Browse
                <ArrowRight
                  aria-hidden="true"
                  className="size-3 transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </span>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}

export { VendorCard };
