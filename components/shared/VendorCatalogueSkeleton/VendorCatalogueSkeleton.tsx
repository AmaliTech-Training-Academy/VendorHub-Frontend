import { Skeleton } from "@/components/ui/skeleton"

function VendorCatalogueSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div aria-busy="true" className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <span role="status" className="sr-only">
        Loading catalogue…
      </span>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="flex gap-4 rounded-2xl border border-border bg-card p-4"
        >
          <Skeleton className="size-16 shrink-0 rounded-xl" />
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-5 w-14" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="mt-1 flex items-center justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-8 w-16 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export { VendorCatalogueSkeleton }
