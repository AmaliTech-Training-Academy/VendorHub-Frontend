"use client";
import type { LucideIcon } from "lucide-react";

export function HeroChip({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-white/20 bg-slate-950/35 px-3 py-2 backdrop-blur-sm">
      <dt className="sr-only">{label}</dt>
      <Icon aria-hidden="true" className="size-4 text-orange-300" />
      <dd className="font-medium">{children}</dd>
    </div>
  );
}
