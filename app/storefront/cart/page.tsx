"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CircleAlert, ShoppingCart } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CartLineItem } from "@/components/shared/CartLineItem";
import { CartSummary } from "@/components/shared/CartSummary";
import { DeliveryWindowSelector } from "@/components/shared/DeliveryWindowSelector";
import { EmptyState } from "@/components/shared/EmptyState";
import { OrderConfirmation } from "@/components/shared/OrderConfirmation";
import { useDeliveryWindows } from "@/hooks/useDeliveryWindows";
import { usePlaceOrder } from "@/hooks/useOrders";
import { useVendor } from "@/hooks/useVendors";
import { useCartStore, useCartSubtotal } from "@/store/cartStore";
import { MOCK_EMPLOYEE_ID } from "@/lib/constants";
import { confirmOrderSchema } from "@/schemas/orderSchema";
import type { ConfirmOrderValues, Order } from "@/types/order";

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
  } = useCartStore();

  const { data: deliveryWindows } = useDeliveryWindows();
  const { data: vendor } = useVendor(vendorId ?? "");
  const placeOrder = usePlaceOrder();
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfirmOrderValues>({
    resolver: zodResolver(confirmOrderSchema),
    defaultValues: { deliveryWindowId: deliveryWindowId ?? "" },
  });

  const subtotal = useCartSubtotal();

  function onSubmit(data: ConfirmOrderValues) {
    if (!vendorId) return;
    placeOrder.mutate(
      {
        vendorId,
        employeeId: MOCK_EMPLOYEE_ID,
        items,
        deliveryWindowId: data.deliveryWindowId,
      },
      {
        onSuccess: (order) => {
          setConfirmedOrder(order);
          clearCart();
        },
      },
    );
  }

  if (confirmedOrder) {
    return (
      <div className="mx-auto flex max-w-lg flex-col gap-6 p-6">
        <OrderConfirmation order={confirmedOrder} />
      </div>
    );
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
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
              setValue("deliveryWindowId", id, { shouldValidate: true });
              setDeliveryWindow(id);
            }}
            error={errors.deliveryWindowId?.message}
          />

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
        </form>
      )}
    </div>
  );
}
