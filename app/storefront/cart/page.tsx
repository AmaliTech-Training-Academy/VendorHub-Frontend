"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { CartSummary } from "@/components/shared/CartSummary"
import { DeliveryWindowSelector } from "@/components/shared/DeliveryWindowSelector"
import { EmptyState } from "@/components/shared/EmptyState"
import { OrderConfirmation } from "@/components/shared/OrderConfirmation"
import { useDeliveryWindows } from "@/hooks/useDeliveryWindows"
import { usePlaceOrder } from "@/hooks/useOrders"
import { useVendor } from "@/hooks/useVendors"
import { useCartStore } from "@/store/cartStore"
import { MOCK_EMPLOYEE_ID } from "@/lib/constants"
import { formatPrice } from "@/lib/utils"
import {
  confirmOrderSchema,
  type ConfirmOrderValues,
  type Order,
} from "@/types/order"

export default function CartPage() {
  const {
    vendorId,
    items,
    deliveryWindowId,
    updateQuantity,
    removeItem,
    setDeliveryWindow,
    clearCart,
  } = useCartStore()

  const { data: deliveryWindows } = useDeliveryWindows()
  const { data: vendor } = useVendor(vendorId ?? "")
  const placeOrder = usePlaceOrder()
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null)

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfirmOrderValues>({
    resolver: zodResolver(confirmOrderSchema),
    defaultValues: { deliveryWindowId: deliveryWindowId ?? "" },
  })

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  )

  function onSubmit(data: ConfirmOrderValues) {
    if (!vendorId) return
    placeOrder.mutate(
      {
        vendorId,
        employeeId: MOCK_EMPLOYEE_ID,
        items,
        deliveryWindowId: data.deliveryWindowId,
      },
      {
        onSuccess: (order) => {
          setConfirmedOrder(order)
          clearCart()
        },
      }
    )
  }

  if (confirmedOrder) {
    return (
      <div className="mx-auto flex max-w-lg flex-col gap-6 p-6">
        <OrderConfirmation order={confirmedOrder} />
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <Link
          href="/storefront/vendors"
          className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to vendors
        </Link>
        <h1 className="text-xl font-semibold">Your cart</h1>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          description="Browse vendors to add products to your order."
          action={
            <Link href="/storefront/vendors">
              <Button variant="outline" className="mt-2">
                Browse vendors
              </Button>
            </Link>
          }
        />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {formatPrice(item.price)} each
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Decrease quantity of ${item.name}`}
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  >
                    <Minus />
                  </Button>
                  <span className="w-6 text-center text-sm">{item.quantity}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Increase quantity of ${item.name}`}
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  >
                    <Plus />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Remove ${item.name} from cart`}
                    onClick={() => removeItem(item.productId)}
                  >
                    <Trash2 className="text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <DeliveryWindowSelector
            windows={deliveryWindows ?? []}
            value={watch("deliveryWindowId")}
            onChange={(id) => {
              setValue("deliveryWindowId", id, { shouldValidate: true })
              setDeliveryWindow(id)
            }}
            error={errors.deliveryWindowId?.message}
          />

          <CartSummary
            subtotal={subtotal}
            deliveryFee={vendor?.deliveryFee ?? 0}
            isSubmitting={placeOrder.isPending}
          />

          {placeOrder.isError && (
            <p role="alert" className="text-sm text-destructive">
              Something went wrong placing your order. Please try again.
            </p>
          )}
        </form>
      )}
    </div>
  )
}
