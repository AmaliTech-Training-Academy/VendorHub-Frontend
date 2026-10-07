import { PackageX } from "lucide-react";

import { EmptyState } from "@/components/shared/EmptyState";
import { StorefrontProductCard } from "@/components/shared/StorefrontProductCard";
import { VendorSloganTicker } from "@/components/shared/VendorSloganTicker";
import { useCartStore } from "@/store/cartStore";
import type { VendorProduct } from "@/types/product";
import type { Vendor } from "@/types/vendor";

export function ProductsSection({
  vendor,
  products,
  onAdd,
}: {
  vendor?: Vendor;
  products: VendorProduct[];
  onAdd: (product: VendorProduct) => void;
}) {
  const { items, increaseQuantity, decreaseQuantity } = useCartStore();

  if (products.length === 0) {
    return (
      <EmptyState
        icon={PackageX}
        title="No products in stock"
        description="This vendor has no available products right now."
      />
    );
  }

  return (
    <section
      aria-labelledby="vendor-menu-heading"
      className="flex flex-col gap-4"
    >
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-primary">
            From {vendor?.name ?? "your local vendor"}
          </p>
          <h2 id="vendor-menu-heading" className="text-xl font-semibold">
            Today&apos;s selection
          </h2>
        </div>
        <span className="text-sm text-muted-foreground">
          {products.length} {products.length === 1 ? "item" : "items"}
        </span>
      </div>

      <VendorSloganTicker slogans={vendor?.slogans ?? []} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {products.map((product, index) => (
          <StorefrontProductCard
            key={product.id}
            product={product}
            quantityInCart={
              items.find((item) => item.productId === product.id)?.quantity ?? 0
            }
            index={index}
            onAdd={onAdd}
            onIncrease={increaseQuantity}
            onDecrease={decreaseQuantity}
          />
        ))}
      </div>
    </section>
  );
}
