import { cn } from "@/lib/utils"

/**
 * Card grid that sizes itself to how many vendors it holds, so a short group
 * doesn't leave an empty column: 3+ use three columns, 2 fill the row, and a
 * lone vendor stays at a readable width instead of stretching across the page.
 */
function VendorList({
  children,
  count,
}: {
  children: React.ReactNode
  count?: number
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4",
        count === 1 && "max-w-md",
        count === 2 && "sm:grid-cols-2",
        (count === undefined || count > 2) && "sm:grid-cols-2 lg:grid-cols-3"
      )}
    >
      {children}
    </div>
  )
}

export { VendorList }
