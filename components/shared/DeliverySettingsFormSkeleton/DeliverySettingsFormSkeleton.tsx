import { Skeleton } from "@/components/ui/skeleton"

function DeliverySettingsFormSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-6">
      <span role="status" className="sr-only">
        Loading delivery settings…
      </span>
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-4 w-28" />
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 7 }, (_, index) => (
            <Skeleton key={index} className="h-8 w-14" />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-40" />
      </div>
    </div>
  )
}

export { DeliverySettingsFormSkeleton }
