import { PRODUCT_CATEGORIES } from "@/schemas/productSchema"
import type { Vendor } from "@/types/vendor"

export type VendorGroup = { category: string; vendors: Vendor[] }

/**
 * Groups vendors by their primary (first) category so each vendor appears
 * exactly once. Known categories keep their canonical order; any others follow
 * alphabetically.
 */
export function groupVendorsByCategory(vendors: Vendor[]): VendorGroup[] {
  const groups = new Map<string, Vendor[]>()
  for (const vendor of vendors) {
    const category = vendor.categories[0] ?? "Other"
    groups.set(category, [...(groups.get(category) ?? []), vendor])
  }

  const rank = (category: string) => {
    const index = (PRODUCT_CATEGORIES as readonly string[]).indexOf(category)
    return index === -1 ? PRODUCT_CATEGORIES.length : index
  }

  return [...groups.entries()]
    .sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b))
    .map(([category, groupVendors]) => ({ category, vendors: groupVendors }))
}
