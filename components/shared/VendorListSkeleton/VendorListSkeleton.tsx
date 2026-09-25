import { Skeleton } from "@/components/ui/skeleton"

function VendorListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      aria-busy="true"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <span role="status" className="sr-only">
        Loading vendors…
      </span>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
        >
          <Skeleton className="h-24 w-full rounded-none" />
          <div className="flex flex-col gap-3 p-4">
            <Skeleton className="h-5 w-36" />
            <div className="flex gap-1.5">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      ))}
    </div>
  )
}

export { VendorListSkeleton }
