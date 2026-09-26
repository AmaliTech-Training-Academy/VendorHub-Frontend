"use client";

import { CircleAlert, Store, Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EmptyState } from "@/components/shared/EmptyState";
import { VendorCard } from "@/components/shared/VendorCard";
import { VendorListSkeleton } from "@/components/shared/VendorListSkeleton";
import { useVendors } from "@/hooks/useVendors";
import { groupVendorsByCategory } from "@/lib/vendors";
import { useState } from "react";
import { VendorList } from "@/components/shared/VendorList";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/StorefrontHeader";

export default function VendorsPage() {
  const { data: vendors, isPending, isError } = useVendors();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const groups = vendors ? groupVendorsByCategory(vendors) : [];
  const visibleGroups = groups.filter(
    (group) => !selectedCategory || group.category === selectedCategory,
  );

  const vendorsByCategory = vendors
    ? vendors.reduce<Record<string, typeof vendors>>((acc, vendor) => {
        vendor.categories.forEach((category) => {
          if (!acc[category]) acc[category] = [];
          acc[category].push(vendor);
        });
        return acc;
      }, {})
    : {};

  return (
    <div className="flex w-full flex-col gap-6 p-6">
      <PageHeader
        title="Hungry? Here's who's open"
        description="Pick a local vendor, fill your workspace basket, and we'll coordinate delivery to your desk."
        icon={Store}
        badgeText="Fast Desk Delivery"
        badgeIcon={Clock}
      />

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

      {/* Netflix Horizontal Row Layout */}
      {vendors && vendors.length > 0 && (
        <div className="flex flex-col gap-8">
          {groups.length > 1 && (
            <div
              role="group"
              aria-label="Filter vendors by category"
              className="sticky top-0 z-10 -mx-6 flex flex-wrap gap-2 bg-background/85 px-6 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/70"
            >
              <Button
                size="sm"
                className="rounded-full"
                variant={selectedCategory ? "outline" : "default"}
                aria-pressed={!selectedCategory}
                onClick={() => setSelectedCategory(null)}
              >
                All ({vendors.length})
              </Button>
              {groups.map((group) => (
                <Button
                  key={group.category}
                  size="sm"
                  className="rounded-full"
                  variant={
                    selectedCategory === group.category ? "default" : "outline"
                  }
                  aria-pressed={selectedCategory === group.category}
                  onClick={() => setSelectedCategory(group.category)}
                >
                  {group.category} ({group.vendors.length})
                </Button>
              ))}
            </div>
          )}

          {visibleGroups.map((group) => (
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
                  <VendorCard key={vendor.id} vendor={vendor} index={index} />
                ))}
              </VendorList>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
