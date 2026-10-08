import type { LucideIcon } from "lucide-react";

type DashboardPageHeaderProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  action?: React.ReactNode;
};

export function DashboardPageHeader({
  title,
  description,
  icon: Icon,
  action,
}: DashboardPageHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
      <div className="flex min-w-0 items-center gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-blue-950 text-primary">
          <Icon aria-hidden="true" className="size-5" />
        </span>
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {action}
    </header>
  );
}
