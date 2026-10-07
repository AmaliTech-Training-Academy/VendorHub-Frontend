import { Coffee, Sparkles, Store, Truck } from "lucide-react";

const ICONS = [Sparkles, Coffee, Truck, Store];

/**
 * Scrolling strip of the vendor's own slogans. Renders nothing when the vendor
 * has none, so no made-up copy is shown under a real vendor's name.
 */
export function VendorSloganTicker({ slogans }: { slogans: string[] }) {
  const messages = slogans.filter((slogan) => slogan.trim().length > 0);
  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="overflow-hidden border-y border-border/70 py-2.5">
      <p className="sr-only">{messages.join(" ")}</p>
      {/* Duplicated so the CSS marquee can loop seamlessly. */}
      <div
        aria-hidden="true"
        className="vendor-message-track flex w-max items-center"
      >
        {[...messages, ...messages].map((message, index) => {
          const Icon = ICONS[index % ICONS.length];
          return (
            <span
              key={index}
              className="flex shrink-0 items-center gap-2.5 pr-7 text-xs text-muted-foreground sm:text-sm"
            >
              <Icon className="size-3.5 text-primary/70" />
              {message}
              <span className="ml-4 size-1 rounded-full bg-primary/60" />
            </span>
          );
        })}
      </div>
    </div>
  );
}
