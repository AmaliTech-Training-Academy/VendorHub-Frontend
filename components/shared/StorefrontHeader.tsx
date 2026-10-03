import { type LucideIcon, Clock } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  badgeText?: string;
  badgeIcon?: LucideIcon;
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  badgeText = "Fast Desk Delivery",
  badgeIcon: BadgeIcon = Clock,
}: PageHeaderProps) {
  return (
    <div className="dark:bg-slate-900/50 rounded-lg p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800">
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4 sm:items-center min-w-0">
          {/* Brand Icon Frame */}
          <div className="flex size-12 sm:size-14 shrink-0 items-center justify-center rounded-xl bg-blue-950 text-orange-500 shadow-sm">
            <Icon aria-hidden="true" className="size-5 sm:size-6" />
          </div>

          {/* Typography Clusters */}
          <div className="grid gap-0.5 min-w-0">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl text-blue-950 dark:text-slate-50">
              {title}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md font-normal leading-relaxed sm:whitespace-normal">
              {description}
            </p>
          </div>
        </div>

        {/* Informational Action Pill */}
        <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white dark:bg-slate-950 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 self-start sm:self-auto w-fit">
          <BadgeIcon className="size-4 text-orange-500" />
          <span>{badgeText}</span>
        </div>
      </div>
    </div>
  );
}
