import { Skeleton } from "@/components/ui/skeleton"

function VendorCatalogueSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      aria-busy="true"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      <span role="status" className="sr-only">
        Loading catalogue…
      </span>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="flex flex-col gap-2 rounded-lg border border-border p-4"
        >
          <div className="flex items-start justify-between gap-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-5 w-14" />
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="mt-1 flex justify-end">
            <Skeleton className="h-8 w-28" />
          </div>
        </div>
      ))}
    </div>
  )
}

export { VendorCatalogueSkeleton }
