"use client"

import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import type { DeliveryWindow } from "@/types/order"

function DeliveryWindowSelector({
  windows,
  value,
  onChange,
  error,
}: {
  windows: DeliveryWindow[]
  value: string
  onChange: (deliveryWindowId: string) => void
  error?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="delivery-window">Delivery window</Label>
      <Select
        id="delivery-window"
        value={value}
        aria-invalid={!!error}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled>
          Select a delivery window
        </option>
        {windows.map((window) => (
          <option key={window.id} value={window.id} disabled={!window.available}>
            {window.label}
            {!window.available ? " (fully booked)" : ""}
          </option>
        ))}
      </Select>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

export { DeliveryWindowSelector }
