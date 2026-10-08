import { formatPrice } from "@/lib/utils";
import type { DeliveryFeeRange } from "@/types/vendor";

type DeliveryFeeFilterProps = {
  feeRange: DeliveryFeeRange | null;
  highestDeliveryFee: number;
  feeRangeLimit: number;
  onChange: (range: DeliveryFeeRange) => void;
};

export function DeliveryFeeFilter({
  feeRange,
  highestDeliveryFee,
  feeRangeLimit,
  onChange,
}: DeliveryFeeFilterProps) {
  const currentRange = feeRange ?? { minimum: 0, maximum: feeRangeLimit };

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-sm font-medium">Delivery fee</legend>
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="text-muted-foreground">
          {feeRange ? "Selected range" : "Any fee"}
        </span>
        <span className="font-medium tabular-nums">
          {formatPrice(currentRange.minimum)}
          {" – "}
          {formatPrice(currentRange.maximum)}
        </span>
      </div>
      <label className="flex flex-col gap-2 text-xs text-muted-foreground">
        <span>Minimum fee</span>
        <input
          type="range"
          min={0}
          max={feeRangeLimit}
          step={0.01}
          value={currentRange.minimum}
          disabled={highestDeliveryFee === 0}
          aria-label="Minimum delivery fee"
          onChange={(event) => {
            const minimum = Number(event.target.value);
            onChange({
              minimum,
              maximum: Math.max(minimum, currentRange.maximum),
            });
          }}
          className="h-2 w-full cursor-pointer accent-primary disabled:cursor-not-allowed disabled:opacity-50"
        />
      </label>
      <label className="flex flex-col gap-2 text-xs text-muted-foreground">
        <span>Maximum fee</span>
        <input
          type="range"
          min={0}
          max={feeRangeLimit}
          step={0.01}
          value={currentRange.maximum}
          disabled={highestDeliveryFee === 0}
          aria-label="Maximum delivery fee"
          onChange={(event) => {
            const maximum = Number(event.target.value);
            onChange({
              minimum: Math.min(currentRange.minimum, maximum),
              maximum,
            });
          }}
          className="h-2 w-full cursor-pointer accent-primary disabled:cursor-not-allowed disabled:opacity-50"
        />
      </label>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatPrice(0)}</span>
        <span>{formatPrice(feeRangeLimit)}</span>
      </div>
    </fieldset>
  );
}
