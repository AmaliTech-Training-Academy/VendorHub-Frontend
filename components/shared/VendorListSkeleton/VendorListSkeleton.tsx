import { Skeleton } from "@/components/ui/skeleton"

function VendorListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      aria-busy="true"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      <span role="status" className="sr-only">
        Loading vendors…
      </span>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="flex flex-col gap-3 rounded-lg border border-border p-4"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 shrink-0" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
          <Skeleton className="h-5 w-36" />
        </div>
      ))}
    </div>
  )
}

export { VendorListSkeleton }
