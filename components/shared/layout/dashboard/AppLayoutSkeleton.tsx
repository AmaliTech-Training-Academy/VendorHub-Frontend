import { Skeleton } from "@/components/ui/skeleton";

export function AppLayoutSkeleton() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background animate-pulse">
      {/* Ghost Sidebar */}
      <div className="hidden w-64 border-r border-border bg-card p-5 md:flex flex-col gap-4">
        <Skeleton className="h-9 w-32 rounded-xl bg-muted/60" />
        <div className="space-y-3 mt-8">
          <Skeleton className="h-8 w-full rounded-lg bg-muted/50" />
          <Skeleton className="h-8 w-full rounded-lg bg-muted/50" />
          <Skeleton className="h-8 w-5/6 rounded-lg bg-muted/50" />
          <Skeleton className="h-8 w-full rounded-lg bg-muted/50" />
        </div>
      </div>

      {/* Main Panel Content Wrap */}
      <div className="flex flex-1 flex-col">
        {/* Ghost Header Bar */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
          <Skeleton className="h-5 w-40 rounded bg-muted/60" />
          <div className="flex items-center gap-3">
            <Skeleton className="size-8 rounded-full bg-muted/60" />
            <Skeleton className="h-4 w-20 rounded bg-muted/50" />
          </div>
        </header>

        {/* Ghost Body Elements */}
        <main className="flex-1 p-6 space-y-6 overflow-auto">
          <div className="space-y-2">
            <Skeleton className="h-8 w-1/4 rounded-xl bg-muted/70" />
            <Skeleton className="h-4 w-2/5 rounded bg-muted/40" />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Skeleton className="h-28 rounded-2xl bg-muted/40" />
            <Skeleton className="h-28 rounded-2xl bg-muted/40" />
            <Skeleton className="h-28 rounded-2xl bg-muted/40" />
          </div>
          <Skeleton className="h-72 w-full rounded-2xl bg-muted/40" />
        </main>
      </div>
    </div>
  );
}
