"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, CircleAlert, ShoppingCart } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CartLineItem } from "@/components/shared/CartLineItem"
import { CartSummary } from "@/components/shared/CartSummary"
import { DeliveryWindowSelector } from "@/components/shared/DeliveryWindowSelector"
import { EmptyState } from "@/components/shared/EmptyState"
import { OrderConfirmation } from "@/components/shared/OrderConfirmation"
import { useDeliveryWindows } from "@/hooks/useDeliveryWindows"
import { usePlaceOrder } from "@/hooks/useOrders"
import { useVendor } from "@/hooks/useVendors"
import { useCartStore, useCartSubtotal } from "@/store/cartStore"
import { MOCK_EMPLOYEE_ID } from "@/lib/constants"
import { confirmOrderSchema } from "@/schemas/orderSchema"
import type { ConfirmOrderValues, Order } from "@/types/order"

export default function CartPage() {
  const {
    vendorId,
    items,
    deliveryWindowId,
    decreaseQuantity,
    increaseQuantity,
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

  const subtotal = useCartSubtotal()

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
      <div className="mx-auto flex w-full max-w-lg flex-col gap-6 p-6">
        <OrderConfirmation order={confirmedOrder} />
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <div className="flex flex-col gap-3">
        <Link
          href="/storefront/vendors"
          className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to vendors
        </Link>
        <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-accent via-accent/60 to-transparent p-5">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-950 text-orange-400 shadow-sm dark:ring-1 dark:ring-white/15">
            <ShoppingCart aria-hidden="true" className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Your cart</h1>
            <p className="text-sm text-muted-foreground">
              Check your items, pick a delivery window, and you&apos;re done.
            </p>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid items-start gap-6 lg:grid-cols-[1fr_20rem]"
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              {items.map((item) => (
                <CartLineItem
                  key={item.productId}
                  item={item}
                  onDecrease={decreaseQuantity}
                  onIncrease={increaseQuantity}
                  onRemove={removeItem}
                />
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
          </div>

          <div className="flex flex-col gap-4">
            <CartSummary
              subtotal={subtotal}
              deliveryFee={vendor?.deliveryFee ?? 0}
              isSubmitting={placeOrder.isPending}
            />

            {placeOrder.isError && (
              <Alert variant="destructive">
                <CircleAlert />
                <AlertTitle>Unable to place order</AlertTitle>
                <AlertDescription>
                  Something went wrong placing your order. Please try again.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </form>
      )}
    </div>
  )
}
