import { Skeleton } from "@/components/ui/skeleton"

function OrderHistorySkeleton({ count = 3 }: { count?: number }) {
  return (
    <div aria-busy="true" className="flex flex-col gap-3">
      <span role="status" className="sr-only">
        Loading your orders…
      </span>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex flex-col gap-3 rounded-lg border border-border p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-44" />
            </div>
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="flex items-center justify-between border-t border-border pt-3">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}

export { OrderHistorySkeleton }
