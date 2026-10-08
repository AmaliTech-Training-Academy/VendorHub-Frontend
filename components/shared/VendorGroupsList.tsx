import { Filter } from "lucide-react";

import { EmptyState } from "@/components/shared/EmptyState";
import { VendorCard } from "@/components/shared/VendorCard";
import { VendorList } from "@/components/shared/VendorList";
import { Button } from "@/components/ui/button";
import type { VendorGroup } from "@/types/vendor";

type VendorGroupsListProps = {
  groups: VendorGroup[];
  onResetFilters: () => void;
};

export function VendorGroupsList({
  groups,
  onResetFilters,
}: VendorGroupsListProps) {
  if (groups.length === 0) {
    return (
      <EmptyState
        icon={Filter}
        title="No vendors match these filters"
        description="Widen the delivery fee range or choose another category."
        action={
          <Button type="button" variant="outline" onClick={onResetFilters}>
            Reset filters
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-8">
      {groups.map((group) => (
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
  );
}
