import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const TONES = {
  default: "bg-primary/10 text-primary",
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
} as const

function StatCard({
  icon: Icon,
  label,
  value,
  tone = "default",
}: {
  icon: LucideIcon
  label: string
  value: string | number
  tone?: keyof typeof TONES
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-xl",
          TONES[tone]
        )}
      >
        <Icon aria-hidden="true" className="size-5" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-2xl font-semibold tabular-nums">{value}</span>
      </div>
    </div>
  )
}

export { StatCard }
