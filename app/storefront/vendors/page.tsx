"use client";

import { CircleAlert, Store, Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EmptyState } from "@/components/shared/EmptyState";
import { VendorCard } from "@/components/shared/VendorCard";
import { VendorListSkeleton } from "@/components/shared/VendorListSkeleton";
import { useVendors } from "@/hooks/useVendors";
import { PageHeader } from "@/components/shared/StorefrontHeader";

const DISPLAY_CATEGORIES = [
  "Groceries",
  "Beverages",
  "Produce",
  "Bakery",
  "Dairy",
  "Household",
];

export default function VendorsPage() {
  const { data: vendors, isPending, isError } = useVendors();

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
    <div className="flex w-full flex-col gap-6 md:gap-8  mx-auto p-4 md:p-6 overflow-hidden">
      {/* Header Area Wrapper */}
      <PageHeader
        title="Hungry? Here's who's open"
        description="Pick a local vendor, fill your workspace basket, and we'll coordinate delivery to your desk."
        icon={Store}
        badgeText="Fast Desk Delivery"
        badgeIcon={Clock}
      />
      {/* Main Content Layout  */}
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
        <div className="flex flex-col gap-6 md:gap-8">
          {DISPLAY_CATEGORIES.map((category) => {
            const currentGroupVendors = vendorsByCategory[category] || [];

            if (currentGroupVendors.length === 0) return null;

            return (
              <div key={category} className="flex flex-col gap-2.5">
                {/* Category Header Section */}
                <div className="flex items-baseline justify-between px-1">
                  <h2 className="text-base font-bold tracking-tight text-blue-950 dark:text-slate-50 sm:text-lg">
                    {category}
                  </h2>
                  <span className="text-[11px] font-medium text-slate-400">
                    {currentGroupVendors.length} active
                  </span>
                </div>

                {/* Slider Component Window Area */}
                <div className="relative w-full">
                  <div className="flex w-full gap-3.5 overflow-x-auto pb-2 pt-1 snap-x scroll-smooth scrollbar-none [&::-webkit-scrollbar]:hidden">
                    {currentGroupVendors.map((vendor, index) => (
                      <div
                        key={vendor.id}
                        className="w-70 sm:w-85 shrink-0 snap-start"
                      >
                        <VendorCard vendor={vendor} index={index} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
