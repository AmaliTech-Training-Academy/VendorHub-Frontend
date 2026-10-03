import { PackageOpen, type LucideIcon } from "lucide-react"

function EmptyState({
  title,
  description,
  action,
  icon: Icon = PackageOpen,
}: {
  title: string
  description: string
  action?: React.ReactNode
  icon?: LucideIcon
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-16 text-center">
      <div className="mb-1 flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-7" />
      </div>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
      {action}
    </div>
  )
}

export { EmptyState }
