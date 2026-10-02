"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { CircleAlert, Loader2, Plus, Trash2 } from "lucide-react"
import { useFieldArray, useForm, useWatch } from "react-hook-form"


import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import {
  WEEKDAYS,
  WEEKDAY_LABELS,
  deliverySettingsSchema,
} from "@/schemas/deliverySettingsSchema"
import type {
  DeliverySettingsFormValues,
  DeliverySettingsInput,
} from "@/types/deliverySettings"

import type { FieldError } from "react-hook-form"

const DEFAULT_VALUES: DeliverySettingsInput = {
  availableDays: [],
  timeWindows: [{ label: "", startTime: "", endTime: "" }],
  deliveryFee: "",
}

/** One input in a time-window row, with a visually hidden label and its error. */
function WindowField({
  id,
  label,
  error,
  ...inputProps
}: React.ComponentProps<typeof Input> & {
  id: string
  label: string
  error?: FieldError
}) {
  return (
    <div className="flex flex-1 flex-col gap-1.5">
      <Label htmlFor={id} className="sr-only">
        {label}
      </Label>
      <Input id={id} aria-invalid={!!error} {...inputProps} />
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error.message}
        </p>
      )}
    </div>
  )
}

function DeliverySettingsForm({
  defaultValues,
  isSubmitting,
  submitError,
  onSubmit,
}: {
  defaultValues?: DeliverySettingsFormValues
  isSubmitting?: boolean
  submitError?: string
  onSubmit: (values: DeliverySettingsFormValues) => void
}) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DeliverySettingsInput, unknown, DeliverySettingsFormValues>({
    resolver: zodResolver(deliverySettingsSchema),
    defaultValues: defaultValues ?? DEFAULT_VALUES,
    mode: "onTouched",
  })

  const { fields, append, remove } = useFieldArray({ control, name: "timeWindows" })
  const availableDays = useWatch({ control, name: "availableDays" })

  function toggleDay(day: (typeof WEEKDAYS)[number]) {
    const next = availableDays.includes(day)
      ? availableDays.filter((d) => d !== day)
      : [...availableDays, day]
    setValue("availableDays", next, { shouldValidate: true })
  }

  return (
    <form onSubmit={(e) => { void handleSubmit(onSubmit)(e); }} className="flex flex-col gap-6" noValidate>
      <div className="flex flex-col gap-1.5">
        <Label>Available days</Label>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Available days">
          {WEEKDAYS.map((day) => (
            <Button
              key={day}
              type="button"
              size="sm"
              disabled={isSubmitting}
              variant={availableDays.includes(day) ? "default" : "outline"}
              aria-pressed={availableDays.includes(day)}
              onClick={() => { toggleDay(day); }}
            >
              {WEEKDAY_LABELS[day]}
            </Button>
          ))}
        </div>
        {errors.availableDays && (
          <p role="alert" className="text-sm text-destructive">
            {errors.availableDays.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Label>Time windows</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isSubmitting}
            onClick={() => { append({ label: "", startTime: "", endTime: "" }); }}
          >
            <Plus />
            Add window
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          {fields.map((field, index) => {
            const windowErrors = errors.timeWindows?.[index]
            return (
              <div
                key={field.id}
                className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-start"
              >
                <WindowField
                  id={`window-${index}-label`}
                  label="Window name"
                  placeholder="e.g. Morning"
                  error={windowErrors?.label}
                  disabled={isSubmitting}
                  {...register(`timeWindows.${index}.label`)}
                />

                <div className="flex flex-1 gap-2">
                  <WindowField
                    id={`window-${index}-start`}
                    label="Start time"
                    type="time"
                    error={windowErrors?.startTime}
                    disabled={isSubmitting}
                    {...register(`timeWindows.${index}.startTime`)}
                  />
                  <WindowField
                    id={`window-${index}-end`}
                    label="End time"
                    type="time"
                    error={windowErrors?.endTime}
                    disabled={isSubmitting}
                    {...register(`timeWindows.${index}.endTime`)}
                  />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="shrink-0"
                  disabled={isSubmitting || fields.length === 1}
                  aria-label="Remove this time window"
                  onClick={() => { remove(index); }}
                >
                  <Trash2 className="text-destructive" />
                </Button>
              </div>
            )
          })}
        </div>
        {errors.timeWindows?.message && (
          <p role="alert" className="text-sm text-destructive">
            {errors.timeWindows.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="delivery-fee">Delivery fee (GHS)</Label>
        <Input
          id="delivery-fee"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          className="max-w-40"
          aria-invalid={!!errors.deliveryFee}
          disabled={isSubmitting}
          {...register("deliveryFee")}
        />
        {errors.deliveryFee && (
          <p role="alert" className="text-sm text-destructive">
            {errors.deliveryFee.message}
          </p>
        )}
      </div>

      {submitError && (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>Unable to save delivery settings</AlertTitle>
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      <div className={cn("flex justify-end")}>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {isSubmitting ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  )
}

export { DeliverySettingsForm }
