import { PRODUCT_CATEGORIES } from "@/schemas/productSchema";
import type { DeliveryFeeRange, Vendor, VendorGroup } from "@/types/vendor";

/**
 * Groups vendors by their primary (first) category so each vendor appears
 * exactly once. Known categories keep their canonical order; any others follow
 * alphabetically.
 */
export function groupVendorsByCategory(vendors: Vendor[]): VendorGroup[] {
  const groups = new Map<string, Vendor[]>();
  for (const vendor of vendors) {
    const category = vendor.categories[0] ?? "Other";
    groups.set(category, [...(groups.get(category) ?? []), vendor]);
  }

  const rank = (category: string) => {
    const index = (PRODUCT_CATEGORIES as readonly string[]).indexOf(category);
    return index === -1 ? PRODUCT_CATEGORIES.length : index;
  };

  return [...groups.entries()]
    .sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b))
    .map(([category, groupVendors]) => ({ category, vendors: groupVendors }));
}

/**
 * A range spanning every fee isn't a filter. Returning null keeps vendors
 * with no listed fee visible instead of hiding them as soon as the sliders
 * are touched.
 */
export function normalizeFeeRange(
  range: DeliveryFeeRange,
  feeRangeLimit: number,
): DeliveryFeeRange | null {
  return range.minimum <= 0 && range.maximum >= feeRangeLimit ? null : range;
}

export function filterVendorGroups(
  groups: VendorGroup[],
  selectedCategory: string | null,
  feeRange: DeliveryFeeRange | null,
): VendorGroup[] {
  return groups
    .filter((group) => !selectedCategory || group.category === selectedCategory)
    .map((group) => ({
      ...group,
      vendors: group.vendors.filter((vendor) => {
        if (!feeRange) {
          return true;
        }
        return (
          vendor.deliveryFee !== null &&
          vendor.deliveryFee >= feeRange.minimum &&
          vendor.deliveryFee <= feeRange.maximum
        );
      }),
    }))
    .filter((group) => group.vendors.length > 0);
}

export function countVendorsInGroups(
  groups: VendorGroup[],
  category: string | null = null,
): number {
  return groups.reduce(
    (count, group) =>
      count +
      (category === null || group.category === category
        ? group.vendors.length
        : 0),
    0,
  );
}
