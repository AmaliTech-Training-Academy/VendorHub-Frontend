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
          className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:p-5"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="size-12 shrink-0 rounded-xl" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-5 w-32" />
              <div className="flex gap-1.5">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-8 w-28 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

export { VendorListSkeleton }
