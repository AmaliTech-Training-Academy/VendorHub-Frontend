// components/shared/layout/storefront/StorefrontLayoutSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function StorefrontLayoutSkeleton() {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-border bg-[#102A54] flex items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-6">
          {/* Logo brand node */}
          <Skeleton className="h-8 w-32 bg-white/20" />
          {/* Main top tabs */}
          <div className="hidden md:flex gap-4">
            <Skeleton className="h-8 w-24 rounded-lg bg-white/10" />
            <Skeleton className="h-8 w-28 rounded-lg bg-white/10" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-16 rounded-lg bg-white/10" />
          <Skeleton className="size-8 rounded-full bg-white/20" />
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-8 flex-1">
        {/* Large Hero Marketing Banner */}
        <Skeleton className="w-full h-48 sm:h-64 rounded-2xl bg-muted/70" />

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Left filter bar widget structure */}
          <aside className="w-full md:w-56 shrink-0 space-y-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-full rounded-md" />
            </div>
            <div className="space-y-3 pt-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-6 w-full rounded" />
            </div>
          </aside>

          {/* Right Product/Vendor Grid Area */}
          <section className="flex-1 w-full space-y-8">
            {/* Top row category title fallback */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-24" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Skeleton className="h-48 rounded-2xl" />
              </div>
            </div>

            {/* Main grid category grouping section */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-20" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Skeleton className="h-48 rounded-2xl" />
                <Skeleton className="h-48 rounded-2xl" />
                <Skeleton className="h-48 rounded-2xl" />
                <Skeleton className="h-48 rounded-2xl" />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
