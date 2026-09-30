"use client";

import {
  ChevronDown,
  CircleAlert,
  Clock,
  Coffee,
  Filter,
  RotateCcw,
  Store,
  Truck,
} from "lucide-react";
import { useState } from "react";

import { EmptyState } from "@/components/shared/EmptyState";
import {
  PageHeader,
  type PageHeaderSlide,
} from "@/components/shared/StorefrontHeader";
import { VendorCard } from "@/components/shared/VendorCard";
import { VendorList } from "@/components/shared/VendorList";
import { VendorListSkeleton } from "@/components/shared/VendorListSkeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useVendors } from "@/hooks/useVendors";
import { formatPrice } from "@/lib/utils";
import {
  filterVendorGroups,
  groupVendorsByCategory,
  type DeliveryFeeRange,
} from "@/lib/vendors";

const directorySlides: [PageHeaderSlide, ...PageHeaderSlide[]] = [
  {
    eyebrow: "LOCAL FAVORITES, DELIVERED",
    title: "Hungry? Here's who's open",
    description:
      "Find neighborhood favorites, browse fresh menus, and get delivery straight to your desk.",
    icon: Store,
    badgeText: "Fast desk delivery",
    badgeIcon: Clock,
    backgroundImage: "/vendor-1.jpg",
  },
  {
    eyebrow: "MAKE ROOM FOR A BETTER BREAK",
    title: "Your next favorite is nearby",
    description:
      "Explore local kitchens and discover something good for the workday.",
    icon: Coffee,
    badgeText: "Fresh local menus",
    badgeIcon: Store,
    backgroundImage: "/ve2.jpg",
  },
  {
    eyebrow: "A LITTLE EASIER, EVERY DAY",
    title: "Good food, right to your desk",
    description:
      "Choose a vendor, build your order, and let delivery come to you.",
    icon: Truck,
    badgeText: "Browse nearby vendors",
    badgeIcon: Clock,
    backgroundImage: "/happy.jpg",
  },
];

function DeliveryFeeFilter({
  feeRange,
  highestDeliveryFee,
  feeRangeLimit,
  onChange,
}: {
  feeRange: DeliveryFeeRange | null;
  highestDeliveryFee: number;
  feeRangeLimit: number;
  onChange: (range: DeliveryFeeRange) => void;
}) {
  const currentRange = feeRange ?? { minimum: 0, maximum: feeRangeLimit };

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-sm font-medium">Delivery fee</legend>
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="text-muted-foreground">
          {feeRange ? "Selected range" : "Any fee"}
        </span>
        <span className="font-medium tabular-nums">
          {formatPrice(currentRange.minimum)}
          {" – "}
          {formatPrice(currentRange.maximum)}
        </span>
      </div>
      <label className="flex flex-col gap-2 text-xs text-muted-foreground">
        <span>Minimum fee</span>
        <input
          type="range"
          min={0}
          max={feeRangeLimit}
          step={0.01}
          value={currentRange.minimum}
          disabled={highestDeliveryFee === 0}
          aria-label="Minimum delivery fee"
          onChange={(event) => {
            const minimum = Number(event.target.value);
            onChange({
              minimum,
              maximum: Math.max(minimum, currentRange.maximum),
            });
          }}
          className="h-2 w-full cursor-pointer accent-primary disabled:cursor-not-allowed disabled:opacity-50"
        />
      </label>
      <label className="flex flex-col gap-2 text-xs text-muted-foreground">
        <span>Maximum fee</span>
        <input
          type="range"
          min={0}
          max={feeRangeLimit}
          step={0.01}
          value={currentRange.maximum}
          disabled={highestDeliveryFee === 0}
          aria-label="Maximum delivery fee"
          onChange={(event) => {
            const maximum = Number(event.target.value);
            onChange({
              minimum: Math.min(currentRange.minimum, maximum),
              maximum,
            });
          }}
          className="h-2 w-full cursor-pointer accent-primary disabled:cursor-not-allowed disabled:opacity-50"
        />
      </label>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatPrice(0)}</span>
        <span>{formatPrice(feeRangeLimit)}</span>
      </div>
    </fieldset>
  );
}

