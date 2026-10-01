"use client"

import { Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import type { DeliveryWindow } from "@/types/order"

function DeliveryWindowSelector({
  windows,
  value,
  onChange,
  error,
}: {
  windows: DeliveryWindow[]
  value: number | undefined
  onChange: (deliveryWindowId: number) => void
  error?: string
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1 flex items-center gap-2 text-sm font-medium">
        <Clock aria-hidden="true" className="size-4 text-primary" />
        Choose a delivery window
      </legend>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {windows.map((window) => {
          const selected = value === window.id
          return (
            <label
              key={window.id}
              className={cn(
                "relative flex cursor-pointer items-center justify-between gap-2 rounded-xl border bg-card p-3 text-sm transition-colors has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
                selected
                  ? "border-primary bg-primary/10 font-medium"
                  : "border-border hover:bg-muted/50"
              )}
            >
              <input
                type="radio"
                name="delivery-window"
                value={window.id}
                checked={selected}
                aria-invalid={!!error}
                onChange={() => { onChange(window.id); }}
                className="sr-only"
              />
              <span>{window.label}</span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {window.startTime}–{window.endTime}
              </span>
            </label>
          )
        })}
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </fieldset>
  )
}

export { DeliveryWindowSelector }
