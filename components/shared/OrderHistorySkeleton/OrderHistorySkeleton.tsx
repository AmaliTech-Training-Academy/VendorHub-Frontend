import { Skeleton } from "@/components/ui/skeleton"

function OrderHistorySkeleton({ count = 3 }: { count?: number }) {
  return (
    <div aria-busy="true" className="flex flex-col gap-4">
      <span role="status" className="sr-only">
        Loading your orders…
      </span>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="flex flex-col gap-4 rounded-2xl border border-l-4 border-border bg-card p-4 sm:p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <Skeleton className="size-11 shrink-0 rounded-xl" />
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-44" />
              </div>
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="flex justify-between">
            {Array.from({ length: 5 }, (_, step) => (
              <div key={step} className="flex flex-1 flex-col items-center gap-1.5">
                <Skeleton className="size-6 rounded-full" />
                <Skeleton className="h-3 w-10" />
              </div>
            ))}
          </div>
          <Skeleton className="h-16 w-full rounded-xl" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}

export { OrderHistorySkeleton }
