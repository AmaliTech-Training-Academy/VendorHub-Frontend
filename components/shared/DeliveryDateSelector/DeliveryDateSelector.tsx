"use client"

import { CalendarDays } from "lucide-react"
import { useId } from "react"

import type { DeliveryDateOption } from "@/lib/deliveryDates"
import { cn } from "@/lib/utils"

function DeliveryDateSelector({
  dates,
  value,
  onChange,
  error,
}: {
  dates: DeliveryDateOption[]
  value: string | undefined
  onChange: (deliveryDate: string) => void
  error?: string
}) {
  const errorId = useId()

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1 flex items-center gap-2 text-sm font-medium">
        <CalendarDays aria-hidden="true" className="size-4 text-primary" />
        Choose a delivery date
      </legend>
      {dates.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          This vendor has no delivery days available in the next two weeks.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {dates.map((date) => {
            const selected = value === date.value
            return (
              <label
                key={date.value}
                className={cn(
                  "relative flex cursor-pointer items-center justify-center rounded-xl border bg-card p-3 text-sm transition-colors has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
                  selected
                    ? "border-primary bg-primary/10 font-medium"
                    : "border-border hover:bg-muted/50"
                )}
              >
                <input
                  type="radio"
                  name="delivery-date"
                  value={date.value}
                  checked={selected}
                  aria-describedby={error ? errorId : undefined}
                  onChange={() => { onChange(date.value); }}
                  className="sr-only"
                />
                {date.label}
              </label>
            )
          })}
        </div>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </fieldset>
  )
}

export { DeliveryDateSelector }