export default function VendorsPage() {
  const { data: vendors, isPending, isError } = useVendors();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [feeRange, setFeeRange] = useState<DeliveryFeeRange | null>(null);

  const groups = vendors ? groupVendorsByCategory(vendors) : [];
  const feeFilteredGroups = filterVendorGroups(groups, null, feeRange);
  const highestDeliveryFee = Math.max(
    0,
    ...(vendors ?? []).flatMap((vendor) =>
      vendor.deliveryFee === null ? [] : [vendor.deliveryFee],
    ),
  );
  const feeRangeLimit =
    highestDeliveryFee > 0 ? Number(highestDeliveryFee.toFixed(2)) : 1;
  const visibleGroups = filterVendorGroups(groups, selectedCategory, feeRange);
  const matchingVendorCount = feeFilteredGroups.reduce(
    (count, group) => count + group.vendors.length,
    0,
  );

  function resetFilters() {
    setSelectedCategory(null);
    setFeeRange(null);
  }

  function selectCategory(category: string | null) {
    setSelectedCategory(category);
  }

  return (
    <div className="flex w-full flex-col gap-6 p-6">
      <PageHeader slides={directorySlides} />

      {isPending && <VendorListSkeleton />}
      {isError && (
        <Alert variant="destructive" className="rounded-xl">
          <CircleAlert />
          <AlertTitle>Unable to load vendors</AlertTitle>
          <AlertDescription>
            Something went wrong loading vendors. Please try again.
          </AlertDescription>
        </Alert>
      )}
      {vendors && vendors.length === 0 && (
        <EmptyState
          icon={Store}
          title="No vendors available"
          description="Check back later for active vendors."
        />
      )}

      {vendors && vendors.length > 0 && (
        <div className="grid items-start gap-8 lg:grid-cols-[14rem_minmax(0,1fr)]">
          <div className="flex min-w-0 flex-col gap-4 lg:sticky lg:top-24">
            <div className="flex flex-col gap-3 lg:hidden">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold">Browse categories</h2>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  disabled={!selectedCategory && !feeRange}
                >
                  <RotateCcw aria-hidden="true" />
                  Reset
                </Button>
              </div>
              <div className="-mx-6 overflow-x-auto px-6 pb-1">
                <div className="flex w-max gap-2">
                  <Button
                    type="button"
                    size="sm"
                    className="rounded-full"
                    variant={!selectedCategory ? "default" : "outline"}
                    aria-pressed={!selectedCategory}
                    onClick={() => {
                      selectCategory(null);
                    }}
                  >
                    All ({matchingVendorCount})
                  </Button>
                  {groups.map((group) => {
                    const count =
                      feeFilteredGroups.find(
                        (feeFilteredGroup) =>
                          feeFilteredGroup.category === group.category,
                      )?.vendors.length ?? 0;

                    return (
                      <Button
                        key={group.category}
                        type="button"
                        size="sm"
                        className="rounded-full"
                        variant={
                          selectedCategory === group.category
                            ? "default"
                            : "outline"
                        }
                        aria-pressed={selectedCategory === group.category}
                        onClick={() => {
                          selectCategory(group.category);
                        }}
                      >
                        {group.category} ({count})
                      </Button>
                    );
                  })}
                </div>
              </div>
              <details className="group border-b border-border pb-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-2 text-sm font-medium">
                  <span>Delivery fee range</span>
                  <span className="flex items-center gap-2 text-muted-foreground">
                    {feeRange
                      ? `${formatPrice(feeRange.minimum)} – ${formatPrice(feeRange.maximum)}`
                      : "Any fee"}
                    <ChevronDown
                      aria-hidden="true"
                      className="size-4 transition-transform group-open:rotate-180"
                    />
                  </span>
                </summary>
                <div className="pt-3">
                  <DeliveryFeeFilter
                    feeRange={feeRange}
                    highestDeliveryFee={highestDeliveryFee}
                    feeRangeLimit={feeRangeLimit}
                    onChange={setFeeRange}
                  />
                </div>
              </details>
            </div>

            <aside className="hidden flex-col gap-6 border-r border-border pr-6 lg:flex">
              <div className="flex items-center justify-between gap-2">
                <h2 className="flex items-center gap-2 font-semibold">
                  <Filter aria-hidden="true" className="size-4 text-primary" />
                  Filters
                </h2>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  disabled={!selectedCategory && !feeRange}
                  aria-label="Reset filters"
                >
                  <RotateCcw aria-hidden="true" />
                  Reset
                </Button>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-medium">Category</h3>
                <div
                  role="group"
                  aria-label="Filter vendors by category"
                  className="flex flex-col gap-1"
                >
                  <Button
                    type="button"
                    variant={!selectedCategory ? "secondary" : "ghost"}
                    className="w-full justify-between"
                    aria-pressed={!selectedCategory}
                    onClick={() => {
                      selectCategory(null);
                    }}
                  >
                    All vendors
                    <span className="text-muted-foreground">
                      {matchingVendorCount}
                    </span>
                  </Button>
                  {groups.map((group) => (
                    <Button
                      key={group.category}
                      type="button"
                      variant={
                        selectedCategory === group.category
                          ? "secondary"
                          : "ghost"
                      }
                      className="w-full justify-between"
                      aria-pressed={selectedCategory === group.category}
                      onClick={() => {
                        selectCategory(group.category);
                      }}
                    >
                      {group.category}
                      <span className="text-muted-foreground">
                        {feeFilteredGroups.find(
                          (feeFilteredGroup) =>
                            feeFilteredGroup.category === group.category,
                        )?.vendors.length ?? 0}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>

              <DeliveryFeeFilter
                feeRange={feeRange}
                highestDeliveryFee={highestDeliveryFee}
                feeRangeLimit={feeRangeLimit}
                onChange={setFeeRange}
              />
            </aside>
          </div>

          <div className="flex min-w-0 flex-col gap-8">
            {visibleGroups.length === 0 ? (
              <EmptyState
                icon={Filter}
                title="No vendors match these filters"
                description="Widen the delivery fee range or choose another category."
                action={
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetFilters}
                  >
                    Reset filters
                  </Button>
                }
              />
            ) : (
              visibleGroups.map((group) => (
                <section
                  key={group.category}
                  aria-labelledby={`vendors-${group.category}`}
                  className="flex flex-col gap-3"
                >
                  <div className="flex items-baseline justify-between px-1">
                    <h2
                      id={`vendors-${group.category}`}
                      className="text-lg font-semibold tracking-tight"
                    >
                      {group.category}
                    </h2>
                    <span className="text-sm text-muted-foreground">
                      {group.vendors.length}{" "}
                      {group.vendors.length === 1 ? "vendor" : "vendors"}
                    </span>
                  </div>
                  <VendorList count={group.vendors.length}>
                    {group.vendors.map((vendor, index) => (
                      <VendorCard
                        key={vendor.id}
                        vendor={vendor}
                        index={index}
                      />
                    ))}
                  </VendorList>
                </section>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
